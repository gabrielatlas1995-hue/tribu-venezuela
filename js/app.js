// Tribu App - JavaScript Completo

// ========== CARRITO ==========
const CART_KEY = 'tribu_cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartSidebar();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
  showToast(`${product.name} agregado al carrito`, 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  showToast('Producto eliminado del carrito', 'info');
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCartSidebar();
}

function getCartTotal() {
  return getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  countElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ========== SIDEBAR CARRITO ==========
function initCartSidebar() {
  // Crear el backdrop si no existe
  let backdrop = document.getElementById('cart-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'cart-backdrop';
    backdrop.className = 'cart-backdrop';
    backdrop.onclick = closeCartSidebar;
    document.body.appendChild(backdrop);
  }
  
  renderCartSidebar();
}

function openCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  const backdrop = document.getElementById('cart-backdrop');
  
  if (sidebar) {
    sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  if (backdrop) {
    backdrop.classList.add('open');
  }
}

function closeCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  const backdrop = document.getElementById('cart-backdrop');
  
  if (sidebar) {
    sidebar.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (backdrop) {
    backdrop.classList.remove('open');
  }
}

function renderCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  if (!sidebar) return;
  
  const cart = getCart();
  const total = getCartTotal();
  
  if (cart.length === 0) {
    sidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3>🛒 Tu Carrito</h3>
        <button class="cart-close" onclick="closeCartSidebar()">✕</button>
      </div>
      <div class="cart-empty">
        <span class="cart-empty-icon">🛍️</span>
        <p>Tu carrito está vacío</p>
        <a href="pages/productos.html" class="btn btn-primary" onclick="closeCartSidebar()">Explorar Productos</a>
      </div>
    `;
  } else {
    sidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3>🛒 Tu Carrito (${getCartCount()})</h3>
        <button class="cart-close" onclick="closeCartSidebar()">✕</button>
      </div>
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">
              ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<span>🎨</span>'}
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-artisan">${item.artisan || ''}</p>
              <div class="cart-item-controls">
                <div class="quantity-selector">
                  <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                  <span>${item.quantity}</span>
                  <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
          </div>
        `).join('')}
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="cart-total-amount">$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="goToCheckout()">Proceder al Pago</button>
        <button class="btn btn-secondary btn-full btn-outline" onclick="closeCartSidebar()">Seguir Comprando</button>
      </div>
    `;
  }
}

function goToCheckout() {
  window.location.href = 'checkout.html';
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  container.appendChild(toast);
  
  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ========== GALERÍA DE IMÁGENES ==========
function initGallery(images, productId) {
  const gallery = document.getElementById('product-gallery');
  if (!gallery || !images || images.length === 0) return;
  
  gallery.innerHTML = `
    <div class="gallery-main">
      <img id="gallery-main-image" src="${images[0]}" alt="Imagen principal">
      ${images.length > 1 ? `
        <button class="gallery-nav gallery-prev" onclick="changeImage(-1)">‹</button>
        <button class="gallery-nav gallery-next" onclick="changeImage(1)">›</button>
      ` : ''}
    </div>
    ${images.length > 1 ? `
      <div class="gallery-thumbnails">
        ${images.map((img, idx) => `
          <button class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="setGalleryImage(${idx})">
            <img src="${img}" alt="Miniatura ${idx + 1}">
          </button>
        `).join('')}
      </div>
    ` : ''}
  `;
  
  window.galleryImages = images;
  window.galleryCurrentIndex = 0;
}

function setGalleryImage(index) {
  if (!window.galleryImages) return;
  
  window.galleryCurrentIndex = index;
  const mainImage = document.getElementById('gallery-main-image');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  
  if (mainImage) {
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = window.galleryImages[index];
      mainImage.style.opacity = '1';
    }, 150);
  }
  
  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

function changeImage(direction) {
  if (!window.galleryImages) return;
  
  const newIndex = (window.galleryCurrentIndex + direction + window.galleryImages.length) % window.galleryImages.length;
  setGalleryImage(newIndex);
}

// ========== COMPARTIR ==========
function shareProduct(product, platform) {
  const url = window.location.href;
  const text = `Mira este producto: ${product.name} por ${product.artisan} - $${product.price}`;
  
  switch (platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copiado al portapapeles', 'success');
      }).catch(() => {
        showToast('Error al copiar el link', 'error');
      });
      break;
  }
}

function initShareButtons(product) {
  const container = document.getElementById('share-buttons');
  if (!container) return;
  
  container.innerHTML = `
    <button class="share-btn whatsapp" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "whatsapp")' title="Compartir en WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </button>
    <button class="share-btn facebook" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "facebook")' title="Compartir en Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </button>
    <button class="share-btn twitter" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "twitter")' title="Compartir en Twitter">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
    </button>
    <button class="share-btn copy" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "copy")' title="Copiar link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
    </button>
  `;
}

// ========== CHECKOUT LOADER ==========
function showCheckoutLoader(message = 'Procesando tu pedido...') {
  const loader = document.getElementById('checkout-loader');
  if (!loader) {
    const newLoader = document.createElement('div');
    newLoader.id = 'checkout-loader';
    newLoader.className = 'checkout-loader';
    newLoader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <p class="loader-message">${message}</p>
      </div>
    `;
    document.body.appendChild(newLoader);
  } else {
    loader.querySelector('.loader-message').textContent = message;
    loader.classList.add('show');
  }
}

