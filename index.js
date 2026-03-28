let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartDropdown = document.getElementById("cart-dropdown");


function toggleCart() {
    if (cartDropdown.style.display === "block") {
        cartDropdown.style.display = "none";
    } else {
        cartDropdown.style.display = "block";
    }
}

function addToCart(price, name, image) {
    const cleanImage = image.replace("../", "");
    let existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: cleanImage,
            quantity: 1
        });
    }
    updateCart();
}

function removeItem(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function clearCart() {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
        cart = []; 
        updateCart(); 
    }
}

function updateCart() {
    let totalMoney = 0;
    let totalProducts = 0;
    if (cartItems) cartItems.innerHTML = "";

    const isInSubfolder = window.location.pathname.includes("/paginas/");
    const routePrefix = isInSubfolder ? "../" : "";

    cart.forEach((item, index) => {
        totalMoney += (item.price * item.quantity);
        totalProducts += item.quantity;
        
        if (cartItems) {
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${routePrefix}${item.image}" class="cart-img">
                    <div>
                        <p><strong>${item.name}</strong></p>
                        <p>S/${item.price} x ${item.quantity}</p> 
                    </div>
                    <button class="remove-btn" onclick="event.stopPropagation(); removeItem(${index})">x</button>
                </div>
            `;
        }
    });

    if(cartCount) cartCount.innerText = totalProducts; 
    if(cartTotal) cartTotal.innerText = totalMoney;
    
    localStorage.setItem("cart", JSON.stringify(cart));
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    const isInSubfolder = window.location.pathname.includes("/paginas/");
    window.location.href = isInSubfolder ? "checkout.html" : "paginas/checkout.html";
}


async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        const productos = await respuesta.json();
        const contenedorPrincipal = document.getElementById('contenedor-productos');
        
        if(!contenedorPrincipal) return; 
        
        contenedorPrincipal.innerHTML = ""; 

        const categorias = [...new Set(productos.map(p => p.categoria))];

    
        categorias.forEach(cat => {
      
            const titulo = document.createElement("h2");
            titulo.className = "titulo-categoria";
            titulo.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
            contenedorPrincipal.appendChild(titulo);

   
            const grid = document.createElement("div");
            grid.className = "productos-grid"; 

            const productosFiltrados = productos.filter(p => p.categoria === cat);

            productosFiltrados.forEach(p => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <a href="${p.link}">
                        <img src="${p.imagen}" alt="${p.nombre}">
                    </a>
                    <h3>${p.nombre}</h3>
                    <p>S/${p.precio}</p>
                    <button onclick="addToCart(${p.precio}, '${p.nombre}', '${p.imagen}')">
                        Agregar al carrito
                    </button>
                `;
                grid.appendChild(card);
            });

            contenedorPrincipal.appendChild(grid);
        });

    } catch (error) {
        console.error("Error cargando los productos:", error);
    }
}

function confirmPurchase() {
    const modal = document.getElementById("payment-modal");
    if(modal) modal.style.display = "flex";
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if(modal) modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("payment-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Inicialización
updateCart();
cargarProductos();