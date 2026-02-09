// Tribu Venezuela - App Principal
// Funcionalidades: Carrito, menú móvil, búsqueda de productos, formulario de compra, scroll suave

document.addEventListener('DOMContentLoaded', function() {
    // ===== INICIALIZACIÓN =====
    inicializarCarrito();
    inicializarMenuMovil();
    inicializarBusqueda();
    inicializarFormularioCompra();
    inicializarScrollSuave();
    mostrarProductos();
});

// ===== CARRITO DE COMPRAS =====
let carrito = [];

function inicializarCarrito() {
    const carritoGuardado = localStorage.getItem('tribu-carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('Producto agregado al carrito');
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('tribu-carrito', JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = total;
        contador.style.display = total > 0 ? 'block' : 'none';
    }
}

function mostrarCarrito() {
    const modal = document.getElementById('cart-modal');
    const contenido = document.getElementById('cart-items');
    
    if (!modal || !contenido) return;
    
    if (carrito.length === 0) {
        contenido.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        contenido.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="eliminarDelCarrito('${item.id}')">×</button>
            </div>
        `).join('');
        
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        contenido.innerHTML += `
            <div class="cart-total">
                <h3>Total: $${total.toFixed(2)}</h3>
                <button class="checkout-btn" onclick="mostrarFormularioCompra()">Proceder al pago</button>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarCarrito();
        }
    }
}

// ===== MENÚ MÓVIL =====
function inicializarMenuMovil() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('nav a').forEach(enlace => {
            enlace.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
}

// ===== BÚSQUEDA DE PRODUCTOS =====
function inicializarBusqueda() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchContainer = document.querySelector('.search-container');
    const searchBtn = document.querySelector('.btn-search');
    
    if (!searchInput) return;
    
    // Toggle search en móvil
    if (searchBtn && window.innerWidth <= 768) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchContainer) {
                searchContainer.classList.toggle('mobile-visible');
                if (searchContainer.classList.contains('mobile-visible')) {
                    searchInput.focus();
                }
            }
        });
    }
    
    if (!searchResults) return;
    
    let timeoutBusqueda;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(timeoutBusqueda);
        const termino = this.value.toLowerCase().trim();
        
        if (termino.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        timeoutBusqueda = setTimeout(() => {
            buscarProductos(termino);
        }, 300);
    });
    
    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function buscarProductos(termino) {
    const productosFiltrados = window.productosGlobales?.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion?.toLowerCase().includes(termino)
    ) || [];
    
    mostrarResultadosBusqueda(productosFiltrados, termino);
}

