document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('lista-productos');

  fetch('/api/productos')
    .then(res => res.json())
    .then(productos => {
      contenedor.innerHTML = '';

      productos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto');

        card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}" width="200">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p><strong>$${p.precio}</strong></p>
            <button class="btn" onclick="agregarAlCarrito(${p.id})">Añadir al carrito 🛒</button>
          `;

        contenedor.appendChild(card);
      });
    })
    .catch(err => {
      contenedor.innerHTML = `<p>Error al cargar productos.</p>`;
      console.error(err);
    });
});

function agregarAlCarrito(productoId) {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    alert('Debes iniciar sesión para agregar productos al carrito.');
    return;
  }

  fetch('/api/carrito/agregar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      producto_id: productoId,
      cantidad: 1,
      user_id: userId
    })
  })
    .then(res => res.json())
    .then(data => {
      alert('Producto agregado al carrito');
    })
    .catch(err => {
      console.error('Error al agregar al carrito:', err);
      alert('Hubo un problema al agregar el producto');
    });
}
