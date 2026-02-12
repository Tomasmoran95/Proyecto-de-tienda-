document.addEventListener("DOMContentLoaded", () => {

  let productos = [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const catalogo = document.getElementById("catalogo");
  const carritoHTML = document.getElementById("carrito");
  const totalHTML = document.getElementById("total");
  const btnVaciar = document.getElementById("vaciar");
  const btnComprar = document.getElementById("comprar");

  // 🔹 Cargar productos desde archivo JSON
  fetch("productos.json")
    .then(response => response.json())
    .then(data => {
      productos = data;
      mostrarCatalogo();
    })
    .catch(() => {
      Swal.fire({
        title: "Error al cargar productos",
        icon: "error"
      });
    });

  // 🔹 Mostrar catálogo de productos con imagen y botón
  function mostrarCatalogo() {
    catalogo.innerHTML = "";

    productos.forEach(producto => {
      const div = document.createElement("div");

      // Usar placeholder si no hay imagen
      const imgSrc = producto.imagen ? producto.imagen : "https://via.placeholder.com/150?text=Sin+imagen";

      div.innerHTML = `
        <img src="${imgSrc}" alt="${producto.nombre}">
        <p>${producto.nombre} - $${producto.precio}</p>
        <button data-id="${producto.id}">Agregar</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        agregarAlCarrito(producto.id);
      });

      catalogo.appendChild(div);
    });
  }

  // 🔹 Agregar producto al carrito con manejo de cantidad
  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // Verificar si ya existe en el carrito
    const itemCarrito = carrito.find(p => p.id === id);
    if (itemCarrito) {
      itemCarrito.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    mostrarCarrito();

    Swal.fire({
      title: "Producto agregado",
      icon: "success",
      timer: 1000,
      showConfirmButton: false
    });
  }

  // 🔹 Mostrar carrito con cantidad
  function mostrarCarrito() {
    carritoHTML.innerHTML = "";

    if (carrito.length === 0) {
      carritoHTML.innerHTML = "<li>El carrito está vacío</li>";
    } else {
      carrito.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
          ${item.nombre} - $${item.precio} x ${item.cantidad} 
          <button data-index="${index}">X</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
          eliminarProducto(index);
        });

        carritoHTML.appendChild(li);
      });
    }

    totalHTML.textContent = "Total: $" + calcularTotal();
  }

  // 🔹 Calcular total considerando cantidad
  function calcularTotal() {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  // 🔹 Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // 🔹 Eliminar producto del carrito
  function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
  }

  // 🔹 Vaciar carrito
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  });

  // 🔹 Finalizar compra
  btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "El carrito está vacío",
        icon: "warning"
      });
      return;
    }

    Swal.fire({
      title: "¿Confirmar compra?",
      text: "Total a pagar: $" + calcularTotal(),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, comprar"
    }).then(result => {
      if (result.isConfirmed) {
        carrito = [];
        guardarCarrito();
        mostrarCarrito();

        Swal.fire({
          title: "Compra realizada con éxito",
          icon: "success"
        });
      }
    });
  });

  // 🔹 Mostrar carrito al cargar la página
  mostrarCarrito();
});
