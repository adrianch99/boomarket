require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;
const pedidosRoutes = require('./routes/pedidosRoutes');
const path = require('path');

app.use(bodyParser.json());
app.use('/api/pedidos', pedidosRoutes);
app.use(cors());
app.use(express.static('public'));
app.use('/api/auth', authRoutes);
app.use(session({
    secret: 'clave-super-secreta',
    resave: false,
    saveUninitialized: false
}));


// Redirigir la raíz del sitio a dashboard.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)',
            [nombre, email, hashedPassword]
        );


        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (!result || result.rows.length === 0) {
            return res.status(401).json({ message: 'Correo no registrado' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (err) {
        console.error('Error en login:', err.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Agregar nuevo producto
app.post('/api/productos', async (req, res) => {
    const { nombre, descripcion, precio, imagen, userId } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES ($1, $2, $3, $4)',
            [nombre, descripcion, precio, imagen]
        );

        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar producto' });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
});

// Editar producto
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;

    try {
        await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, imagen = $4 WHERE id = $5',
            [nombre, descripcion, precio, imagen, id]
        );
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
