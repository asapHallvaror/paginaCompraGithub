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


app.put('/api/factura/:id', (req, res) => {
    const numero_orden = req.params.id;
    const updatedFactura = { ...req.body, estado_factura: 'rectificada' };

    const setClause = Object.keys(updatedFactura).map((key, i) => `${key} = @param${i}`).join(', ');
    const request = global.sqlPool.request();
    Object.values(updatedFactura).forEach((val, i) => request.input(`param${i}`, val));
    request.input('numero_orden', sql.Int, numero_orden);

    const query = `UPDATE facturas SET ${setClause} WHERE numero_orden = @numero_orden`;
    request.query(query, (err, result) => {
        if (err) return res.status(500).send({ error: 'Database query error', message: err.message });
        if (result.rowsAffected[0] > 0) res.send({ success: true, message: 'Factura actualizada con éxito' });
        else res.status(404).send({ error: 'Factura no encontrada' });
    });
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




app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