function hideCheckoutLoader() {
  const loader = document.getElementById('checkout-loader');
  if (loader) {
    loader.classList.remove('show');
  }
}

function processCheckout(formData) {
  showCheckoutLoader('Verificando tu información...');
  
  setTimeout(() => {
    showCheckoutLoader('Procesando el pago...');
    
    setTimeout(() => {
      showCheckoutLoader('¡Pedido confirmado! Redirigiendo...');
      clearCart();
      
      setTimeout(() => {
        hideCheckoutLoader();
        window.location.href = 'index.html?order=success';
      }, 1500);
    }, 2000);
  }, 1500);
}

// ========== NAVEGACIÓN ==========
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('active');
    });
  }
}

function goToPage(pageName) {
  window.location.href = `pages/${pageName}.html`;
}

// ========== ARTISANOS DEMO ==========
const sampleArtisans = [
  {
    id: 'art-001',
    name: 'María González',
    location: 'Oaxaca, México',
    bio: 'Artesana con más de 20 años de experiencia en cerámica tradicional. Cada pieza es única y refleja la cultura ancestral de su región.',
    avatar: 'images/artisan-1.jpg',
    whatsapp: '+52 951 123 4567',
    rating: 4.8,
    sales: 156
  },
  {
    id: 'art-002',
    name: 'Artesanías del Sur',
    location: 'Colombia',
    bio: 'Cooperativa de artesanos dedicada a preservar las técnicas ancestrales de tejido. Trabajamos con fibras naturales y sustentables.',
    avatar: 'images/artisan-2.jpg',
    whatsapp: '+57 300 123 4567',
    rating: 4.9,
    sales: 234
  },
  {
    id: 'art-003',
    name: 'Juan Pérez',
    location: 'Cusco, Perú',
    bio: 'Orfebre especializado en joyería tradicional con plata. Sus diseños están inspirados en la cultura andina y los símbolos precolombinos.',
    avatar: 'images/artisan-3.jpg',
    whatsapp: '+51 84 123 456',
    rating: 4.7,
    sales: 89
  },
  {
    id: 'art-004',
    name: 'Comunidad Quechua',
    location: 'Sierra Peruana',
    bio: 'Comunidad indígena que preserva el arte textil ancestral. Sus piezas cuentan historias transmitidas de generación en generación.',
    avatar: 'images/artisan-4.jpg',
    whatsapp: '+51 1 123 4567',
    rating: 5.0,
    sales: 312
  },
  {
    id: 'art-005',
    name: 'Carlos Mendoza',
    location: 'Guatemala',
    bio: 'Tallador de madera con técnicas heredadas de su abuelo. Especializado en máscaras tradicionales y figuras de animales.',
    avatar: 'images/artisan-5.jpg',
    whatsapp: '+502 1234 5678',
    rating: 4.6,
    sales: 78
  },
  {
    id: 'art-006',
    name: 'Laura Silva',
    location: 'Argentina',
    bio: 'Artesana en cuero con 15 años de experiencia en marroquinería. Cada pieza es trabajada a mano con técnicas tradicionales argentinas.',
    avatar: 'images/artisan-6.jpg',
    whatsapp: '+54 9 11 1234 5678',
    rating: 4.9,
    sales: 201
  }
];

