const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear nuevo pedido
router.post('/', async (req, res) => {
    const { nombre, direccion, telefono, email, departamento, ciudad, productos } = req.body;

    try {
        await pool.query(
            'INSERT INTO pedidos (nombre, direccion, telefono, email, departamento, ciudad, productos) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [nombre, direccion, telefono, email, departamento, ciudad, JSON.stringify(productos)] // 👈 convertir a texto JSON
        );


        res.status(201).json({ message: 'Pedido guardado exitosamente' });
    } catch (err) {
        console.error('Error al guardar pedido:', err.message);
        res.status(500).json({ message: 'Error al guardar pedido' });
    }
});


// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
        res.json(result.rows); // 👈 productos ya vendrán como JSON
    } catch (err) {
        console.error('Error al obtener pedidos:', err.message);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
});

// Marcar pedido como enviado
router.put('/:id/enviado', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE pedidos SET enviado = true WHERE id = $1', [id]);
        res.json({ message: 'Pedido marcado como enviado' });
    } catch (err) {
        console.error('Error al actualizar pedido:', err.message);
        res.status(500).json({ message: 'Error al actualizar pedido' });
    }
});



module.exports = router;
