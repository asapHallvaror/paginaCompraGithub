// Requisitos
const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Configuración SQL Server
const config = {
    user: 'sa',
    password: 'alvaroadmin123',
    server: 'localhost',
    database: 'yzymusic',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    port: 1433
};

sql.connect(config)
    .then(pool => {
        if (pool.connected) console.log('Conectado a SQL Server');
        global.sqlPool = pool;
    })
    .catch(err => console.error('Error de conexión a SQL Server:', err));

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '..', 'client', 'src', 'Components', 'Assets'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname);
    }
});
const upload = multer({ storage: storage });

// Rutas del API

app.get("/usuarios", (req, res) => {
    global.sqlPool.request()
        .query('SELECT * FROM usuario', (err, result) => {
            if (err) return res.status(500).send({ error: 'Database query error', message: err.message });
            res.send(result.recordset);
        });
});

app.get("/facturas", (req, res) => {
    const rut_proveedor = req.query.rut_proveedor;
    global.sqlPool.request()
        .input('rut_proveedor', sql.VarChar, rut_proveedor)
        .query('SELECT * FROM facturas WHERE rut_proveedor = @rut_proveedor', (err, result) => {
            if (err) return res.status(500).send({ error: 'Database query error', message: err.message });
            res.send(result.recordset);
        });
});

app.get('/api/factura/:id', async (req, res) => {
    const numero_orden = req.params.id;

    try {
        const request = global.sqlPool.request();
        request.input('numero_orden', sql.Int, numero_orden);

        // Obtener la factura
        const facturaResult = await request.query('SELECT * FROM facturas WHERE numero_orden = @numero_orden');
        if (facturaResult.recordset.length === 0) {
            return res.status(404).send({ error: 'Factura no encontrada' });
        }

        const factura = facturaResult.recordset[0];

        // Obtener los productos asociados a la factura
        const productosResult = await global.sqlPool.request()
            .input('numero_orden', sql.Int, numero_orden)
            .query('SELECT nombre_producto AS nombre, precio_unitario AS precio, cantidad, total FROM detalle_factura WHERE numero_orden = @numero_orden');

        // Agregar los productos al objeto factura
        factura.productos = productosResult.recordset;

        res.send(factura);
    } catch (err) {
        console.error('Error al obtener los detalles de la factura:', err.message);
        res.status(500).send({ error: 'Error en el servidor', message: err.message });
    }
});


app.post('/api/login', (req, res) => {
    const { rutEmpresa, password } = req.body;
    global.sqlPool.request()
        .input('rut', sql.VarChar, rutEmpresa)
        .input('password', sql.VarChar, password)
        .query('SELECT * FROM usuario WHERE RUT = @rut AND PASSWORD = @password', (err, result) => {
            if (err) return res.status(500).send({ error: 'Database query error' });
            if (result.recordset.length > 0) res.send({ success: true, user: result.recordset[0] });
            else res.send({ success: false, message: 'Credenciales inválidas' });
        });
});

app.post('/api/facturas', async (req, res) => {
    const facturaData = req.body;

    // Extraer y remover los productos del objeto
    const productos = JSON.parse(facturaData.productos);
    delete facturaData.productos;

    try {
        const request = global.sqlPool.request();

        // Agregar los inputs para la tabla facturas
        Object.entries(facturaData).forEach(([key, value]) => {
            request.input(key, value);
        });

        // Preparar la lista de columnas y parámetros
        const keys = Object.keys(facturaData).join(', ');
        const params = Object.keys(facturaData).map(k => `@${k}`).join(', ');

        // Insertar factura
        const insertFacturaQuery = `INSERT INTO facturas (${keys}) OUTPUT INSERTED.numero_orden VALUES (${params})`;
        const result = await request.query(insertFacturaQuery);
        const numeroOrdenGenerado = result.recordset[0].numero_orden;

        // Insertar detalle_factura para cada producto
        for (const producto of productos) {
            const { nombre, precio, cantidad, total } = producto;

            await global.sqlPool.request()
                .input('numero_orden', sql.Int, numeroOrdenGenerado)
                .input('nombre_producto', sql.VarChar, nombre)
                .input('precio_unitario', sql.Int, precio)
                .input('cantidad', sql.Int, cantidad)
                .input('total', sql.Int, total)
                .query(`INSERT INTO detalle_factura (numero_orden, nombre_producto, precio_unitario, cantidad, total)
                        VALUES (@numero_orden, @nombre_producto, @precio_unitario, @cantidad, @total)`);
        }

        res.send({ success: true, numero_orden: numeroOrdenGenerado });

    } catch (err) {
        console.error('Error al insertar factura y detalles:', err.message);
        res.status(500).send({ success: false, message: 'Error al guardar la factura', error: err.message });
    }
});


