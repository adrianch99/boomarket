document.addEventListener('DOMContentLoaded', () => {
  const categoriasContenedores = {
    belleza: document.getElementById('productos-belleza'),
    tecnologia: document.getElementById('productos-tecnologia'),
    hogar: document.getElementById('productos-hogar'),
    cocina: document.getElementById('productos-cocina'),
    fitness: document.getElementById('productos-fitness'),
  };

  fetch('/api/productos')
    .then(res => res.json())
    .then(productos => {
      // Limpiar los contenedores
      Object.values(categoriasContenedores).forEach(c => c.innerHTML = '');

      // Agrupar productos por categoría
      const productosPorCategoria = {};
      productos.forEach(p => {
        const categoria = p.categoria?.toLowerCase();
        if (!productosPorCategoria[categoria]) productosPorCategoria[categoria] = [];
        productosPorCategoria[categoria].push(p);
      });

      // Mostrar solo 6 productos y el enlace "Ver todos"
      Object.keys(categoriasContenedores).forEach(categoria => {
        const contenedor = categoriasContenedores[categoria];
        const productosCat = productosPorCategoria[categoria] || [];
        productosCat.slice(0, 15).forEach(p => {
          const card = document.createElement('div');
          card.classList.add('producto');
          card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}" width="200">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p><strong>$${p.precio}</strong></p>
            <button class="btn" onclick="agregarAlCarrito(${p.id})">Añadir al carrito</button>
          `;
          contenedor.appendChild(card);
        });
        // Enlace "Ver todos"
        if (productosCat.length > 6) {
          const verTodos = document.createElement('a');
          verTodos.href = `categoria.html?cat=${categoria}`;
          verTodos.className = 'ver-todos';
          verTodos.textContent = 'Ver todos los productos';
          contenedor.appendChild(verTodos);
        }
      });
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
      Object.values(categoriasContenedores).forEach(c => {
        c.innerHTML = `<p>Error al cargar productos.</p>`;
      });
    });
});


function agregarAlCarrito(productoId) {
  // Obtener el carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Verificar si el producto ya está en el carrito
  const productoExistente = carrito.find(item => item.id === productoId);

  if (productoExistente) {
    productoExistente.cantidad += 1; // Incrementar la cantidad
  } else {
    carrito.push({ id: productoId, cantidad: 1 }); // Agregar nuevo producto
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  alert('Producto agregado al carrito');
}

document.getElementById('busquedaInput').addEventListener('input', (e) => {
  const valor = e.target.value.toLowerCase();
  const productos = document.querySelectorAll('.producto');

  productos.forEach(producto => {
    const nombre = producto.querySelector('h3').textContent.toLowerCase();
    producto.style.display = nombre.includes(valor) ? 'block' : 'none';
  });
});


