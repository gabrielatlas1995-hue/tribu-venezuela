// ===== TRIBU — Datos Unificados =====

const PRODUCTOS = [
    {
        id: 'CER-001',
        artisanId: 'ART-001',
        name: 'Set de Tazas Espresso Artesanales',
        category: 'Cerámica',
        categorySlug: 'ceramica',
        price: 52.99,
        priceBs: 1890,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
            'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&q=80',
            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'
        ],
        description: 'Juego de 4 tazas de espresso hechas a mano con barro rojo de Guataparo. Cada pieza es única, con acabado rústico y esmalte natural. Perfectas para el café venezolano.',
        rating: 4.9,
        reviews: 156,
        badge: 'Más vendido'
    },
    {
        id: 'TEX-001',
        artisanId: 'ART-002',
        name: 'Mochila Wayúu Tradicional',
        category: 'Textiles',
        categorySlug: 'textiles',
        price: 68.50,
        priceBs: 2445,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
            'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80'
        ],
        description: 'Mochila tejida a mano por la Comunidad Wayúu con colores vibrantes. Cada mochila toma aproximadamente 20 días en ser tejida. Pieza única e irrepetible.',
        rating: 4.9,
        reviews: 89,
        badge: null
    },
    {
        id: 'JOY-001',
        artisanId: 'ART-003',
        name: 'Pulseras de Plata 925 Andinas',
        category: 'Joyería',
        categorySlug: 'joyeria',
        price: 32.00,
        priceBs: 1143,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ],
        description: 'Set de 3 pulseras de plata 925 con diseños inspirados en la cultura inca. Hechas a mano en los Andes merideños a 1,600 metros de altura.',
        rating: 5.0,
        reviews: 45,
        badge: 'Nuevo'
    },
    {
        id: 'TEX-002',
        artisanId: 'ART-002',
        name: 'Tapiz Andino Tejido a Mano',
        category: 'Textiles',
        categorySlug: 'textiles',
        price: 120.00,
        priceBs: 4284,
        image: 'https://images.unsplash.com/photo-1582650949472-e9e2bcabc75d?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1582650949472-e9e2bcabc75d?w=800&q=80',
            'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80'
        ],
        description: 'Tapiz de lana de alpaca con tintes naturales. Diseño tradicional que cuenta historias ancestrales de los pueblos andinos. Medidas: 80x120 cm.',
        rating: 4.7,
        reviews: 67,
        badge: null
    },
    {
        id: 'MAD-001',
        artisanId: 'ART-004',
        name: 'Bowl de Madera Amazónica',
        category: 'Madera',
        categorySlug: 'madera',
        price: 45.00,
        priceBs: 1606,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'
        ],
        description: 'Bowl tallado a mano en madera amazónica de tala sostenible con certificado de origen indígena. Acabado natural con aceite de coco.',
        rating: 4.8,
        reviews: 34,
        badge: null
    },
    {
        id: 'DEC-001',
        artisanId: 'ART-003',
        name: 'Lámpara de Fibra Natural',
        category: 'Decoración',
        categorySlug: 'decoracion',
        price: 85.00,
        priceBs: 3033,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&q=80',
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
        ],
        description: 'Lámpara colgante tejida con fibras de palma natural. Proyecta sombras hermosas. Incluye sistema eléctrico completo. Diámetro: 35 cm.',
        rating: 4.9,
        reviews: 56,
        badge: 'Destacado'
    },
    {
        id: 'CUE-001',
        artisanId: 'ART-001',
        name: 'Cartera de Cuero Artesanal',
        category: 'Cuero',
        categorySlug: 'cuero',
        price: 75.00,
        priceBs: 2677,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
            'https://images.unsplash.com/photo-1549106765-7974e0a9e5b8?w=800&q=80'
        ],
        description: 'Cartera de cuero genuino hecha a mano. Diseño elegante y funcional con espacio para tarjetas, billetes y monedas. Cuero curtido al vegetal.',
        rating: 4.6,
        reviews: 78,
        badge: null
    },
    {
        id: 'JOY-002',
        artisanId: 'ART-003',
        name: 'Aretes de Piedra Semipreciosa',
        category: 'Joyería',
        categorySlug: 'joyeria',
        price: 28.00,
        priceBs: 1000,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        description: 'Aretes de plata 925 con piedras semipreciosas naturales (ágata y cuarzo rosa). Diseño exclusivo inspirado en los paisajes andinos.',
        rating: 4.7,
        reviews: 92,
        badge: null
    }
];