function mostrarResultadosBusqueda(productos, termino) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (productos.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No se encontraron productos</div>';
    } else {
        searchResults.innerHTML = productos.map(producto => `
            <div class="search-result-item" onclick="seleccionarProducto('${producto.id}')">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

function seleccionarProducto(id) {
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('search-input').value = '';
    // Scroll al producto
    const productoElement = document.querySelector(`[data-product-id="${id}"]`);
    if (productoElement) {
        productoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productoElement.classList.add('highlighted');
        setTimeout(() => productoElement.classList.remove('highlighted'), 2000);
    }
}

// ===== FORMULARIO DE COMPRA =====
function inicializarFormularioCompra() {
    const formulario = document.getElementById('checkout-form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarCompra();
        });
    }
}

function mostrarFormularioCompra() {
    const modal = document.getElementById('checkout-modal');
    if (modal && carrito.length > 0) {
        modal.style.display = 'block';
        document.getElementById('cart-modal').style.display = 'none';
    }
}

function procesarCompra() {
    const formData = new FormData(document.getElementById('checkout-form'));
    const datosCliente = Object.fromEntries(formData);
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Preparar datos para Telegram
    const mensaje = formatearMensajeTelegram(datosCliente, carrito);
    enviarTelegram(mensaje);
}

function formatearMensajeTelegram(cliente, productos) {
    const total = productos.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    let mensaje = `🛒 NUEVA COMPRA - Tribu Venezuela\n\n`;
    mensaje += `👤 Cliente: ${cliente.nombre} ${cliente.apellido}\n`;
    mensaje += `📞 Teléfono: ${cliente.telefono}\n`;
    mensaje += `📧 Email: ${cliente.email}\n`;
    mensaje += `📍 Dirección: ${cliente.direccion}\n\n`;
    
    mensaje += `📦 Productos:\n`;
    productos.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    
    mensaje += `\n💰 Total: $${total.toFixed(2)}\n`;
    mensaje += `🕐 Fecha: ${new Date().toLocaleString('es-VE')}`;
    
    return mensaje;
}

function enviarTelegram(mensaje) {
    const botToken = '7052869673:AAHzGqZJ7V0IaW1VaLhsL7i83LXeD6KzLJ0';
    const chatId = '7052869673';
    
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: mensaje,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('¡Pedido enviado exitosamente! Nos pondremos en contacto contigo pronto.');
            carrito = [];
            guardarCarrito();
            actualizarContadorCarrito();
            document.getElementById('checkout-modal').style.display = 'none';
            document.getElementById('cart-modal').style.display = 'none';
            document.getElementById('checkout-form').reset();
        } else {
            alert('Error al enviar el pedido. Por favor, intenta de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al enviar el pedido. Por favor, intenta de nuevo.');
    });
}

// ===== SCROLL SUAVE =====
function inicializarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== DATOS DEMO =====
const VENDEDORES = {
    'vend-001': {
        id: 'vend-001',
        nombre: 'María Elena Gutiérrez',
        marca: 'Manos de Barro',
        ubicacion: 'Valencia, Carabobo',
        historia: 'Hace 15 años María Elena dejó su trabajo en una oficina para seguir la tradición familiar de la alfarería. Su abuela le enseñó los secretos del barro rojo de Guataparo, y hoy sus piezas son solicitadas en toda Venezuela.',
        especialidad: 'Cerámica artesanal',
        foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        whatsapp: '+58 412-2223775',
        productosCount: 8
    },
    'vend-002': {
        id: 'vend-002',
        nombre: 'José Rafael Morales',
        marca: 'Tejidos del Llano',
        ubicacion: 'San Fernando de Apure',
        historia: 'José Rafael aprendió a tejer de su madre, quien a su vez lo aprendió de la suya. En su taller junto al río Portuguesa, teje hamacas usando las mismas técnicas que usaban los llaneros hace 200 años.',
        especialidad: 'Hamacas y textiles',
        foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        whatsapp: '+58 412-2223775',
        productosCount: 12
    },
    'vend-003': {
        id: 'vend-003',
        nombre: 'Ana Lucía Pérez',
        marca: 'Orfebre Andina',
        ubicacion: 'Mérida, Mérida',
        historia: 'Ana Lucía combina la orfebrería tradicional andina con diseños contemporáneos. En su taller a 1,600 metros de altura, trabaja plata 925 y piedras semipreciosas de la región.',
        especialidad: 'Joyería en plata',
        foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        whatsapp: '+58 412-2223775',
        productosCount: 15
    },
    'vend-004': {
        id: 'vend-004',
        nombre: 'Carlos Eduardo Mendoza',
        marca: 'Maderas del Sur',
        ubicacion: 'Santa Elena de Uairén, Bolívar',
        historia: 'Carlos Eduardo trabaja maderas amazónicas de tala sostenible. Cada pieza incluye un certificado de origen que rastrea el árbol hasta la comunidad indígena que lo cuidó.',
        especialidad: 'Talla en madera',
        foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        whatsapp: '+58 412-2223775',
        productosCount: 6
    }
};

const PRODUCTOS = [
    {
        id: 'prod-001',
        vendedorId: 'vend-001',
        nombre: 'Set de Tazas Espresso Artesanales',
        descripcion: 'Set de 4 tazas para espresso, hechas a mano en torno manual. Cada una es única. Vidriado interior seguro para alimentos.',
        precio: 45.00,
        precioBs: 4500000,
        categoria: 'ceramica',
        imagen: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600',
        stock: 5,
        rating: 4.8,
        reviews: 23,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-002',
        vendedorId: 'vend-001',
        nombre: 'Vasija Decorativa Terracota',
        descripcion: 'Pieza decorativa inspirada en las vasijas precolombinas del valle de Quíbor. Perfecta para flores secas.',
        precio: 78.00,
        precioBs: 7800000,
        categoria: 'decoracion',
        imagen: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
        stock: 3,
        rating: 4.9,
        reviews: 12,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-003',
        vendedorId: 'vend-001',
        nombre: 'Cuenco Rústico para Frutas',
        descripcion: 'Cuenco grande para frutas o ensaladas. Pieza de edición limitada, numerada.',
        precio: 65.00,
        precioBs: 6500000,
        categoria: 'ceramica',
        imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
        stock: 2,
        rating: 5.0,
        reviews: 8,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-004',
        vendedorId: 'vend-002',
        nombre: 'Hamaca Tradicional Llanera',
        descripcion: 'Hamaca tejida a mano con hilo de cumare. Resiste hasta 200kg. Incluye ganchos de madera.',
        precio: 120.00,
        precioBs: 12000000,
        categoria: 'textiles',
        imagen: 'https://images.unsplash.com/photo-1522771753037-a0a1f66cd459?w=600',
        stock: 8,
        rating: 4.7,
        reviews: 34,
        tiempoEntrega: '5-7 días'
    },
    {
        id: 'prod-005',
        vendedorId: 'vend-002',
        nombre: 'Chinchorro Doble con Borlas',
        descripcion: 'Chinchorro tradicional venezolano, tamaño matrimonial. Tejido en crochet con algodón egipcio.',
        precio: 280.00,
        precioBs: 28000000,
        categoria: 'textiles',
        imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
        stock: 2,
        rating: 4.9,
        reviews: 19,
        tiempoEntrega: '7-10 días'
    },
    {
        id: 'prod-006',
        vendedorId: 'vend-002',
        nombre: 'Set de 4 Manteles Individuales',
        descripcion: 'Manteles tejidos con fibras de cumare y chiquichique del Llano. Resistentes al agua.',
        precio: 55.00,
        precioBs: 5500000,
        categoria: 'textiles',
        imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
        stock: 10,
        rating: 4.6,
        reviews: 15,
        tiempoEntrega: '5-7 días'
    },
    {
        id: 'prod-007',
        vendedorId: 'vend-003',
        nombre: 'Anillo Páramo - Plata 925',
        descripcion: 'Anillo inspirado en los frailejones del páramo andino. Plata 925 con ónix negro natural.',
        precio: 85.00,
        precioBs: 8500000,
        categoria: 'joyeria',
        imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
        stock: 6,
        rating: 4.9,
        reviews: 42,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-008',
        vendedorId: 'vend-003',
        nombre: 'Collar Filigrana Flor de Andes',
        descripcion: 'Collar de filigrana tradicional. Plata 925 con piedra de amatista de Los Andes.',
        precio: 140.00,
        precioBs: 14000000,
        categoria: 'joyeria',
        imagen: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600',
        stock: 3,
        rating: 5.0,
        reviews: 28,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-009',
        vendedorId: 'vend-003',
        nombre: 'Pulsera Cuero y Plata',
        descripcion: 'Pulsera unisex en cuero vegetal con dijes de plata 925. Ajustable.',
        precio: 45.00,
        precioBs: 4500000,
        categoria: 'joyeria',
        imagen: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
        stock: 15,
        rating: 4.7,
        reviews: 56,
        tiempoEntrega: '3-5 días'
    },
    {
        id: 'prod-010',
        vendedorId: 'vend-004',
        nombre: 'Tabla de Cortar Artesanal',
        descripcion: 'Tabla de cedro amazónico, tratada con aceite de linaza. Medidas: 45x30cm.',
        precio: 95.00,
        precioBs: 9500000,
        categoria: 'materiales-naturales',
        imagen: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
        stock: 4,
        rating: 4.8,
        reviews: 31,
        tiempoEntrega: '5-7 días'
    },
    {
        id: 'prod-011',
        vendedorId: 'vend-004',
        nombre: 'Caja Decorativa Tallada a Mano',
        descripcion: 'Caja de araguaney con tallas geométricas indígenas Pemón. Interior en terciopelo.',
        precio: 160.00,
        precioBs: 16000000,
        categoria: 'decoracion',
        imagen: 'https://images.unsplash.com/photo-1605218427306-649cd9b09588?w=600',
        stock: 2,
        rating: 4.9,
        reviews: 14,
        tiempoEntrega: '5-7 días'
    },
    {
        id: 'prod-012',
        vendedorId: 'vend-004',
        nombre: 'Set de Utensilios de Cocina',
        descripcion: 'Set de 5 piezas en madera de mora. Acabado con cera de abejas natural.',
        precio: 68.00,
        precioBs: 6800000,
        categoria: 'materiales-naturales',
        imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
        stock: 7,
        rating: 4.7,
        reviews: 22,
        tiempoEntrega: '5-7 días'
    }
];

// ===== VARIABLE GLOBAL PARA FILTRO =====
let categoriaActiva = null;

// ===== MOSTRAR PRODUCTOS =====
function mostrarProductos(filtrarCategoria = null) {
    const contenedor = document.querySelector('.all-products .products-grid') || document.querySelector('.products-grid');
    if (!contenedor) return;
    
    categoriaActiva = filtrarCategoria;
    let productosAMostrar = PRODUCTOS;
    
    // Filtrar por categoría si se especifica
    if (filtrarCategoria) {
        productosAMostrar = PRODUCTOS.filter(p => p.categoria === filtrarCategoria);
    }
    
    // Actualizar título según filtro
    const tituloSeccion = document.querySelector('.all-products .section-title') || document.querySelector('.featured-products .section-title');
    const subtituloSeccion = document.querySelector('.all-products .section-subtitle') || document.querySelector('.featured-products .section-subtitle');
    
    if (filtrarCategoria && tituloSeccion) {
        const nombresCategorias = {
            'ceramica': 'Cerámica Artesanal',
            'textiles': 'Textiles y Tejidos',
            'joyeria': 'Joyería en Plata',
            'materiales-naturales': 'Materiales Naturales',
            'decoracion': 'Decoración',
            'arte-popular': 'Arte Popular'
        };
        tituloSeccion.textContent = nombresCategorias[filtrarCategoria] || filtrarCategoria;
        if (subtituloSeccion) {
            subtituloSeccion.textContent = `${productosAMostrar.length} productos encontrados`;
        }
    } else if (tituloSeccion && !filtrarCategoria) {
        // Restaurar título original si venimos de un filtro
        if (tituloSeccion.textContent.includes('Cerámica') || 
            tituloSeccion.textContent.includes('Textiles') || 
            tituloSeccion.textContent.includes('Joyería')) {
            tituloSeccion.textContent = 'Todos los Productos';
            if (subtituloSeccion) {
                subtituloSeccion.textContent = 'Descubre toda nuestra colección de artesanías';
            }
        }
    }
    
    window.productosGlobales = productosAMostrar;
    
    // Construir HTML de productos
    let htmlProductos = productosAMostrar.map(producto => {
        const vendedor = VENDEDORES[producto.vendedorId];
        return `
            <div class="product-card" onclick="mostrarDetalleProducto('${producto.id}')">
                <div class="product-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <button class="btn-quick-add" onclick="event.stopPropagation(); agregarAlCarritoDesdeGrid('${producto.id}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <p class="product-artisan">Por: ${vendedor.marca}, ${vendedor.ubicacion}</p>
                    <p class="product-desc">${producto.descripcion.substring(0, 60)}...</p>
                    <div class="product-price">
                        <span class="price">$${producto.precio.toFixed(2)}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${producto.rating} (${producto.reviews})</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar botón "Ver todos" si estamos filtrando
    if (filtrarCategoria) {
        htmlProductos += `
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px;">
                <button onclick="mostrarProductos(); window.scrollTo({top: document.querySelector('.all-products').offsetTop - 100, behavior: 'smooth'});" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Ver todos los productos
                </button>
            </div>
        `;
    }
    
    contenedor.innerHTML = htmlProductos;
}

// ===== FUNCIÓN PARA FILTRAR POR CATEGORÍA =====
function showCategory(categoria) {
    // Nombres amigables para mostrar
    const nombresCategorias = {
        'ceramica': 'Cerámica',
        'textiles': 'Textiles',
        'joyeria': 'Joyería',
        'materiales-naturales': 'Materiales Naturales',
        'decoracion': 'Decoración',
        'arte-popular': 'Arte Popular'
    };
    
    // Mostrar productos filtrados
    mostrarProductos(categoria);
    
    // Scroll a la sección de productos
    const seccionProductos = document.querySelector('.all-products');
    if (seccionProductos) {
        seccionProductos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Mostrar notificación
    mostrarNotificacion(`Mostrando productos de ${nombresCategorias[categoria] || categoria}`);
}

function agregarAlCarritoDesdeGrid(productoId) {
    const producto = PRODUCTOS.find(p => p.id === productoId);
    if (producto) {
        agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        });
    }
}

function mostrarDetalleProducto(productoId) {
    const producto = PRODUCTOS.find(p => p.id === productoId);
    const vendedor = VENDEDORES[producto.vendedorId];
    
    if (!producto) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal product-modal';
    modal.id = 'product-detail-modal';
    modal.innerHTML = `
        <div class="modal-content product-detail">
            <button class="close-modal" onclick="cerrarModal('product-detail-modal')">&times;</button>
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="product-detail-info">
                    <h2>${producto.nombre}</h2>
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${producto.rating} (${producto.reviews} reseñas)
                    </div>
                    <p class="product-detail-price">$${producto.precio.toFixed(2)} USD</p>
                    <p class="product-detail-bs">${producto.precioBs.toLocaleString()} Bs</p>
                    <p class="product-detail-desc">${producto.descripcion}</p>
                    
                    <div class="vendedor-card">
                        <img src="${vendedor.foto}" alt="${vendedor.nombre}" class="vendedor-foto">
                        <div class="vendedor-info">
                            <h4>${vendedor.marca}</h4>
                            <p>${vendedor.ubicacion}</p>
                            <button onclick="mostrarPerfilVendedor('${vendedor.id}')" class="btn-link">Ver perfil del artesano</button>
                        </div>
                    </div>
                    
                    <div class="product-meta">
                        <p><i class="fas fa-box"></i> Stock: ${producto.stock} unidades</p>
                        <p><i class="fas fa-shipping-fast"></i> Entrega: ${producto.tiempoEntrega}</p>
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="agregarAlCarrito({id: '${producto.id}', nombre: '${producto.nombre}', precio: ${producto.precio}, imagen: '${producto.imagen}'}); cerrarModal('product-detail-modal');">
                        <i class="fas fa-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function mostrarPerfilVendedor(vendedorId) {
    const vendedor = VENDEDORES[vendedorId];
    if (!vendedor) return;
    
    const productosVendedor = PRODUCTOS.filter(p => p.vendedorId === vendedorId);
    
    const modal = document.createElement('div');
    modal.className = 'modal vendedor-modal';
    modal.id = 'vendedor-modal';
    modal.innerHTML = `
        <div class="modal-content vendedor-profile">
            <button class="close-modal" onclick="cerrarModal('vendedor-modal')">&times;</button>
            <div class="vendedor-header">
                <img src="${vendedor.foto}" alt="${vendedor.nombre}" class="vendedor-foto-large">
                <div class="vendedor-header-info">
                    <h2>${vendedor.marca}</h2>
                    <p class="vendedor-nombre">Por ${vendedor.nombre}</p>
                    <p class="vendedor-ubicacion"><i class="fas fa-map-marker-alt"></i> ${vendedor.ubicacion}</p>
                    <p class="vendedor-especialidad">${vendedor.especialidad}</p>
                </div>
            </div>
            <div class="vendedor-historia">
                <h3>Su historia</h3>
                <p>${vendedor.historia}</p>
            </div>
            <div class="vendedor-stats">
                <div class="stat">
                    <span class="stat-number">${productosVendedor.length}</span>
                    <span class="stat-label">Productos</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${vendedor.productosCount}</span>
                    <span class="stat-label">Ventas</span>
                </div>
            </div>
            <div class="vendedor-productos">
                <h3>Productos de ${vendedor.marca}</h3>
                <div class="products-grid small">
                    ${productosVendedor.map(p => `
                        <div class="product-card" onclick="cerrarModal('vendedor-modal'); mostrarDetalleProducto('${p.id}')">
                            <img src="${p.imagen}" alt="${p.nombre}">
                            <h4>${p.nombre}</h4>
                            <p class="price">$${p.precio.toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="vendedor-contacto">
                <a href="https://wa.me/${vendedor.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ===== FORMULARIO PARA NUEVOS VENDEDORES =====
function mostrarFormularioVendedor() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'form-vendedor-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; padding: 40px;">
            <button class="close-modal" onclick="cerrarModal('form-vendedor-modal')">&times;</button>
            <h2 style="font-family: var(--font-secondary); margin-bottom: 10px;">Únete a Tribu</h2>
            <p style="color: var(--gray); margin-bottom: 30px;">Comparte tu arte con toda Venezuela</p>
            
            <form id="form-vendedor" onsubmit="enviarFormularioVendedor(event)">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nombre completo</label>
                    <input type="text" name="nombre" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nombre de tu marca/taller</label>
                    <input type="text" name="marca" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Ubicación (Ciudad, Estado)</label>
                    <input type="text" name="ubicacion" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Especialidad</label>
                    <select name="especialidad" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                        <option value="">Selecciona tu especialidad</option>
                        <option value="ceramica">Cerámica</option>
                        <option value="textiles">Textiles</option>
                        <option value="joyeria">Joyería</option>
                        <option value="madera">Talla en madera</option>
                        <option value="arte">Arte popular</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Tu historia (¿cómo empezaste?)</label>
                    <textarea name="historia" rows="4" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">WhatsApp</label>
                    <input type="tel" name="whatsapp" placeholder="0412-1234567" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Instagram (opcional)</label>
                    <input type="text" name="instagram" placeholder="@tumarca" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                    Enviar solicitud
                </button>
                
                <p style="font-size: 0.85rem; color: var(--gray); margin-top: 15px; text-align: center;">
                    Revisaremos tu solicitud y te contactaremos en 24-48 horas.
                </p>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function enviarFormularioVendedor(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Aquí se enviaría a un backend
    console.log('Nuevo vendedor:', data);
    
    // Mostrar confirmación
    cerrarModal('form-vendedor-modal');
    
    const confirmacion = document.createElement('div');
    confirmacion.className = 'modal';
    confirmacion.innerHTML = `
        <div class="modal-content" style="max-width: 400px; padding: 40px; text-align: center;">
            <div style="font-size: 60px; color: var(--success); margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="font-family: var(--font-secondary); margin-bottom: 10px;">¡Solicitud enviada!</h2>
            <p style="color: var(--gray);">Revisaremos tu perfil y te contactaremos pronto por WhatsApp.</p>
            <button onclick="this.closest('.modal').remove()" class="btn btn-primary" style="margin-top: 20px;">Entendido</button>
        </div>
    `;
    document.body.appendChild(confirmacion);
    confirmacion.style.display = 'block';
}

// Hacer funciones globales
window.mostrarDetalleProducto = mostrarDetalleProducto;
window.mostrarPerfilVendedor = mostrarPerfilVendedor;
window.cerrarModal = cerrarModal;
window.mostrarFormularioVendedor = mostrarFormularioVendedor;
window.enviarFormularioVendedor = enviarFormularioVendedor;
window.agregarAlCarritoDesdeGrid = agregarAlCarritoDesdeGrid;
window.showCategory = showCategory;
window.mostrarProductos = mostrarProductos;

// ===== FUNCIONES AUXILIARES =====
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Función global para abrir el carrito
window.mostrarCarrito = mostrarCarrito;

// Función para ver detalle de producto (desde los cards de productos)
function showProductDetail(productId) {
    window.location.href = 'producto.html?id=' + productId;
}

// Hacer funciones globales para que estén disponibles en el HTML
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.mostrarFormularioCompra = mostrarFormularioCompra;
window.seleccionarProducto = seleccionarProducto;
window.showProductDetail = showProductDetail;