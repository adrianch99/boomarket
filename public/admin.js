document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('pedidos-container');

    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();

        if (pedidos.length === 0) {
            container.innerHTML = '<p>No hay pedidos aún.</p>';
            return;
        }

        let html = '<table border="1" cellpadding="10"><tr><th>Nombres</th><th>Dirección</th><th>Teléfono</th><th>Email</th><th>Departamento</th><th>Ciudad</th><th>Productos</th><th>Estado</th></tr>';

        pedidos.forEach(pedido => {
            html += `
          <tr>
            <td>${pedido.nombre}</td>
            <td>${pedido.direccion}</td>
            <td>${pedido.telefono}</td>
            <td>${pedido.email}</td>
            <td>${pedido.departamento}</td>
            <td>${pedido.ciudad}</td>

            <td>
              <ul>
                ${pedido.productos.map(p =>
                `<li> id: ${p.id}, ${p.nombre} x ${p.cantidad} ($${p.precio})</li>`
            ).join('')}
              </ul>
            </td>
            <td>
              ${pedido.enviado ? '✅ Enviado' : `<button onclick="marcarEnviado(${pedido.id})">Marcar como enviado</button>`}
            </td>
          </tr>
        `;
        });

        html += '</table>';
        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = '<p>Error al cargar pedidos.</p>';
        console.error(err);
    }

});


async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const res = await fetch('/api/pedidos');
    const pedidos = await res.json();

    let y = 10;
    pedidos.forEach((pedido, index) => {
        doc.text(`Pedido ${index + 1}`, 10, y);
        y += 10;
        doc.text(`Nombre: ${pedido.nombre}`, 10, y);
        y += 10;
        doc.text(`Dirección: ${pedido.direccion}`, 10, y);
        y += 10;
        doc.text(`Teléfono: ${pedido.telefono}`, 10, y);
        y += 10;
        doc.text(`Email: ${pedido.email}`, 10, y);
        y += 10;
        pedido.productos.forEach(p => {
            doc.text(`- ${p.nombre} x ${p.cantidad} ($${p.precio})`, 15, y);
            y += 10;
        });
        y += 10;

        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save('pedidos.pdf');
}

async function marcarEnviado(id) {
    await fetch(`/api/pedidos/${id}/enviado`, {
        method: 'PUT'
    });
    alert('Pedido marcado como enviado');
    location.reload();
}


