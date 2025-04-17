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

function agregarAlCarrito(id) {
    fetch(`http://localhost:3000/api/productos`)
      .then(res => res.json())
      .then(productos => {
        const producto = productos.find(p => p.id === id);
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
        const existe = carrito.find(item => item.id === id);
        if (existe) {
          existe.cantidad += 1;
        } else {
          carrito.push({ ...producto, cantidad: 1 });
        }
  
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert('Producto agregado al carrito');
      });
  }
  
