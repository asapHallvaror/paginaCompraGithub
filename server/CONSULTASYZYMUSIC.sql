--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- CONSULTAS PARA LAS TABLAS
select * from facturas
select * from detalle_factura
select * from historial_facturas
select * from usuario
select * from trigger_logs
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- TRIGGER NÚMERO 1: trg_ActualizarHistorialFactura
-- Este trigger lo creamos para asegurar que cualquier cambio en el estado de una factura
-- (ya sea en estado_factura o estado_entrega) quede registrado automáticamente
-- tanto en la tabla historial_facturas como en trigger_logs. De esta forma,
-- mantenemos un seguimiento claro de los cambios importantes que ocurren en las facturas.

CREATE OR ALTER TRIGGER trg_ActualizarHistorialFactura
ON facturas
AFTER UPDATE
AS
BEGIN
-- Si se actualiza el estado de la factura (creada, rectificada, anulada)
    IF UPDATE(estado_factura)
    BEGIN
-- Insertamos un registro en historial_facturas con la información relevante del cambio
        INSERT INTO historial_facturas (
            numero_orden,
            estado_nuevo,
            motivo_rechazo,
            direccion_entrega,
            rut_receptor,
            foto_evidencia
        )
        SELECT
            i.numero_orden,
            i.estado_factura,
            i.motivo_rechazo,
            i.direccion_entrega,
            i.rut_receptor,
            i.foto_evidencia
        FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
		-- Nos aseguramos de que realmente haya un cambio en el estado
        WHERE ISNULL(i.estado_factura, '') <> ISNULL(d.estado_factura, '');
		-- También insertamos un mensaje en trigger_logs para dejar constancia del cambio
        INSERT INTO trigger_logs (numero_orden, mensaje)
        SELECT 
            i.numero_orden,
            CONCAT('Cambio en estado_factura a "', i.estado_factura, '"')
        FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.estado_factura, '') <> ISNULL(d.estado_factura, '');
    END
	-- Si se actualiza el estado de entrega (por ejemplo: por entregar, entregada, rechazada)
    IF UPDATE(estado_entrega)
    BEGIN
	    -- Guardamos el cambio en historial_facturas con todos los datos relevantes
        INSERT INTO historial_facturas (
            numero_orden,
            estado_nuevo,
            motivo_rechazo,
            direccion_entrega,
            rut_receptor,
            foto_evidencia
        )
        SELECT
            i.numero_orden,
            i.estado_entrega,
            i.motivo_rechazo,
            i.direccion_entrega,
            i.rut_receptor,
            i.foto_evidencia
        FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        -- Validamos que haya existido un cambio real en el estado de entrega
        WHERE ISNULL(i.estado_entrega, '') <> ISNULL(d.estado_entrega, '');

        -- Registramos el cambio en trigger_logs para que quede trazado
        INSERT INTO trigger_logs (numero_orden, mensaje)
        SELECT 
            i.numero_orden,
            CONCAT('Cambio en estado_entrega a "', i.estado_entrega, '"')
        FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.estado_entrega, '') <> ISNULL(d.estado_entrega, '');
    END
END;

-- CONSULTA PARA LA TABLA TRIGGER_LOGS
select * from trigger_logs;

-- CONSULTA PARA VERIFICAR EN HISTORIAL_FACTURAS
select * from historial_facturas;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- TRIGGER 2: trg_ManejoEliminacionFactura
-- Creamos este trigger para manejar de forma controlada la eliminación de facturas.
-- En lugar de permitir un DELETE directo, aplicamos una eliminación lógica (marcando la factura como eliminada).
-- Además, dejamos registro del evento en las tablas de historial y logs para asegurar la trazabilidad del sistema.

