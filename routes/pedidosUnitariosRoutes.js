const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa tu conexión a la base de datos

// Ruta para guardar un pedido
router.post('/api/pedidos-unitarios', async (req, res) => {
    const { productoId, nombreProducto, precioProducto, datosEnvio } = req.body;

    try {
        // Inserta el pedido en la tabla "pedidos"
        await db.query(
            `INSERT INTO pedidosUnitarios (producto_id, nombre_producto, precio_producto, nombre, direccion, telefono, email, departamento, ciudad)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                productoId,
                nombreProducto,
                precioProducto,
                datosEnvio.nombre,
                datosEnvio.direccion,
                datosEnvio.telefono,
                datosEnvio.email,
                datosEnvio.departamento,
                datosEnvio.ciudad,
            ]
        );

        res.status(201).send({ message: 'Pedido guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        res.status(500).send({ error: 'Error al guardar el pedido' });
    }
});

module.exports = router;