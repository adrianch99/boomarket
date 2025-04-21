async function cargarPedidos() {
    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();

        const contenedor = document.getElementById('lista-pedidos');
        contenedor.innerHTML = '';

        if (pedidos.length === 0) {
            contenedor.innerHTML = '<p>No hay pedidos aún.</p>';
            return;
        }

        pedidos.forEach(pedido => {
            const div = document.createElement('div');
            div.classList.add('pedido');
            div.innerHTML = `
          <h3>📦 Pedido #${pedido.id}</h3>
          <p><strong>Nombre:</strong> ${pedido.nombre}</p>
          <p><strong>Dirección:</strong> ${pedido.direccion}</p>
          <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
          <p><strong>Email:</strong> ${pedido.email}</p>
          <p><strong>Departamento:</strong> ${pedido.departamento}</p>
          <p><strong>Ciudad:</strong> ${pedido.ciudad}</p>
          <p><strong>Productos:</strong></p>
          <pre>${JSON.stringify(pedido.productos, null, 2)}</pre>
          <hr>
        `;
            contenedor.appendChild(div);
        });
    } catch (err) {
        console.error('Error al cargar pedidos:', err.message);
    }
}