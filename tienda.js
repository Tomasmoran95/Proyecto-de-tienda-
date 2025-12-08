// ================================
//   SIMULADOR DE TIENDA (JS)
// ================================

// Catálogo de productos
const productos = [
  { id: 1, nombre: "Camisa", precio: 15 },
  { id: 2, nombre: "Pantalón", precio: 25 },
  { id: 3, nombre: "Zapatos", precio: 40 },
  { id: 4, nombre: "Gorra", precio: 10 }
];

// Carrito donde se guardarán las compras
let carrito = [];

// Función para mostrar el catálogo al usuario
function mostrarCatalogo() {
  let mensaje = "PRODUCTOS DISPONIBLES:\n";
  
  for (let producto of productos) {
    mensaje += `${producto.id}. ${producto.nombre} - $${producto.precio}\n`;
  }

  alert(mensaje);
}

// Función para agregar un producto al carrito
function agregarAlCarrito() {
  let id = prompt("Ingresa el ID del producto que deseas comprar:");
  
  // Convertimos a número
  id = Number(id);

  // Validamos que exista
  let producto = productos.find(item => item.id === id);

  if (producto) {
    carrito.push(producto);
    alert(`Has agregado: ${producto.nombre}`);
    console.log("Carrito actual:", carrito);
  } else {
    alert("Producto no válido. Intenta nuevamente.");
  }
}

// Función para calcular el total del carrito
function calcularTotal() {
  let total = 0;

  for (let item of carrito) {
    total += item.precio;
  }

  return total;
}

// ================================
//        FLUJO PRINCIPAL
// ================================

alert("¡Bienvenido a la Tienda Virtual!");

while (true) {
  mostrarCatalogo();
  agregarAlCarrito();

  let continuar = confirm("¿Quieres agregar otro producto?");
  if (!continuar) break;
}

// Mostrar total final
let total = calcularTotal();

if (carrito.length > 0) {
  alert(`Gracias por tu compra.\nHas adquirido ${carrito.length} productos.\nTotal a pagar: $${total}`);
} else {
  alert("No agregaste productos. ¡Vuelve pronto!");
}