CREATE OR ALTER TRIGGER trg_ManejoEliminacionFactura
ON facturas
INSTEAD OF DELETE
AS
BEGIN
    -- Validamos que no se puedan eliminar facturas que ya están entregadas o anuladas.
    -- Esta restricción evita perder información importante o finalizada.
    IF EXISTS (
        SELECT 1
        FROM deleted
        WHERE estado_entrega = 'entregada'
           OR estado_factura = 'anulada'
    )
    BEGIN
        RAISERROR('No se puede eliminar una factura que está entregada o anulada.', 16, 1);
        RETURN;
    END

    -- Evitamos que una factura ya marcada como eliminada se vuelva a eliminar.
    -- Esto protege la integridad de los datos y evita múltiples registros de un mismo evento.
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN facturas f ON f.numero_orden = d.numero_orden
        WHERE f.eliminada = 1
    )
    BEGIN
        RAISERROR('La factura ya fue eliminada anteriormente.', 16, 1);
        RETURN;
    END

    -- Realizamos la eliminación lógica.
    -- Marcamos la factura como eliminada en lugar de borrarla realmente.
    UPDATE f
    SET eliminada = 1
    FROM facturas f
    JOIN deleted d ON f.numero_orden = d.numero_orden;

    -- Registramos la acción en trigger_logs para fines de auditoría.
    -- Esto nos permite saber qué factura fue eliminada, cuándo, y dejar un mensaje descriptivo.
    INSERT INTO trigger_logs (numero_orden, mensaje, fecha)
    SELECT 
        d.numero_orden,
        CONCAT('Factura ', d.numero_orden, ' marcada como eliminada (eliminación lógica)'),
        GETDATE()
    FROM deleted d;

    -- También registramos el evento en historial_facturas.
    -- Así llevamos un registro histórico del estado de todas las facturas, incluso si son eliminadas.
    INSERT INTO historial_facturas (
        numero_orden,
        estado_nuevo,
        fecha_cambio
    )
    SELECT
        d.numero_orden,
        'eliminada',
        GETDATE()
    FROM deleted d;
END;


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- TRIGGER 3: trg_InsertarHistorialAlCrearFactura
-- Creamos este trigger para que cada vez que se cree una nueva factura,
-- se registre automáticamente su estado inicial tanto en historial_facturas como en trigger_logs.
-- De esta forma aseguramos que desde el momento de creación se tenga trazabilidad completa.

CREATE OR ALTER TRIGGER trg_InsertarHistorialAlCrearFactura
ON facturas
AFTER INSERT
AS
BEGIN
    -- Insertamos en historial_facturas el estado inicial de la factura recién creada.
    -- Esto permite llevar un seguimiento desde el primer momento en que la factura entra al sistema.
    INSERT INTO historial_facturas (
        numero_orden,
        estado_nuevo,
        fecha_cambio
    )
    SELECT
        i.numero_orden,
        i.estado_factura,
        GETDATE()
    FROM inserted i;

    -- También registramos el evento en trigger_logs, indicando que se creó una factura
    -- y que fue registrada en el historial correctamente.
    INSERT INTO trigger_logs (numero_orden, mensaje, fecha)
    SELECT 
        i.numero_orden,
        CONCAT('Factura ', i.numero_orden, ' creada e historial inicial registrado'),
        GETDATE()
    FROM inserted i;
END;

-- CONSULTA PARA VERIFICAR LA ACCIÓN DEL TRIGGER
select * from trigger_logs;
-- CONSULTA PARA VERIFICAR EL HISTORIAL DE LA FACTURA
select * from historial_facturas;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- TRIGGER 4: trg_LogCambiosCliente
-- Creamos este trigger para llevar un registro detallado de los cambios realizados
-- en los datos del cliente de una factura. De esta forma, cada vez que se modifique
-- información sensible como nombre, dirección, correo o teléfono del cliente, quedará
-- registrado en trigger_logs para su posterior revisión o auditoría.

