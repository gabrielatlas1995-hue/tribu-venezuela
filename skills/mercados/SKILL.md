# Skill: Reportes de Mercados

## Descripción
Genera reportes automáticos de mercados financieros dos veces al día (8:30 AM y 4:35 PM) de lunes a viernes, con información de futuros, principales movers y eventos macroeconómicos.

## Características
- **Horarios**: 8:30 AM y 4:35 PM, lunes a viernes
- **Fuentes**: Brave Search API para datos en tiempo real
- **Formato**: Mensaje conciso y estructurado para Telegram

## Formato del Reporte
```
📊 MERCADOS - [Día] [Fecha]
FUTUROS PREMERCADO S&P [%] | Nasdaq [%] | Dow [%]
📈 HOY AM/PM [Ticker] [%] - [Noticia]
🎯 HOY POST-CIERRE [Empresas]
MACRO • [Hora] - [Evento]
```

## Instalación

1. El skill se encuentra en `/Users/gabrielatlas/clawd/skills/mercados/`
2. No requiere dependencias adicionales (usa herramientas nativas de Clawdbot)

## Uso

### Ejecución Manual
```bash
# Versión nueva (formato profesional)
node /Users/gabrielatlas/clawd/skills/mercados/reporte-v2.js

# Versión legacy
node /Users/gabrielatlas/clawd/skills/mercados/index.js
```

### Scripts Automáticos
```bash
# Reporte AM (8:30 AM ET)
/Users/gabrielatlas/clawd/scripts/financial-morning-report.sh

# Reporte PM (4:35 PM ET)
/Users/gabrielatlas/clawd/scripts/financial-afternoon-report.sh
```

## Configuración de Cron

Para ejecutar automáticamente a las 8:30 AM y 4:35 PM de lunes a viernes:

```bash
# Agregar a crontab
30 8 * * 1-5 cd /Users/gabrielatlas/clawd && node skills/mercados/index.js
35 16 * * 1-5 cd /Users/gabrielatlas/clawd && node skills/mercados/index.js
```

## Componentes del Reporte

### 1. Futuros Premercado
- S&P 500
- Nasdaq 100
- Dow Jones

### 2. Principales Movers
- Top ganadores y perdedores del día
- Incluye ticker y variación porcentual
- Breve noticia relacionada

### 3. Eventos Macro
- Eventos económicos del día
- Horarios de publicaciones importantes
- Indicadores clave (PIB, IPC, PMI, etc.)

## Manejo de Errores
- Si falla la búsqueda, usa valores por defecto (+0.0%)
- Limita la cantidad de movers y eventos para mantener el mensaje conciso
- Registra errores en consola para debugging

## Dependencias
- Brave Search API (a través de web_search tool)
- Message tool para enviar a Telegram
- No requiere paquetes npm externos

## Personalización
Puedes modificar:
- `HORARIOS`: Array con horas de ejecución
- `DIAS_SEMANA`: Días de la semana permitidos
- `FUTUROS`: Símbolos a rastrear
- Límites en funciones extractoras

## Notas
- El skill detecta automáticamente AM/PM según la hora de ejecución
- Usa búsquedas en español para mejores resultados
- Formato optimizado para visualización en móviles