const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

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

app.get("/usuarios", (req, res) => {
    db.query('SELECT * FROM usuario', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/facturas", (req, res) => {
    const rut_proveedor = req.query.rut_proveedor;
    db.query('SELECT * FROM facturas WHERE rut_proveedor = ?', [rut_proveedor], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});app.get("/facturas", (req, res) => {
    const rut_proveedor = req.query.rut_proveedor;
    db.query('SELECT * FROM facturas WHERE rut_proveedor = ?', [rut_proveedor], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});



// Nueva ruta para el login
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

// Ruta para insertar un detalle de factura
app.post('/api/detalles_facturas', (req, res) => {
    const detalleFacturaData = req.body;
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


app.listen(3001, () => {
    console.log('Corriendo en el puerto 3001');
});