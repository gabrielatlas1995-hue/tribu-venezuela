# Proyecto Tribu - Etsy Latinoamérica

## 📋 Resumen
**Qué es:** Marketplace tipo Etsy para artesanos latinoamericanos, empezando en Venezuela  
**Estado:** Reorganización completada (2026-02-01), listo para implementación  
**Ubicación:** `/Users/gabrielatlas/Projects/Development/Active/Tribu`

---

## 💰 Métricas Financieras Clave

### Proyección 2026
| Métrica | Valor |
|---------|-------|
| Ingresos anuales | $1,401,778 USD |
| Margen bruto | 86.55% |
| Ticket promedio | $52.99 USD |
| Comisión Tribu | 5% |
| Crecimiento mensual | +20% |

### Distribución por Categoría
- Cerámica: 35.2% ($12,450/mes)
- Textiles: 25.2% ($8,920/mes)
- Joyería: 21.7% ($7,680/mes)
- Madera: 12.0% ($4,230/mes)
- Cuero: 6.0% ($2,120/mes)

### Métodos de Pago (Venezuela)
- Pago Móvil: 63.3%
- Transferencias: 23.4%
- Zelle: 10.0%
- Tarjetas: 3.3%

---

## 🏗️ Arquitectura Técnica

### Stack Actual
- HTML5 + CSS3 (Vanilla)
- JavaScript ES6+ (sin framework)
- localStorage para persistencia
- Netlify hosting
- MercadoPago (sandbox/testing)

### Reorganización Completada (2026-02-01)
**Problemas resueltos:**
- ❌ 4 versiones de products-data.js → ✅ 1 products.json
- ❌ 3 sistemas de limpieza nuclear → ✅ 1 utilidad simple
- ❌ 6,316+ líneas de código → ✅ ~500 líneas (-92%)
- ❌ 249KB de archivos → ✅ ~18KB (-93%)

**Nueva estructura:**
```
organizado/
├── components/      # HTML reutilizable
├── data/           # products.json, config.js
├── utils/          # storage.js, validation.js, formatters.js
├── styles/         # CSS modular (variables, base, components)
├── scripts/        # JS modular (app, cart, products, ui)
├── assets/         # imágenes, fuentes, íconos
└── backup/         # archivos originales
```

### Próxima Modernización
1. **Implementar Vite** para build process
2. **Agregar TypeScript** para type safety
3. **Crear tests** con Jest/Vitest
4. **Optimizar imágenes** y assets

---

## 💳 Flujo de Pago (MercadoPago Venezuela)

### Estados de Orden
1. `payment_pending` - Esperando pago
2. `payment_confirmed` - Pago recibido
3. `artisan_notified` - Artesano notificado (WhatsApp)
4. `preparing` - En preparación
5. `shipped` - Enviado
6. `delivered` - Entregado
7. `completed` - Completado
8. `cancelled` - Cancelado

### Notificaciones WhatsApp
- ✅ Confirmación inmediata al cliente
- 🎉 Notificación al artesano con detalles de venta
- 📦 Updates de tracking
- ⭐ Solicitud de review (7 días post-entrega)

---

## 🎯 Características Implementadas

### Core
- [x] Catálogo de productos
- [x] Carrito de compras con localStorage
- [x] Checkout multi-pago (PayPal, MP, Zelle, WhatsApp)
- [x] Sistema de reviews (1-5 estrellas)
- [x] Diseño mobile-first responsive

### En Desarrollo / Pendiente
- [ ] Panel de administración para artesanos
- [ ] Sistema de búsqueda avanzada
- [ ] Filtros por precio/categoría
- [ ] Programa de fidelización
- [ ] Suscripciones mensuales

---

## 🌎 Expansión Geográfica

### Ventas Actuales
- México: 35%
- Bolivia: 22%
- Perú: 18%
- Colombia: 15%
- Otros: 10%

### Top Artesanos
1. Carlos M. (Oaxaca) - $8,920/mes
2. Ana R. (Bolivia) - $6,450/mes
3. José P. (Perú) - $5,230/mes

---

## 📊 KPIs Importantes
- Tasa de conversión: 3.2%
- Tasa de retención: 31%
- Rating promedio: 4.8/5.0
- NPS: 78 (excelente)
- CLV/CAC: 10.2:1

---

## 🔗 Archivos Clave
- `/organizado/data/products.json` - Base de datos unificada
- `/organizado/utils/storage.js` - Gestión localStorage
- `/organizado/styles/variables.css` - Variables CSS
- `/REPORTE-FINANCIERO-2026.md` - Proyecciones completas
- `/FLUJO-POST-PAGO-PLAN.md` - Flujo de pagos detallado
- `/REORGANIZACION-COMPLETA.md` - Documentación de refactor

---

**Última actualización:** 2026-02-02