app.put('/api/factura/:id', async (req, res) => {
    const numero_orden = parseInt(req.params.id, 10);
    if (isNaN(numero_orden)) {
        console.warn('ID inválido recibido:', req.params.id);
        return res.status(400).send({ success: false, message: 'ID inválido' });
    }

    const updatedFactura = { ...req.body };
    delete updatedFactura.numero_orden; // ⚠️ Previene errores con IDENTITY

    try {
        const campos = Object.keys(updatedFactura);
        if (campos.length === 0) {
            return res.status(400).send({ success: false, message: 'No se proporcionaron campos para actualizar' });
        }

        const setClause = campos.map((key, i) => `${key} = @param${i}`).join(', ');
        const request = global.sqlPool.request();

        Object.values(updatedFactura).forEach((val, i) => request.input(`param${i}`, val));
        request.input('numero_orden', sql.Int, numero_orden);

        const updateQuery = `UPDATE facturas SET ${setClause} WHERE numero_orden = @numero_orden`;
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            // Verificamos si la factura existe
            const check = await global.sqlPool.request()
                .input('numero_orden', sql.Int, numero_orden)
                .query('SELECT 1 FROM facturas WHERE numero_orden = @numero_orden');

            if (check.recordset.length === 0) {
                console.warn(`⚠️ Factura ${numero_orden} no existe (verificación extra)`);
                return res.status(404).send({ success: false, message: 'Factura no encontrada' });
            }

            // Si existe pero no se actualizó (valores iguales o SET NOCOUNT ON)
            console.log(`ℹ️ Factura ${numero_orden} no cambió (o trigger oculta row count), pero se procesó correctamente`);
        }


        console.log(`Factura ${numero_orden} actualizada correctamente`);

        // Nota: el trigger se encargará de insertar en historial_facturas si se modificó estado_factura
        // Aquí solo informamos en consola por transparencia:
        if (updatedFactura.estado_factura?.toLowerCase() === 'rectificada') {
            console.log(`Trigger debería registrar el historial de la factura ${numero_orden} como 'rectificada'`);
        }

        res.send({ success: true, message: 'Factura actualizada correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar la factura:', err.message);
        res.status(500).send({ success: false, message: 'Error al actualizar la factura', error: err.message });
    }
});



app.put('/api/factura/:id/detalle', async (req, res) => {
    const numero_orden = req.params.id;
    const productos = req.body.productos;

    try {
        // Eliminar productos antiguos
        await global.sqlPool.request()
            .input('numero_orden', sql.Int, numero_orden)
            .query('DELETE FROM detalle_factura WHERE numero_orden = @numero_orden');

        // Insertar nuevos productos
        for (const producto of productos) {
            await global.sqlPool.request()
                .input('numero_orden', sql.Int, numero_orden)
                .input('nombre_producto', sql.VarChar, producto.nombre)
                .input('precio_unitario', sql.Int, producto.precio)
                .input('cantidad', sql.Int, producto.cantidad)
                .input('total', sql.Int, producto.total)
                .query(`
                    INSERT INTO detalle_factura (numero_orden, nombre_producto, precio_unitario, cantidad, total)
                    VALUES (@numero_orden, @nombre_producto, @precio_unitario, @cantidad, @total)
                `);
        }

        res.send({ success: true, message: 'Detalle de factura actualizado' });
    } catch (err) {
        console.error('Error al actualizar detalle_factura:', err.message);
        res.status(500).send({ success: false, message: 'Error al actualizar el detalle', error: err.message });
    }
});