CREATE OR ALTER TRIGGER trg_LogCambiosCliente
ON facturas
AFTER UPDATE
AS
BEGIN
    -- Declaramos variables para construir el mensaje con los campos modificados
    DECLARE @cambios NVARCHAR(MAX) = '';
    DECLARE @numero_orden INT;

    -- Obtenemos el número de orden afectado (asumimos una sola fila por UPDATE)
    SELECT TOP 1 @numero_orden = i.numero_orden FROM inserted i;

    -- Comparamos nombre_cliente entre el valor nuevo (inserted) y el anterior (deleted)
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.nombre_cliente, '') <> ISNULL(d.nombre_cliente, '')
    )
        SET @cambios = @cambios + 'nombre_cliente, ';

    -- Comparamos dirección del cliente
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.direccion_cliente, '') <> ISNULL(d.direccion_cliente, '')
    )
        SET @cambios = @cambios + 'direccion_cliente, ';

    -- Comparamos correo del cliente
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.correo_cliente, '') <> ISNULL(d.correo_cliente, '')
    )
        SET @cambios = @cambios + 'correo_cliente, ';

    -- Comparamos teléfono del cliente
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.telefono_cliente, '') <> ISNULL(d.telefono_cliente, '')
    )
        SET @cambios = @cambios + 'telefono_cliente, ';

    -- Si hubo cambios, eliminamos la coma final y registramos el evento en trigger_logs
    IF LEN(@cambios) > 0
    BEGIN
        SET @cambios = LEFT(@cambios, LEN(@cambios) - 1);

        INSERT INTO trigger_logs (numero_orden, mensaje, fecha)
        VALUES (
            @numero_orden,
            CONCAT('Datos del cliente modificados: ', @cambios),
            GETDATE()
        );
    END
END;

-- CONSULTA PARA VERIFICAR LA ACCIÓN DEL TRIGGER
SELECT * FROM trigger_logs;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- TRIGGER 5: trg_CambioDireccionDespacho
-- Creamos este trigger para registrar los cambios relacionados con el lugar de despacho
-- de las facturas. Consideramos importante llevar un historial sobre cualquier modificación
-- en la dirección, comuna o región de envío, ya que son datos logísticos clave para el correcto
-- cumplimiento del proceso de entrega.

CREATE OR ALTER TRIGGER trg_CambioDireccionDespacho
ON facturas
AFTER UPDATE
AS
BEGIN
    -- Variables para almacenar los campos modificados y el número de orden afectado
    DECLARE @cambios NVARCHAR(MAX) = '';
    DECLARE @numero_orden INT;

    -- Capturamos el número de orden modificado
    SELECT TOP 1 @numero_orden = i.numero_orden FROM inserted i;

    -- Verificamos si cambió la dirección de despacho
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.direccionDespacho, '') <> ISNULL(d.direccionDespacho, '')
    )
        SET @cambios = @cambios + 'direccionDespacho, ';

    -- Verificamos si cambió la región de despacho
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.regionDespacho, '') <> ISNULL(d.regionDespacho, '')
    )
        SET @cambios = @cambios + 'regionDespacho, ';

    -- Verificamos si cambió la comuna de despacho
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.numero_orden = d.numero_orden
        WHERE ISNULL(i.comunaDespacho, '') <> ISNULL(d.comunaDespacho, '')
    )
        SET @cambios = @cambios + 'comunaDespacho, ';

    -- Si hubo cambios, los registramos en trigger_logs
    IF LEN(@cambios) > 0
    BEGIN
        SET @cambios = LEFT(@cambios, LEN(@cambios) - 1); -- Quitamos la coma final

        INSERT INTO trigger_logs (numero_orden, mensaje, fecha)
        VALUES (
            @numero_orden,
            CONCAT('Cambio en datos de despacho: ', @cambios),
            GETDATE()
        );
    END
END;

-- CONSULTA PARA VERIFICAR ACCIÓN DEL TRIGGER
SELECT * FROM trigger_logs;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- FUNCIÓN 1
CREATE OR ALTER FUNCTION fn_ResumenFactura (@numero_orden INT)
RETURNS TABLE
AS
RETURN (
    SELECT
        f.numero_orden,
        f.rut_proveedor,
        f.razon_social_proveedor,
        f.nombre_cliente,
        f.fecha_orden,
        f.estado_factura,
        f.estado_entrega,
        ISNULL(SUM(df.total), 0) AS total_calculado
    FROM facturas f
    LEFT JOIN detalle_factura df ON f.numero_orden = df.numero_orden
    WHERE f.numero_orden = @numero_orden
    GROUP BY f.numero_orden, f.rut_proveedor, f.razon_social_proveedor, f.nombre_cliente,
             f.fecha_orden, f.estado_factura, f.estado_entrega
);

