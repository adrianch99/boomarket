const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, hashedPassword]
        );
        res.status(201).json(nuevoUsuario.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (usuario.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const valido = await bcrypt.compare(password, usuario.rows[0].password);

        if (!valido) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        req.session.usuario = {
            id: usuario.rows[0].id,
            nombre: usuario.rows[0].nombre,
            email: usuario.rows[0].email
        };

        res.json({ mensaje: 'Login exitoso', usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
