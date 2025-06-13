document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();
});

async function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
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

    const card = document.createElement('div');
    card.classList.add('producto-carrito');
    card.innerHTML = `
      <h3>${item.nombre}</h3>
      <img src="${item.imagen}" width="100">
      <p><strong>Precio: $${item.precio}</strong></p>
      <p><strong>
        Cantidad:
        <input type="number" min="1" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)">
      </strong></p>
      <p><strong>Subtotal: $${subtotal}</strong></p>
      <button class="btn" onclick="eliminarItem(${item.id})">Eliminar</button>
      <hr>
    `;

    container.appendChild(card);
  });

  document.getElementById('total').textContent = `Total: $${total}`;
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

function cambiarCantidad(productoId, nuevaCantidad) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const producto = carrito.find(item => item.id === productoId);

  if (producto) {
    producto.cantidad = parseInt(nuevaCantidad, 10);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function eliminarItem(productoId) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => item.id !== productoId);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
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
  alert("Pedido realizado exitosamente. Pronto nos comunicaremos con usted");

  if (res.ok) {
    await fetch(`/api/carrito/${userId}/vaciar`, { method: 'DELETE' });
    window.location.href = 'productos.html';
  }
}
