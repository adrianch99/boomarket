document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();
});

function mostrarCarrito() {
  const container = document.getElementById('carrito-container');
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  container.innerHTML = '';

  let total = 0;

  if (carrito.length === 0) {
    container.innerHTML = '<p>El carrito está vacío.</p>';
    document.getElementById('total').textContent = 'Total: $0';
    return;
  }

  carrito.forEach((item, index) => {
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
          <input type="number" min="1" value="${item.cantidad}" onchange="cambiarCantidad(${index}, this.value)">
        </p>
        <p>Subtotal: $${subtotal}</p>
        <button class="btn" onclick="eliminarItem(${index})">Eliminar</button>
        <hr>
      `;
    container.appendChild(div);
  });

  document.getElementById('total').textContent = `Total: $${total}`;
}

function cambiarCantidad(index, cantidad) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito[index].cantidad = parseInt(cantidad);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarItem(index) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarCarrito();
}