app.put('/api/factura/anulacion/:id', async (req, res) => {
    const numero_orden = req.params.id;

    try {
        await global.sqlPool.request()
            .input('numero_orden', sql.Int, numero_orden)
            .input('estado_factura', sql.VarChar, 'anulada')
            .query('UPDATE facturas SET estado_factura = @estado_factura WHERE numero_orden = @numero_orden');

        res.send({ success: true, message: 'Factura anulada correctamente' });
    } catch (err) {
        console.error('Error al anular la factura:', err.message);
        res.status(500).send({ success: false, message: 'Error al anular factura', error: err.message });
    }
});


app.get('/api/factura/historial/:id', async (req, res) => {
    const numero_orden = parseInt(req.params.id, 10);

    try {
        const result = await global.sqlPool.request()
            .input('numero_orden', sql.Int, numero_orden)
            .query(`
                SELECT 
                    estado_nuevo,
                    motivo_rechazo,
                    direccion_entrega,
                    rut_receptor,
                    foto_evidencia,
                    fecha_cambio
                FROM historial_facturas
                WHERE numero_orden = @numero_orden
                ORDER BY fecha_cambio DESC
            `);

        res.send(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener historial de cambios:', err.message);
        res.status(500).send({ success: false, message: 'Error al consultar historial', error: err.message });
    }
});


app.put('/api/factura/estado/:id', upload.single('foto_evidencia'), async (req, res) => {
    const numero_orden = parseInt(req.params.id, 10);

    if (isNaN(numero_orden)) {
        return res.status(400).send({ success: false, message: 'ID inválido' });
    }

    const {
        estado_entrega,
        motivo_rechazo,
        direccion_entrega,
        rut_receptor
    } = req.body;

    const foto_evidencia = req.file ? req.file.filename : null;

    try {
        const request = global.sqlPool.request()
            .input('numero_orden', sql.Int, numero_orden)
            .input('estado_entrega', sql.VarChar, estado_entrega)
            .input('motivo_rechazo', sql.Text, motivo_rechazo || null)
            .input('direccion_entrega', sql.VarChar, direccion_entrega || null)
            .input('rut_receptor', sql.VarChar, rut_receptor || null)
            .input('foto_evidencia', sql.VarChar, foto_evidencia || null);

        const updateQuery = `
            UPDATE facturas
            SET estado_entrega = @estado_entrega,
                motivo_rechazo = @motivo_rechazo,
                direccion_entrega = @direccion_entrega,
                rut_receptor = @rut_receptor,
                foto_evidencia = @foto_evidencia
            WHERE numero_orden = @numero_orden
        `;

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            const check = await global.sqlPool.request()
                .input('numero_orden', sql.Int, numero_orden)
                .query('SELECT 1 FROM facturas WHERE numero_orden = @numero_orden');

            if (check.recordset.length === 0) {
                return res.status(404).send({ success: false, message: 'Factura no encontrada' });
            }

            console.log(`Factura ${numero_orden} no modificada (valores iguales o trigger con SET NOCOUNT ON)`);
        }

        console.log(`Estado de entrega actualizado para factura ${numero_orden}`);
        res.send({ success: true, message: 'Estado de entrega actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar estado de entrega:', err.message);
        res.status(500).send({ success: false, message: 'Error interno al actualizar', error: err.message });
    }
});


app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
