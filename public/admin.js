document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('pedidos-container');

    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();

        if (!Array.isArray(pedidos)) {
            throw new Error('La respuesta del servidor no es un array');
        }

        if (pedidos.length === 0) {
            container.innerHTML = '<p>No hay pedidos aún.</p>';
            return;
        }

        let html = '<table border="1" cellpadding="10"><tr><th>Nombres</th><th>Dirección</th><th>Teléfono</th><th>Email</th><th>Departamento</th><th>Ciudad</th><th>Productos</th><th>Estado</th></tr>';

        pedidos.forEach(pedido => {
            const productos = Array.isArray(pedido.productos) ? pedido.productos : [];
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
                    ${productos.map(p =>
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
        console.error('Error al cargar pedidos:', err);
    }
});

function cargarPedidosUnitarios() {
    fetch('/api/pedidos-unitarios')
        .then(res => res.json())
        .then(pedidos => {
            const tablaPedidos = document.getElementById('tabla-pedidos');
            tablaPedidos.innerHTML = ''; // Limpiar la tabla

            pedidos.forEach(pedido => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${pedido.nombre_producto}</td>
                    <td>${pedido.precio_producto}</td>
                    <td>${pedido.nombre}</td>
                    <td>${pedido.direccion}</td>
                    <td>${pedido.telefono}</td>
                    <td>${pedido.email}</td>
                    <td>${pedido.departamento}</td>
                    <td>${pedido.ciudad}</td>
                `;
                tablaPedidos.appendChild(fila);
            });
        })
        .catch(err => {
            console.error('Error al cargar pedidos unitarios:', err);
        });
}


async function exportarPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error('jspdf no está disponible. Verifica que la biblioteca esté correctamente cargada.');
        alert('Hubo un problema al cargar la biblioteca jspdf. Verifica la consola para más detalles.');
        return;
    }

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

async function exportarExcel() {
    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();

        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        // Crear los datos para el archivo Excel
        const datos = [];
        pedidos.forEach((pedido, index) => {
            datos.push({
                Pedido: `Pedido ${index + 1}`,
                Nombre: pedido.nombre,
                Dirección: pedido.direccion,
                Teléfono: pedido.telefono,
                Email: pedido.email,
                Departamento: pedido.departamento,
                Ciudad: pedido.ciudad,
                Productos: pedido.productos.map(p => `${p.nombre} x ${p.cantidad} ($${p.precio})`).join(', '),
                Estado: pedido.enviado ? 'Enviado' : 'Pendiente'
            });
        });

        // Crear una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(datos);

        // Crear un libro de trabajo
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

        // Exportar el archivo Excel
        XLSX.writeFile(workbook, 'pedidos.xlsx');
    } catch (err) {
        console.error('Error al exportar a Excel:', err);
        alert('Hubo un problema al exportar a Excel. Verifica la consola para más detalles.');
    }
}

async function marcarEnviado(id) {
    await fetch(`/api/pedidos/${id}/enviado`, {
        method: 'PUT'
    });
    alert('Pedido marcado como enviado');
    location.reload();
}