const ARTESANOS = {
    'ART-001': {
        id: 'ART-001',
        name: 'María Elena Gutiérrez',
        brand: 'Manos de Barro',
        location: 'Valencia, Carabobo, Venezuela',
        specialty: 'Cerámica artesanal',
        bio: '15 años honrando la tradición familiar del barro rojo de Guataparo. Cada pieza es moldeada y pintada a mano con técnicas ancestrales.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        rating: 4.9,
        sales: 312,
        whatsapp: '+584122223775'
    },
    'ART-002': {
        id: 'ART-002',
        name: 'José Rafael Morales',
        brand: 'Tejidos del Llano',
        location: 'San Fernando de Apure, Venezuela',
        specialty: 'Hamacas y textiles',
        bio: 'Técnicas de tejido transmitidas por generaciones junto al río Portuguesa. Trabajo con fibras naturales y tintes orgánicos.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        rating: 4.8,
        sales: 234,
        whatsapp: '+584122223775'
    },
    'ART-003': {
        id: 'ART-003',
        name: 'Ana Lucía Pérez',
        brand: 'Orfebre Andina',
        location: 'Mérida, Venezuela',
        specialty: 'Joyería en plata',
        bio: 'Plata 925 y piedras semipreciosas trabajadas a 1,600 metros de altura en los Andes. Cada pieza combina tradición con diseño contemporáneo.',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
        rating: 5.0,
        sales: 189,
        whatsapp: '+584122223775'
    },
    'ART-004': {
        id: 'ART-004',
        name: 'Carlos Eduardo Mendoza',
        brand: 'Maderas del Sur',
        location: 'Santa Elena de Uairén, Bolívar, Venezuela',
        specialty: 'Talla en madera',
        bio: 'Maderas amazónicas de tala sostenible con certificado de origen indígena. Cada pieza respeta el ecosistema y la cultura local.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        rating: 4.7,
        sales: 145,
        whatsapp: '+584122223775'
    }
};

const CATEGORIAS = [
    { slug: 'ceramica', name: 'Cerámica', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80' },
    { slug: 'textiles', name: 'Textiles', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80' },
    { slug: 'joyeria', name: 'Joyería', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80' },
    { slug: 'madera', name: 'Madera', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80' },
    { slug: 'decoracion', name: 'Decoración', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&q=80' },
    { slug: 'cuero', name: 'Cuero', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80' }
];

// ===== Helper Functions =====
function getProductById(id) {
    return PRODUCTOS.find(p => p.id === id);
}

function getProductsByCategory(categorySlug) {
    return PRODUCTOS.filter(p => p.categorySlug === categorySlug);
}

function getProductsByArtisan(artisanId) {
    return PRODUCTOS.filter(p => p.artisanId === artisanId);
}

function getArtisanById(id) {
    return ARTESANOS[id] || null;
}

function getArtisanForProduct(product) {
    return ARTESANOS[product.artisanId] || null;
}

function getRelatedProducts(categorySlug, excludeId, limit = 4) {
    return PRODUCTOS
        .filter(p => p.categorySlug === categorySlug && p.id !== excludeId)
        .slice(0, limit);
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatPriceBs(priceBs) {
    return `Bs. ${priceBs.toLocaleString('es-VE')}`;
}
