// Datos de productos
const PRODUCTOS = [
    {
        id: 'CER-001',
        nombre: 'Set de tazas espresso artesanales',
        categoria: 'ceramica',
        precio: 52.99,
        precioBs: 1890,
        imagen: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
        artisan: 'María Elena Gutiérrez',
        artisanId: 'vend-001',
        rating: 4.9,
        reviews: 123,
        badge: 'Más vendido'
    },
    {
        id: 'TEX-001',
        nombre: 'Mochila wayúu tradicional',
        categoria: 'textiles',
        precio: 68.50,
        precioBs: 2445,
        imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1549106765-7974e0a9e5b8?w=400',
        artisan: 'José Rafael Morales',
        artisanId: 'vend-002',
        rating: 4.8,
        reviews: 89,
        badge: null
    },
    {
        id: 'JOY-001',
        nombre: 'Pulseras de plata 925 andinas',
        categoria: 'joyeria',
        precio: 32.00,
        precioBs: 1143,
        imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        artisan: 'Ana Lucía Pérez',
        artisanId: 'vend-003',
        rating: 5.0,
        reviews: 45,
        badge: 'Nuevo'
    },
    {
        id: 'CER-002',
        nombre: 'Tapiz andino tejido a mano',
        categoria: 'textiles',
        precio: 120.00,
        precioBs: 4284,
        imagen: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        artisan: 'José Rafael Morales',
        artisanId: 'vend-002',
        rating: 4.7,
        reviews: 67,
        badge: null
    },
    {
        id: 'MAD-001',
        nombre: 'Bowl de madera amazónica',
        categoria: 'madera',
        precio: 45.00,
        precioBs: 1606,
        imagen: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
        artisan: 'Carlos Eduardo Mendoza',
        artisanId: 'vend-004',
        rating: 4.8,
        reviews: 34,
        badge: null
    },
    {
        id: 'DEC-001',
        nombre: 'Lámpara de fibra natural',
        categoria: 'decoracion',
        precio: 85.00,
        precioBs: 3033,
        imagen: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        artisan: 'Ana Lucía Pérez',
        artisanId: 'vend-003',
        rating: 4.9,
        reviews: 56,
        badge: 'Destacado'
    },
    {
        id: 'CUE-001',
        nombre: 'Cartera de cuero artesanal',
        categoria: 'cuero',
        precio: 75.00,
        precioBs: 2677,
        imagen: 'https://images.unsplash.com/photo-1549106765-7974e0a9e5b8?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        artisan: 'María Elena Gutiérrez',
        artisanId: 'vend-001',
        rating: 4.6,
        reviews: 78,
        badge: null
    },
    {
        id: 'JOY-002',
        nombre: 'Aretes de piedra semipreciosa',
        categoria: 'joyeria',
        precio: 28.00,
        precioBs: 1000,
        imagen: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        imagenHover: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        artisan: 'Ana Lucía Pérez',
        artisanId: 'vend-003',
        rating: 4.7,
        reviews: 92,
        badge: null
    }
];

// Datos de artesanos
const ARTESANOS = {
    'vend-001': {
        nombre: 'María Elena Gutiérrez',
        marca: 'Manos de Barro',
        ubicacion: 'Valencia, Carabobo',
        especialidad: 'Cerámica artesanal',
        historia: '15 años honrando la tradición familiar del barro rojo de Guataparo.',
        foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        whatsapp: '+584121234567',
        productos: 12,
        rating: 4.9
    },
    'vend-002': {
        nombre: 'José Rafael Morales',
        marca: 'Tejidos del Llano',
        ubicacion: 'San Fernando de Apure',
        especialidad: 'Hamacas y textiles',
        historia: 'Técnicas de tejido transmitidas por generaciones junto al río Portuguesa.',
        foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        whatsapp: '+584122345678',
        productos: 8,
        rating: 4.8
    },
    'vend-003': {
        nombre: 'Ana Lucía Pérez',
        marca: 'Orfebre Andina',
        ubicacion: 'Mérida, Mérida',
        especialidad: 'Joyería en plata',
        historia: 'Plata 925 y piedras semipreciosas a 1,600 metros de altura en los Andes.',
        foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        whatsapp: '+584123456789',
        productos: 15,
        rating: 5.0
    },
    'vend-004': {
        nombre: 'Carlos Eduardo Mendoza',
        marca: 'Maderas del Sur',
        ubicacion: 'Santa Elena de Uairén, Bolívar',
        especialidad: 'Talla en madera',
        historia: 'Maderas amazónicas de tala sostenible con certificado de origen indígena.',
        foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        whatsapp: '+584124567890',
        productos: 6,
        rating: 4.7
    }
};
