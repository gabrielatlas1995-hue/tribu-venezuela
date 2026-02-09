// ===== TRIBU — App Principal =====

// ========== CARRITO ==========
const CART_KEY = 'tribu_cart';

function getCart() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    renderCartSidebar();
}

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceBs: product.priceBs,
            image: product.image,
            artisanId: product.artisanId,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`${product.name} agregado al carrito`, 'success');
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Producto eliminado', 'info');
}

function updateQuantity(productId, quantity) {
    if (quantity <= 0) { removeFromCart(productId); return; }
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) { item.quantity = quantity; saveCart(cart); }
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
    document.querySelectorAll('.cart-count').forEach(el => {
        const count = getCartCount();
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// ========== CART SIDEBAR ==========
function openCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('cart-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('cart-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (!sidebar) return;

    const cart = getCart();
    const total = getCartTotal();

    if (cart.length === 0) {
        sidebar.innerHTML = `
            <div class="cart-sidebar-header">
                <h3>Tu Carrito</h3>
                <button class="cart-close" onclick="closeCartSidebar()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="cart-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <p>Tu carrito está vacío</p>
                <a href="pages/productos.html" class="btn btn-primary" onclick="closeCartSidebar()">Explorar Productos</a>
            </div>`;
        return;
    }

    const artisanName = (item) => {
        const artisan = getArtisanById(item.artisanId);
        return artisan ? artisan.name : '';
    };

    sidebar.innerHTML = `
        <div class="cart-sidebar-header">
            <h3>Tu Carrito (${getCartCount()})</h3>
            <button class="cart-close" onclick="closeCartSidebar()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-artisan">${artisanName(item)}</p>
                        <div class="cart-item-controls">
                            <div class="quantity-selector">
                                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="cart-total-amount">${formatPrice(total)}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-full" onclick="closeCartSidebar()">Proceder al Pago</a>
            <button class="btn btn-outline btn-full" onclick="closeCartSidebar()">Seguir Comprando</button>
        </div>`;
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========== GALLERY ==========
function initGallery(images) {
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
                        <img src="${img}" alt="Miniatura ${idx + 1}" loading="lazy">
                    </button>
                `).join('')}
            </div>
        ` : ''}`;

    window._galleryImages = images;
    window._galleryIndex = 0;
}

function setGalleryImage(index) {
    if (!window._galleryImages) return;
    window._galleryIndex = index;

    const mainImage = document.getElementById('gallery-main-image');
    const thumbs = document.querySelectorAll('.gallery-thumb');

    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = window._galleryImages[index];
            mainImage.style.opacity = '1';
        }, 150);
    }

    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
}

function changeImage(direction) {
    if (!window._galleryImages) return;
    const len = window._galleryImages.length;
    const newIndex = (window._galleryIndex + direction + len) % len;
    setGalleryImage(newIndex);
}

// ========== SHARE ==========
function shareProduct(productId, platform) {
    const product = getProductById(productId);
    if (!product) return;

    const url = window.location.href;
    const text = `Mira este producto: ${product.name} - ${formatPrice(product.price)}`;

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
            }).catch(() => showToast('Error al copiar', 'error'));
            break;
    }
}

function initShareButtons(productId) {
    const container = document.getElementById('share-buttons');
    if (!container) return;

    container.innerHTML = `
        <button class="share-btn whatsapp" onclick="shareProduct('${productId}', 'whatsapp')" title="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
        <button class="share-btn facebook" onclick="shareProduct('${productId}', 'facebook')" title="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button class="share-btn twitter" onclick="shareProduct('${productId}', 'twitter')" title="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        </button>
        <button class="share-btn copy" onclick="shareProduct('${productId}', 'copy')" title="Copiar link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>`;
}

// ========== CHECKOUT ==========
function showCheckoutLoader(message = 'Procesando tu pedido...') {
    let loader = document.getElementById('checkout-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'checkout-loader';
        loader.className = 'checkout-loader';
        loader.innerHTML = `<div class="loader-content"><div class="loader-spinner"></div><p class="loader-message">${message}</p></div>`;
        document.body.appendChild(loader);
    }
    loader.querySelector('.loader-message').textContent = message;
    loader.classList.add('show');
}

function hideCheckoutLoader() {
    const loader = document.getElementById('checkout-loader');
    if (loader) loader.classList.remove('show');
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

// ========== RENDER FUNCTIONS ==========
function renderProductCard(product, basePath = '') {
    const artisan = getArtisanForProduct(product);
    const artisanName = artisan ? artisan.name : '';

    return `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge${product.badge === 'Nuevo' ? ' new' : ''}">${product.badge}</span>` : ''}
            <a href="${basePath}producto.html?id=${product.id}" class="product-image-link">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
            </a>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">
                    <a href="${basePath}producto.html?id=${product.id}">${product.name}</a>
                </h3>
                <p class="product-artisan">por ${artisanName}</p>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '½' : ''}
                    <span class="count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-prices">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <span class="product-price-bs">${formatPriceBs(product.priceBs)}</span>
                    </div>
                    <button class="btn btn-primary btn-add" onclick="addToCart('${product.id}')">Agregar</button>
                </div>
            </div>
        </div>`;
}

function renderProducts(containerId, products = PRODUCTOS, basePath = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = products.map(p => renderProductCard(p, basePath)).join('');
}

// ========== NAVIGATION ==========
function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            toggle.setAttribute('aria-expanded', isOpen);
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header')) {
                nav.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }
    });
}

// ========== FAQ ==========
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initNavigation();
    renderCartSidebar();
    initFAQ();

    // Render featured products on homepage
    renderProducts('featured-products');

    // Render all products on products page
    renderProducts('all-products');

    // Order success toast
    if (window.location.search.includes('order=success')) {
        showToast('¡Tu pedido ha sido confirmado! Te contactaremos pronto.', 'success');
    }
});
