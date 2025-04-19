document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();
});

async function mostrarCarrito() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    document.getElementById('carrito-container').innerHTML = '<p>Debes iniciar sesión para ver tu carrito.</p>';
    return;
  }

  const response = await fetch(`/api/carrito/${userId}`);
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
  <p>
    Cantidad:
    <input type="number" min="1" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)">
  </p>
  <p>Subtotal: $${subtotal}</p>
  <button onclick="eliminarItem(${item.id})">Eliminar</button>
  <hr>
`;

    container.appendChild(div);
  });

  document.getElementById('total').textContent = `Total: $${total}`;
}

function vaciarCarrito() {
  const userId = localStorage.getItem('user_id');

  fetch(`/api/carrito/${userId}/vaciar`, {
    method: 'DELETE'
  }).then(() => mostrarCarrito());
}


function cambiarCantidad(productoId, nuevaCantidad) {
  const userId = localStorage.getItem('user_id');

  fetch(`/api/carrito/${userId}/${productoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad: nuevaCantidad })
  }).then(() => mostrarCarrito());
}


function eliminarItem(productoId) {
  const userId = localStorage.getItem('user_id');

  fetch(`/api/carrito/${userId}/${productoId}`, {
    method: 'DELETE'
  }).then(() => mostrarCarrito());
}

async function realizarPedido() {
  const userId = localStorage.getItem('user_id');

  const carrito = await fetch(`/api/carrito/${userId}`).then(res => res.json());

  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;
  const email = document.getElementById('email').value;
  const departamento = document.getElementById('departamento').value;
  const ciudad = document.getElementById('ciudad').value;

  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      direccion,
      telefono,
      email,
      departamento,
      ciudad,
      productos: carrito
    })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    await fetch(`/api/carrito/${userId}/vaciar`, { method: 'DELETE' });
    window.location.href = 'productos.html';
  }
}
