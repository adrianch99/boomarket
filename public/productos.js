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
          <a href="detalle-producto.html?id=${p.id}" class="producto-link">
            <img src="${p.imagen}" alt="${p.nombre}" width="200">
            <p>${p.descripcion}</p>
            <p><strong>$${p.precio}</strong></p>
            </a>
          `;
          contenedor.appendChild(card);

          // Agregar evento de clic al contenedor para redirigir
          card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
              window.location.href = `detalle-producto.html?id=${p.id}`;
            }
          });
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
}

// Función para mostrar el formulario de compra en un modal
function mostrarFormularioCompra(productoId, nombreProducto, precioProducto) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="cerrarModal()">×</span>
      <h2>Comprar ${nombreProducto}</h2>
      <form id="form-envio">
        <input type="text" id="nombre" placeholder="Nombre y apellidos" required>
        <input type="text" id="direccion" placeholder="Dirección, barrio..." required>
        <input type="tel" id="telefono" placeholder="Teléfono" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="text" id="departamento" placeholder="Departamento" required>
        <input type="text" id="ciudad" placeholder="Ciudad" required>
        <button class="btn" type="button" onclick="realizarCompra(${productoId}, '${nombreProducto}', ${precioProducto})">Realizar compra</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.querySelector('.modal');
  if (modal) modal.remove();
}

// Función para realizar la compra
function realizarCompra(productoId, nombreProducto, precioProducto) {
  const datosEnvio = {
    nombre: document.getElementById('nombre').value,
    direccion: document.getElementById('direccion').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    departamento: document.getElementById('departamento').value,
    ciudad: document.getElementById('ciudad').value,
  };

  if (Object.values(datosEnvio).some(value => !value)) {
    mostrarNotificacion('Por favor, completa todos los campos del formulario', 'info');
    return;
  }

  const compra = {
    productoId,
    nombreProducto,
    precioProducto,
    datosEnvio,
  };

  // Enviar la compra al servidor
  fetch('/api/pedidos-unitarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(compra),
  })
    .then(response => {
      if (response.ok) {
        mostrarNotificacion(`Compra realizada exitosamente para el producto: ${nombreProducto} Pronto nos comunicaremos con usted`, 'success');
        cerrarModal();
      } else {
        mostrarNotificacion('Error al realizar la compra.', 'error');
      }
    })
    .catch(err => {
      console.error('Error al enviar la compra:', err);
      mostrarNotificacion('Error al realizar la compra.', 'error');
    });
}

// Función para filtrar productos por nombre
document.getElementById('busquedaInput').addEventListener('input', (e) => {
  const valor = e.target.value.toLowerCase();
  const productos = document.querySelectorAll('.producto');

  productos.forEach(producto => {
    const nombre = producto.querySelector('h3').textContent.toLowerCase();
    producto.style.display = nombre.includes(valor) ? 'block' : 'none';
  });
});

function mostrarNotificacion(mensaje, tipo = 'info') {
  const container = document.getElementById('notification-container');

  const notificacion = document.createElement('div');
  notificacion.className = `notification ${tipo}`;
  notificacion.textContent = mensaje;

  container.appendChild(notificacion);

  // Eliminar la notificación después de 4 segundos
  setTimeout(() => {
    notificacion.remove();
  }, 4000);
}