// ========== PRODUCTOS DEMO ==========
const sampleProducts = [
  {
    id: '1',
    artisanId: 'art-001',
    name: 'Cerámica Tallada a Mano',
    artisan: 'María González',
    price: 45.00,
    category: 'ceramica',
    image: 'images/product-1.jpg',
    description: 'Hermosa cerámica tallada a mano con técnicas tradicionales. Pieza única que refleja la cultura ancestral.',
    images: ['images/product-1.jpg', 'images/product-1-2.jpg', 'images/product-1-3.jpg'],
    artisanInfo: {
      name: 'María González',
      location: 'Oaxaca, México',
      bio: 'Artesana con más de 20 años de experiencia en cerámica tradicional.',
      avatar: 'images/artisan-1.jpg'
    }
  },
  {
    id: '2',
    artisanId: 'art-002',
    name: 'Bolso de Mimbre Natural',
    artisan: 'Artesanías del Sur',
    price: 32.00,
    category: 'textiles',
    image: 'images/product-2.jpg',
    description: 'Bolso tejido a mano con fibras naturales de mimbre. Resistente y elegante.',
    images: ['images/product-2.jpg', 'images/product-2-2.jpg'],
    artisanInfo: {
      name: 'Artesanías del Sur',
      location: 'Colombia',
      bio: 'Cooperativa de artesanos dedicada a preservar las técnicas ancestrales de tejido.',
      avatar: 'images/artisan-2.jpg'
    }
  },
  {
    id: '3',
    artisanId: 'art-003',
    name: 'Collar de Plata Étnica',
    artisan: 'Juan Pérez',
    price: 78.00,
    category: 'joyeria',
    image: 'images/product-3.jpg',
    description: 'Collar de plata 925 con diseños étnicos inspirados en la cultura andina.',
    images: ['images/product-3.jpg', 'images/product-3-2.jpg', 'images/product-3-3.jpg'],
    artisanInfo: {
      name: 'Juan Pérez',
      location: 'Cusco, Perú',
      bio: 'Orfebre especializado en joyería tradicional con plata.',
      avatar: 'images/artisan-3.jpg'
    }
  },
  {
    id: '4',
    artisanId: 'art-004',
    name: 'Cuadro Textil Andino',
    artisan: 'Comunidad Quechua',
    price: 120.00,
    category: 'arte',
    image: 'images/product-4.jpg',
    description: 'Cuadro textil bordado a mano con lana de alpaca y tintes naturales.',
    images: ['images/product-4.jpg', 'images/product-4-2.jpg'],
    artisanInfo: {
      name: 'Comunidad Quechua',
      location: 'Sierra Peruana',
      bio: 'Comunidad indígena que preserva el arte textil ancestral.',
      avatar: 'images/artisan-4.jpg'
    }
  },
  {
    id: '5',
    artisanId: 'art-005',
    name: 'Máscara de Madera Tallada',
    artisan: 'Carlos Mendoza',
    price: 89.00,
    category: 'madera',
    image: 'images/product-5.jpg',
    description: 'Máscara tradicional tallada en madera de cedro. Pintada a mano.',
    images: ['images/product-5.jpg', 'images/product-5-2.jpg'],
    artisanInfo: {
      name: 'Carlos Mendoza',
      location: 'Guatemala',
      bio: 'Tallador de madera con técnicas heredadas de su abuelo.',
      avatar: 'images/artisan-5.jpg'
    }
  },
  {
    id: '6',
    artisanId: 'art-006',
    name: 'Cartera de Cuero Artesanal',
    artisan: 'Laura Silva',
    price: 65.00,
    category: 'cuero',
    image: 'images/product-6.jpg',
    description: 'Cartera de cuero genuino hecha a mano. Diseño elegante y duradero.',
    images: ['images/product-6.jpg', 'images/product-6-2.jpg', 'images/product-6-3.jpg'],
    artisanInfo: {
      name: 'Laura Silva',
      location: 'Argentina',
      bio: 'Artesana en cuero con 15 años de experiencia en marroquinería.',
      avatar: 'images/artisan-6.jpg'
    }
  }
];

function getProductById(id) {
  return sampleProducts.find(p => p.id === id);
}

function getRelatedProducts(category, excludeId, limit = 3) {
  return sampleProducts
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}

// ========== FUNCIONES DE ARTISANOS ==========
function getArtisanById(id) {
  return sampleArtisans.find(a => a.id === id);
}

function getProductsByArtisan(artisanId) {
  return sampleProducts.filter(p => p.artisanId === artisanId);
}

