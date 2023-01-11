const productos = [
    {
        id: 1, 
        nombre:"Arbol de Navidad",
        informacion:" Let's spread the joy , here is Christmas , the most awaited day of the year.Christmas Tree is what one need the most. Here is the correct tree which will enhance your Christmas.",
        //informacion: "",
        precio: 8000,
        imagen: "./img/arbol.jpg",
        descripcion: {
            altura: "120cm",
            color: "Verde",
            decoracion: "Campanas y Bolas",
            material: "Eco-Friendly"
        }
    },
    {
        id: 2, 
        nombre:"Botas Navideñas",
        informacion:" Let's spread the joy , here is Christmas , the most awaited day of the year.Christmas Tree is what one need the most. Here is the correct tree which will enhance your Christmas.",
        //informacion: "",
        precio: 1250,
        imagen: "./img/botas.jpg",
        descripcion: {
            altura: "25cm",
            color: "Roja y blanca",
            decoracion: "Para colgar",
            material: "Polar"
        }
    },
    {
        id: 3, 
        nombre:"Luces Navideñas",
        informacion:" Let's spread the joy , here is Christmas , the most awaited day of the year.Christmas Tree is what one need the most. Here is the correct tree which will enhance your Christmas.",
        //informacion: "",
        precio: 2500,
        imagen:"./img/luces.jpg",
        descripcion: {
            altura: "100cm",
            color: "Multicolor RGB",
            decoracion: "Luces Lineales",
            material: "Led"
        }
    },
    {
        id: 4, 
        nombre:"Adornos para arbol",
        informacion:" Let's spread the joy , here is Christmas , the most awaited day of the year.Christmas Tree is what one need the most. Here is the correct tree which will enhance your Christmas.",
        //informacion: "",
        precio: 400,
        imagen:"./img/adornos.jpeg",
        descripcion: {
            altura: "15cm",
            color: "Varios",
            decoracion: "Campanas y Girnaldas",
            material: "Eco-Friendly"
        }
    },
]

cargarProductos()


let btnProductos = document.getElementById("btnProducts")
let btnCarrito = document.getElementById("btnCart")

btnProductos.addEventListener("click", mostrarProductos)
btnCarrito.addEventListener("click", mostrarCarrito)

function mostrarProductos () {
    let divProductos = document.getElementById("products")
    let divCart = document.getElementById("cart")
    divProductos.style.display = "flex"
    divCart.style.display = "none"
}

function mostrarCarrito () {
    let divProductos = document.getElementById("products")
    let divCart = document.getElementById("cart")
    divProductos.style.display = "none"
    divCart.style.display = "flex"
    cargarDetalleCarrito()
    cargarTotalesCarrito()
}

function crearCardProducto(prod) {
    let div = document.createElement("div")
    div.className = "container"
    div.innerHTML = `
    <div class="product-details">                
                    <h1>${prod.nombre}</h1>
                    <p class="information">${prod.informacion}</p>
                    <div class="control">
                        <button class="btn" onclick=agregarAlCarrito(${prod.id})>
                            <span class="price">$${prod.precio}</span>
                            <span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
                            <span class="buy">Agregar</span>
                        </button>
                    </div>                    
                </div>            
                <div class="product-image">
                    <img src=${prod.imagen} alt=${prod.nombre}>
                    <div class="info">
                        <h2> Descripcion</h2>
                        <ul>
                            <li><strong>Altura : </strong>${prod.descripcion.altura}</li>
                            <li><strong>Color : </strong>${prod.descripcion.color}</li>
                            <li><strong>Decoracion: </strong>${prod.descripcion.decoracion}</li>
                            <li><strong>Material: </strong>${prod.descripcion.material}</li>                            
                        </ul>
                    </div>
                </div>
    `

    return div
}

function cargarProductos() {
    let divProducts = document.getElementById("products")
    for (const prod of productos) {
        divProducts.appendChild(crearCardProducto(prod))
    }

}

