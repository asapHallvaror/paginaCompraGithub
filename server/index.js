const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "yzymusic"
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Ruta hacia la carpeta Assets dentro de la estructura de carpetas
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ajusta esta ruta según la estructura de tu proyecto
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
    db.query('SELECT * FROM usuario', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        res.send(result);
    });
});

app.get("/facturas", (req, res) => {
    const rut_proveedor = req.query.rut_proveedor;
    db.query('SELECT * FROM facturas WHERE rut_proveedor = ?', [rut_proveedor], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        res.send(result);
    });
});

// Ruta para obtener detalles de una factura por numero_orden
app.get('/api/factura/:id', (req, res) => {
    const numero_orden = req.params.id;
    const query = 'SELECT * FROM facturas WHERE numero_orden = ?';

    db.query(query, [numero_orden], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles de la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});

app.get('/api/next-invoice-number', (req, res) => {
    const query = `SELECT AUTO_INCREMENT as nextInvoiceNumber
                   FROM information_schema.TABLES
                   WHERE TABLE_SCHEMA = 'yzymusic' AND TABLE_NAME = 'facturas'`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener el próximo número de factura:', err);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        res.send({ nextInvoiceNumber: result[0].nextInvoiceNumber });
    });
});

// Ruta para el login
app.post('/api/login', (req, res) => {
    const { rutEmpresa, password } = req.body;
    const query = 'SELECT * FROM usuario WHERE rut = ? AND password = ?';

    db.query(query, [rutEmpresa, password], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Database query error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            res.send({ success: true, user });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Ruta para insertar una nueva factura
app.post('/api/facturas', (req, res) => {
    const facturaData = req.body;
    const query = 'INSERT INTO facturas SET ?';

    db.query(query, facturaData, (err, result) => {
        if (err) {
            console.error('Error al insertar la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        console.log('Factura insertada correctamente');
        res.send({ success: true, numero_orden: result.insertId });
    });
});

// Ruta para actualizar una factura existente
app.put('/api/factura/:id', (req, res) => {
    const numero_orden = req.params.id;
    let updatedFactura = req.body;

    // Establecer el estado de la factura a "rectificada"
    updatedFactura.estado_factura = 'rectificada';

    // Generar la consulta de actualización
    const query = 'UPDATE facturas SET ? WHERE numero_orden = ?';
    
    db.query(query, [updatedFactura, numero_orden], (err, result) => {
        if (err) {
            console.error('Error al actualizar la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.affectedRows > 0) {
            res.send({ success: true, message: 'Factura actualizada con éxito' });
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});

// Ruta para insertar un detalle de factura
app.post('/api/detalles_facturas', (req, res) => {
    const detalleFacturaData = req.body;
    console.log('Received detalleFacturaData:', detalleFacturaData); // Log the received data
    const query = 'INSERT INTO detalles_facturas SET ?';

    db.query(query, detalleFacturaData, (err, result) => {
        if (err) {
            console.error('Error al insertar el detalle de la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        console.log('Detalle de factura insertado correctamente');
        res.send({ success: true, id: result.insertId });
    });
});

// Ruta para actualizar el estado de entrega y registrar en historial_facturas
app.put('/api/factura/estado/:id', upload.single('foto_evidencia'), (req, res) => {
    const numero_orden = req.params.id;
    const { estado_entrega, motivo_rechazo, direccion_entrega, rut_receptor } = req.body;
    const foto_evidencia = req.file ? req.file.filename : null; // Nombre del archivo subido

    console.log('Datos recibidos:', req.body); // Verificar los datos recibidos

    // Objeto con datos para actualizar el estado de entrega en facturas
    const updatedEstadoEntrega = {
        estado_entrega: estado_entrega,
        motivo_rechazo: motivo_rechazo, // Asegúrate de incluir motivo_rechazo aquí
        direccion_entrega: direccion_entrega,
        rut_receptor: rut_receptor,
        foto_evidencia: foto_evidencia
    };

    // Generar la consulta de actualización para el estado de entrega en facturas
    const updateQuery = 'UPDATE facturas SET ? WHERE numero_orden = ?';
    db.query(updateQuery, [updatedEstadoEntrega, numero_orden], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de entrega en facturas:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.affectedRows > 0) {
            // Registro en historial_facturas
            const historialData = {
                numero_orden,
                estado_nuevo: estado_entrega,
                motivo_rechazo: motivo_rechazo, // Asegúrate de incluir motivo_rechazo aquí
                direccion_entrega: direccion_entrega,
                rut_receptor: rut_receptor,
                foto_evidencia: foto_evidencia,
                fecha_cambio: new Date()
            };

            const insertQuery = 'INSERT INTO historial_facturas SET ?';
            db.query(insertQuery, historialData, (err, result) => {
                if (err) {
                    console.error('Error al registrar en historial_facturas:', err.message);
                    res.status(500).send({ error: 'Database query error', message: err.message });
                    return;
                }
                console.log('Estado de entrega actualizado y registrado en historial_facturas');
                res.send({ success: true, message: 'Estado de entrega actualizado y registrado en historial' });

                const rutaFoto = path.resolve(__dirname, 'client', 'src', 'Components', 'Assets', foto_evidencia);
                console.log('Ruta de la foto guardada:', rutaFoto);
            });
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});

// Ruta para obtener el historial de cambios de despacho por ID de factura
app.get('/api/factura/historial/:id', (req, res) => {
    const numero_orden = req.params.id;
    const query = 'SELECT * FROM historial_facturas WHERE numero_orden = ? ORDER BY fecha_cambio DESC';

    db.query(query, [numero_orden], (err, result) => {
        if (err) {
            console.error('Error al obtener el historial de cambios de despacho:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        res.send(result);
    });
});


// Ruta para subir el archivo PDF y asociarlo con el numero_orden
app.post('/upload', upload.single('pdf'), (req, res) => {
    const numeroOrden = req.body.numero_orden;
    
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo');
    }

    const pdfBuffer = req.file.buffer;
    const query = 'UPDATE facturas SET pdf = ? WHERE numero_orden = ?';

    db.query(query, [pdfBuffer, numeroOrden], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Archivo subido y guardado en la base de datos');
    });
});

app.listen(3001, () => {
    console.log('Corriendo en el puerto 3001');
});