SELECT * FROM dbo.fn_ResumenFactura(3);


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--FUNCIÓN 2

CREATE OR ALTER FUNCTION fn_DetalleCambiosFactura (@numero_orden INT)
RETURNS @resultado TABLE (
    numero_orden INT,
    cantidad_modificaciones INT,
    ultima_modificacion DATETIME,
    estado_mas_reciente VARCHAR(50),
    mensaje VARCHAR(100)
)
AS
BEGIN
    -- 1. Verificar si la factura existe
    IF NOT EXISTS (SELECT 1 FROM facturas WHERE numero_orden = @numero_orden)
    BEGIN
        INSERT INTO @resultado
        VALUES (
            @numero_orden,
            0,
            NULL,
            NULL,
            'La factura no existe'
        );
        RETURN;
    END

    -- 2. Verificar si tiene historial
    IF EXISTS (SELECT 1 FROM historial_facturas WHERE numero_orden = @numero_orden)
    BEGIN
        INSERT INTO @resultado
        SELECT 
            @numero_orden,
            COUNT(*),
            MAX(fecha_cambio),
            MAX(estado_nuevo),
            'Factura con historial de cambios'
        FROM historial_facturas
        WHERE numero_orden = @numero_orden;
    END
    ELSE
    BEGIN
        INSERT INTO @resultado
        VALUES (
            @numero_orden,
            0,
            NULL,
            NULL,
            'Factura sin historial de cambios'
        );
    END

    RETURN;
END

--CONSULTAS DE PRUEBA

-- Factura existente con cambios
SELECT * FROM fn_DetalleCambiosFactura(4);

-- Factura que no existe (va a imprimir en mensaje que no existe)
SELECT * FROM fn_DetalleCambiosFactura(999);

-- Factura existente pero sin historial de cambios
SELECT * FROM fn_DetalleCambiosFactura(1); 

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- FUNCIÓN 3