function getCantidadProductosCarrito() {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    return carrito.length
}
function getTotalCarrito() {
    let total = 0
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    
    for (const item of carrito) {
        const producto = productos.find(prod => prod.id == item.product_id )
        total += item.cantidad * producto.precio
    }

    return parseInt(total)
}

function cargarTotales() {
    let total = document.createElement("div")
    total.className = "totales"
    total.innerHTML = `
        <div>
            <p>Cantidad Articulos: ${getCantidadProductosCarrito()}</p>
        </div>
        <div>
            <p>Total: $${getTotalCarrito()}</p>
        </div>
        <button class="btn" onclick="pagar()">
            <span class="btn-pago">Pagar</span>
        </button>
    `
    return total
}

function cargarDetalleCarrito() {
    let tabla = document.getElementById("tabla-cart")
    const itemsTabla = tabla.children.length
    for (let i=itemsTabla-1; i >= 1; i--) {
        tabla.children[i].remove()
    }
    
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    if (carrito.length > 0) {
        for (const prod of carrito) {
            tabla.appendChild(crearItemTablaCarrito(prod))
        }
    }
}

function cargarTotalesCarrito() {
    let divCartContainer = document.getElementsByClassName("cart-container")
    let totales = document.getElementsByClassName("totales")
    if (totales.length > 0 ) {
        totales[0].remove()
    }

    divCartContainer[0].appendChild(cargarTotales())
}

function crearItemTablaCarrito(item) {
    let tr = document.createElement("tr")
    tr.id = item.product_id
    producto = productos.find((producto) => producto.id === item.product_id)
    tr.innerHTML = `
    <td>${producto.nombre}</td>
    <td>
        <button id=${item.product_id} class="btn" onclick=disminuirCantidad(this)>
            <span class="cantidad">-</span>
        </button>
        ${item.cantidad}
        <button id=${item.product_id} class="btn" onclick=aumentarCantidad(this)>
            <span class="cantidad">+</span>
        </button>
    </td>
    <td>$${producto.precio}</td>
    <td>$${producto.precio * item.cantidad}</td>
    <td>
        <button id=${item.product_id} class="btn" onclick=quitarDeCarrito(this)>
            <span class="delete">Quitar</span>
        </button>
    </td>
    `

    return tr
}

function agregarAlCarrito(id) {
    const producto = productos.find((prod) => (prod.id == id))
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    const posicion = carrito.findIndex((elemento) => (elemento.product_id == producto.id))
    
    if (posicion >= 0) {
        carrito[posicion].cantidad++
    } else {
        carrito.push({
            product_id:producto.id,
            cantidad: 1,
        })
    }
    sessionStorage.setItem("carrito",JSON.stringify(carrito))
}

function aumentarCantidad(elemento) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    const posicion = carrito.findIndex(item => item.product_id == elemento.id)
    if (carrito[posicion].cantidad < 100) {
        carrito[posicion].cantidad = carrito[posicion].cantidad+1
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
}

function disminuirCantidad(elemento) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    const posicion = carrito.findIndex(item => item.product_id == elemento.id)
    if (carrito[posicion].cantidad > 1) {
        carrito[posicion].cantidad = carrito[posicion].cantidad-1
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
}

function pagar() {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    if (carrito.length > 0) {
        alert("Se realizo el pago de los productos\n Muchas Gracias")
        vaciarCarrito()
    }
}

function vaciarCarrito() {
    let carrito = []
    sessionStorage.setItem("carrito",JSON.stringify(carrito))
    mostrarCarrito()
}

function quitarDeCarrito(elemento) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"))
    const idProd = elemento.id
    let nuevoCarrito = carrito.filter((item) => (item.product_id != idProd))
    sessionStorage.setItem("carrito",JSON.stringify(nuevoCarrito))
    mostrarCarrito()
}