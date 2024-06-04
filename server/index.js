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


app.listen(3001, () => {
    console.log('Corriendo en el puerto 3001');
});