CREATE OR ALTER FUNCTION fn_ResumenDetalleFactura (@numero_orden INT)
RETURNS @resumen TABLE (
    numero_orden INT,
    nombre_producto VARCHAR(100),
    precio_unitario INT,
    cantidad INT,
    total_producto INT,
    subtotal INT,
    iva INT,
    total_final INT,
    mensaje VARCHAR(200)
)
AS
BEGIN
    -- Validar si la factura existe
    IF NOT EXISTS (SELECT 1 FROM facturas WHERE numero_orden = @numero_orden)
    BEGIN
        INSERT INTO @resumen
        VALUES (@numero_orden, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Factura no existe');
        RETURN;
    END

    -- Validar si hay productos
    IF NOT EXISTS (SELECT 1 FROM detalle_factura WHERE numero_orden = @numero_orden)
    BEGIN
        INSERT INTO @resumen
        VALUES (@numero_orden, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Factura sin productos asociados');
        RETURN;
    END

    DECLARE @subtotal INT = (
        SELECT SUM(precio_unitario * cantidad)
        FROM detalle_factura
        WHERE numero_orden = @numero_orden
    );

    DECLARE @iva INT = ROUND(@subtotal * 0.19, 0);
    DECLARE @total INT = @subtotal + @iva;

    -- Insertar fila por cada producto
    INSERT INTO @resumen
    SELECT
        df.numero_orden,
        df.nombre_producto,
        df.precio_unitario,
        df.cantidad,
        df.precio_unitario * df.cantidad AS total_producto,
        @subtotal,
        @iva,
        @total,
        'Factura con productos y totales calculados correctamente'
    FROM detalle_factura df
    WHERE df.numero_orden = @numero_orden;

    RETURN;
END;

SELECT * FROM fn_ResumenDetalleFactura(4);

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- PROCEDIMIENTO 1

CREATE OR ALTER PROCEDURE sp_ResumenGeneralFacturas
AS
BEGIN
    SELECT 
        COUNT(*) AS total_facturas,
        SUM(CASE WHEN estado_factura = 'creada' THEN 1 ELSE 0 END) AS creadas,
        SUM(CASE WHEN estado_factura = 'rectificada' THEN 1 ELSE 0 END) AS rectificadas,
        SUM(CASE WHEN estado_factura = 'anulada' THEN 1 ELSE 0 END) AS anuladas,
        SUM(CASE WHEN eliminada = 1 THEN 1 ELSE 0 END) AS eliminadas
    FROM facturas;
END;

-- EJECUCIÓN DEL PROCEDIMIENTO:
EXEC sp_ResumenGeneralFacturas;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- PROCEDIMIENTO 2

CREATE OR ALTER PROCEDURE sp_AnularFactura (@numero_orden INT)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM facturas WHERE numero_orden = @numero_orden)
    BEGIN
        RAISERROR('La factura no existe.', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM facturas WHERE numero_orden = @numero_orden AND estado_factura = 'anulada'
    )
    BEGIN
        RAISERROR('La factura ya está anulada.', 16, 1);
        RETURN;
    END

    UPDATE facturas
    SET estado_factura = 'anulada'
    WHERE numero_orden = @numero_orden;

    INSERT INTO historial_facturas (
        numero_orden,
        estado_nuevo,
        fecha_cambio
    )
    VALUES (
        @numero_orden,
        'anulada',
        GETDATE()
    );

    INSERT INTO trigger_logs (numero_orden, mensaje, fecha)
    VALUES (
        @numero_orden,
        'Factura anulada mediante procedimiento almacenado',
        GETDATE()
    );
END;

EXEC sp_AnularFactura @numero_orden = 3;

SELECT estado_factura FROM FACTURAS WHERE numero_orden = 3;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- PROCEDIMIENTO 3

CREATE OR ALTER PROCEDURE sp_GenerarResumenPorProveedor
    @rut_proveedor VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Verificar si el proveedor existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE RUT = @rut_proveedor)
    BEGIN
        RAISERROR('El proveedor ingresado no existe.', 16, 1);
        RETURN;
    END

    -- 2. Verificar si tiene facturas
    IF NOT EXISTS (SELECT 1 FROM facturas WHERE rut_proveedor = @rut_proveedor)
    BEGIN
        RAISERROR('El proveedor existe pero no tiene facturas registradas.', 16, 1);
        RETURN;
    END

    -- 3. Mostrar resumen de facturas
    SELECT
        rut_proveedor,
        COUNT(*) AS total_facturas,
        SUM(CASE WHEN estado_factura = 'creada' THEN 1 ELSE 0 END) AS facturas_creadas,
        SUM(CASE WHEN estado_factura = 'rectificada' THEN 1 ELSE 0 END) AS facturas_rectificadas,
        SUM(CASE WHEN estado_factura = 'anulada' THEN 1 ELSE 0 END) AS facturas_anuladas,
        SUM(CASE WHEN eliminada = 1 THEN 1 ELSE 0 END) AS facturas_eliminadas,
        SUM(CASE WHEN estado_entrega = 'entregada' THEN 1 ELSE 0 END) AS entregadas,
        SUM(CASE WHEN estado_entrega = 'por entregar' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado_entrega = 'rechazada' THEN 1 ELSE 0 END) AS rechazadas
    FROM facturas
    WHERE rut_proveedor = @rut_proveedor
    GROUP BY rut_proveedor;
END;


-- PROCEDIMIENTO CON UN USUARIO QUE TIENE FACTURAS REGISTRADAS.
EXEC sp_GenerarResumenPorProveedor @rut_proveedor = '75456765-2';

-- PROCEDIMIENTO CON UN USUARIO INEXISTENTE
EXEC sp_GenerarResumenPorProveedor @rut_proveedor = '21315887-2';

-- PROCEDIMIENTO CON UN USUARIO QUE NO TIENE FACTURAS REGISTRADAS
EXEC sp_GenerarResumenPorProveedor @rut_proveedor = '75432123-2';