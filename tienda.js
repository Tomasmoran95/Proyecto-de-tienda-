document.addEventListener("DOMContentLoaded", () => {

  let productos = [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const catalogo = document.getElementById("catalogo");
  const carritoHTML = document.getElementById("carrito");
  const totalHTML = document.getElementById("total");
  const btnVaciar = document.getElementById("vaciar");
  const btnComprar = document.getElementById("comprar");
  const checkout = document.getElementById("checkout");
  const formCheckout = document.getElementById("formCheckout");

  // 🔹 Cargar productos desde JSON
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

  // 🔹 Mostrar catálogo
  function mostrarCatalogo() {
    catalogo.innerHTML = "";

    productos.forEach(producto => {
      const div = document.createElement("div");

      const imgSrc = producto.imagen 
        ? producto.imagen 
        : "https://via.placeholder.com/150?text=Sin+imagen";

      div.innerHTML = `
        <img src="${imgSrc}" alt="${producto.nombre}">
        <p>${producto.nombre} - $${producto.precio}</p>
        <button>Agregar</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        agregarAlCarrito(producto.id);
      });

      catalogo.appendChild(div);
    });
  }

  // 🔹 Agregar al carrito
  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const itemExistente = carrito.find(p => p.id === id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
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

  // 🔹 Mostrar carrito
  function mostrarCarrito() {
    carritoHTML.innerHTML = "";

    if (carrito.length === 0) {
      carritoHTML.innerHTML = "<li>El carrito está vacío</li>";
    } else {
      carrito.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
          ${item.nombre} - $${item.precio} x ${item.cantidad}
          <button>X</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
          eliminarProducto(index);
        });

        carritoHTML.appendChild(li);
      });
    }

    totalHTML.textContent = "Total: $" + calcularTotal();
  }

  // 🔹 Calcular total
  function calcularTotal() {
    return carrito.reduce((acc, item) => 
      acc + item.precio * item.cantidad, 0);
  }

  // 🔹 Guardar carrito
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // 🔹 Eliminar producto
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

  // 🔹 Mostrar checkout
  btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "El carrito está vacío",
        icon: "warning"
      });
      return;
    }

    checkout.style.display = "block";
  });

  // 🔹 Validación y procesamiento del formulario
  formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const tarjeta = document.getElementById("tarjeta").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    
    

    if (nombre.length < 3) return mostrarError("El nombre debe tener al menos 3 caracteres");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return mostrarError("Correo electrónico inválido");

    if (direccion.length < 5) return mostrarError("Dirección demasiado corta");

    if (!/^\d{16}$/.test(tarjeta)) return mostrarError("La tarjeta debe tener 16 dígitos numéricos");

    if (!/^\d{3}$/.test(cvv)) return mostrarError("El CVV debe tener 3 dígitos");

    

    // 🔹 Guardar cliente en localStorage
    const cliente = { nombre, email, direccion };
    localStorage.setItem("cliente", JSON.stringify(cliente));

    // 🔹 Mostrar alerta con datos del usuario
    Swal.fire({
      title: "Compra realizada",
      html: `
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Total:</strong> $${calcularTotal()}</p>
      `,
      icon: "success"
    });

    // 🔹 Generar ticket visual en pantalla
    mostrarTicket(cliente);

    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    formCheckout.reset();
    checkout.style.display = "none";
  });

  function mostrarError(mensaje) {
    Swal.fire({
      icon: "error",
      title: "Error en el formulario",
      text: mensaje
    });
  }

  // 🔹 Mostrar ticket en pantalla
  function mostrarTicket(cliente) {
    const ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `
      <h3>Ticket de compra</h3>
      <p><strong>Cliente:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Dirección:</strong> ${cliente.direccion}</p>
      <p><strong>Total:</strong> $${calcularTotal()}</p>
    `;
    document.body.appendChild(ticket);
  }

  // 🔹 Inicializar carrito al cargar
  mostrarCarrito();
});