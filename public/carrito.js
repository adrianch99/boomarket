document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();
});

async function mostrarCarrito() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    document.getElementById('carrito-container').innerHTML = '<p>Debes iniciar sesión para ver tu carrito.</p>';
    return;
  }

  const response = await fetch(`http://localhost:3000/api/carrito/${userId}`);
  const carrito = await response.json();

  const container = document.getElementById('carrito-container');
  container.innerHTML = '';

  let total = 0;

  if (carrito.length === 0) {
    container.innerHTML = '<p>El carrito está vacío.</p>';
    document.getElementById('total').textContent = 'Total: $0';
    return;
  }

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.classList.add('producto-carrito');
    div.innerHTML = `
        <h3>${item.nombre}</h3>
        <img src="${item.imagen}" width="100">
        <p>Precio: $${item.precio}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: $${subtotal}</p>
        <hr>
      `;
    container.appendChild(div);
  });

  document.getElementById('total').textContent = `Total: $${total}`;
}



function cambiarCantidad(productoId, cantidad) {
  const user = JSON.parse(localStorage.getItem('user'));
  fetch(`http://localhost:3000/api/carrito/${user.id}/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_id: productoId, cantidad })
  }).then(() => mostrarCarrito());
}

function eliminarItem(productoId) {
  const user = JSON.parse(localStorage.getItem('user'));
  fetch(`http://localhost:3000/api/carrito/${user.id}/eliminar`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_id: productoId })
  }).then(() => mostrarCarrito());
}

function vaciarCarrito() {
  const user = JSON.parse(localStorage.getItem('user'));
  fetch(`http://localhost:3000/api/carrito/${user.id}/vaciar`, {
    method: 'DELETE'
  }).then(() => mostrarCarrito());
}
