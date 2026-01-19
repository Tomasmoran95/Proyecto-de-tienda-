document.addEventListener("DOMContentLoaded", () => {

  const productos = [
    { id: 1, nombre: "Camisa", precio: 15 },
    { id: 2, nombre: "Pantalón", precio: 25 },
    { id: 3, nombre: "Zapatos", precio: 40 },
    { id: 4, nombre: "Gorra", precio: 10 }
  ];

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const catalogo = document.getElementById("catalogo");
  const carritoHTML = document.getElementById("carrito");
  const totalHTML = document.getElementById("total");
  const btnVaciar = document.getElementById("vaciar");

  function mostrarCatalogo() {
    catalogo.innerHTML = "";
    productos.forEach(producto => {
      const div = document.createElement("div");
      const p = document.createElement("p");
      p.textContent = `${producto.nombre} - $${producto.precio}`;
      const button = document.createElement("button");
      button.textContent = "Agregar";
      button.addEventListener("click", () => agregarAlCarrito(producto.id));
      div.appendChild(p);
      div.appendChild(button);
      catalogo.appendChild(div);
    });
  }

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    carrito.push(producto);
    guardarCarrito();
    mostrarCarrito();
  }

  function mostrarCarrito() {
    carritoHTML.innerHTML = "";
    if (carrito.length === 0) {
      carritoHTML.innerHTML = "<li>El carrito está vacío</li>";
    } else {
      carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "X";
        btnEliminar.addEventListener("click", () => eliminarProducto(index));
        li.appendChild(btnEliminar);
        carritoHTML.appendChild(li);
      });
    }
    totalHTML.textContent = "Total: $" + calcularTotal();
  }

  function calcularTotal() {
    return carrito.reduce((acc, item) => acc + item.precio, 0);
  }

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
  }

  btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  });

  mostrarCatalogo();
  mostrarCarrito();
});