function loadArtisanStore() {
  const urlParams = new URLSearchParams(window.location.search);
  const artisanId = urlParams.get('id');
  
  const profileContainer = document.getElementById('artisan-profile');
  const productsContainer = document.getElementById('artisan-products-grid');
  const noProductsMessage = document.getElementById('no-products-message');
  const breadcrumbName = document.getElementById('breadcrumb-artisan-name');
  const productsCount = document.getElementById('products-count');
  
  if (!artisanId) {
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <h2>Artesano no encontrado</h2>
          <p>No se especificó un artesano válido.</p>
          <a href="productos.html" class="btn btn-primary">Ver todos los productos</a>
        </div>
      `;
    }
    return;
  }
  
  const artisan = getArtisanById(artisanId);
  
  if (!artisan) {
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <h2>Artesano no encontrado</h2>
          <p>El artesano que buscas no existe en nuestra tienda.</p>
          <a href="productos.html" class="btn btn-primary">Ver todos los productos</a>
        </div>
      `;
    }
    return;
  }
  
  // Update page title
  document.title = `${artisan.name} - Tribu`;
  
  // Update breadcrumb
  if (breadcrumbName) {
    breadcrumbName.textContent = artisan.name;
  }
  
  // Get artisan products
  const products = getProductsByArtisan(artisanId);
  
  // Render artisan profile
  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="artisan-avatar-large">
        ${artisan.avatar ? 
          `<img src="../${artisan.avatar}" alt="${artisan.name}">` : 
          `<span class="avatar-placeholder">👤</span>`
        }
      </div>
      <div class="artisan-info-main">
        <h1 class="artisan-name-large">${artisan.name}</h1>
        <p class="artisan-location-large">
          <span>📍</span> ${artisan.location}
        </p>
        <p class="artisan-bio-large">${artisan.bio}</p>
        <div class="artisan-stats-row">
          <div class="artisan-stat">
            <span class="stat-icon">⭐</span>
            <div class="stat-content">
              <span class="stat-value">${artisan.rating}</span>
              <span class="stat-label">Rating promedio</span>
            </div>
          </div>
          <div class="artisan-stat">
            <span class="stat-icon">📦</span>
            <div class="stat-content">
              <span class="stat-value">${products.length}</span>
              <span class="stat-label">Productos</span>
            </div>
          </div>
          <div class="artisan-stat">
            <span class="stat-icon">🛒</span>
            <div class="stat-content">
              <span class="stat-value">${artisan.sales}</span>
              <span class="stat-label">Ventas</span>
            </div>
          </div>
        </div>
        <div class="artisan-actions">
          <a href="https://wa.me/${artisan.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-whatsapp">
            <span>💬</span> Contactar por WhatsApp
          </a>
          <a href="productos.html" class="btn btn-secondary">Ver todos los productos</a>
        </div>
      </div>
    `;
  }
  
  // Update products count
  if (productsCount) {
    productsCount.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`;
  }
  
  // Render products or show empty message
  if (productsContainer) {
    if (products.length === 0) {
      productsContainer.style.display = 'none';
      if (noProductsMessage) {
        noProductsMessage.style.display = 'block';
      }
    } else {
      productsContainer.style.display = 'grid';
      if (noProductsMessage) {
        noProductsMessage.style.display = 'none';
      }
      
      productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
          <a href="../producto.html?id=${product.id}" class="product-image-link">
            <div class="product-image" style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); display: flex; align-items: center; justify-content: center; color: #9ca3af;">
              <span style="font-size: 3rem;">🎨</span>
            </div>
          </a>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">
              <a href="../producto.html?id=${product.id}">${product.name}</a>
            </h3>
            <p class="product-artisan">
              <a href="tienda-artesano.html?id=${artisan.id}">por ${artisan.name}</a>
            </p>
            <div class="product-footer">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <button class="btn btn-primary btn-small" onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&#39;")})'>
                Agregar
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

function renderProducts(containerId, products = sampleProducts) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="producto.html?id=${product.id}" class="product-image-link">
        <div class="product-image" style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); display: flex; align-items: center; justify-content: center; color: #9ca3af;">
          <span style="font-size: 3rem;">🎨</span>
        </div>
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">
          <a href="producto.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="product-artisan">por ${product.artisan}</p>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn btn-primary btn-small" onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&#39;")})'>
            Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderRelatedProducts(containerId, category, excludeId) {
  const products = getRelatedProducts(category, excludeId);
  renderProducts(containerId, products);
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initNavigation();
  initCartSidebar();
  
  // Crear toast container si no existe
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Renderizar productos en la página principal
  renderProducts('featured-products');
  
  // Check for order success
  if (window.location.search.includes('order=success')) {
    showToast('¡Tu pedido ha sido confirmado! Te contactaremos pronto.', 'success');
  }
});

// ========== ANIMACIONES CSS ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 1; }
  }
`;
document.head.appendChild(style);
