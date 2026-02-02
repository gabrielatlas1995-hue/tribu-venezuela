#!/bin/bash

# Script de configuración para el skill de mercados
# Configura los cron jobs para ejecutar el reporte automáticamente

echo "📊 Configurando Skill de Reportes de Mercados..."
echo ""

# Verificar que el archivo existe
SKILL_PATH="/Users/gabrielatlas/clawd/skills/mercados/index.js"
if [ ! -f "$SKILL_PATH" ]; then
    echo "❌ Error: No se encuentra el archivo $SKILL_PATH"
    exit 1
fi

echo "✅ Skill encontrado en: $SKILL_PATH"
echo ""

# Mostrar cron jobs actuales
echo "📅 Cron jobs actuales:"
crontab -l 2>/dev/null || echo "(No hay cron jobs configurados)"
echo ""

# Preguntar si configurar cron jobs
read -p "¿Configurar cron jobs para ejecutar a las 8:30 AM y 4:35 PM de lunes a viernes? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Crear archivo temporal con los nuevos cron jobs
    TEMP_CRON=$(mktemp)
    
    # Guardar cron jobs existentes
    crontab -l > "$TEMP_CRON" 2>/dev/null || touch "$TEMP_CRON"
    
    # Agregar nuevos cron jobs
    echo "" >> "$TEMP_CRON"
    echo "# Reportes de Mercados - Skill de Clawdbot" >> "$TEMP_CRON"
    echo "30 8 * * 1-5 cd /Users/gabrielatlas/clawd && node skills/mercados/index.js" >> "$TEMP_CRON"
    echo "35 16 * * 1-5 cd /Users/gabrielatlas/clawd && node skills/mercados/index.js" >> "$TEMP_CRON"
    
    # Instalar nuevo cron tab
    crontab "$TEMP_CRON"
    rm "$TEMP_CRON"
    
    echo "✅ Cron jobs configurados exitosamente!"
    echo ""
    echo "📋 Nuevo cron schedule:"
    echo "   - 8:30 AM: Lunes a viernes"
    echo "   - 4:35 PM: Lunes a viernes"
    echo ""
else
    echo "⏭️  Configuración de cron jobs omitida."
    echo ""
fi

# Probar ejecución manual
echo "🧪 Probando ejecución manual..."
cd /Users/gabrielatlas/clawd && timeout 30 node skills/mercados/index.js

if [ $? -eq 0 ]; then
    echo "✅ Prueba ejecutada exitosamente!"
else
    echo "⚠️  La prueba tuvo problemas. Verifica la configuración."
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📖 Uso:"
echo "   - Ejecución manual: cd /Users/gabrielatlas/clawd && node skills/mercados/index.js"
echo "   - Ver logs: tail -f /var/log/cron.log (si está disponible)"
echo "   - Ver crontab: crontab -l"
echo ""
echo "📚 Documentación: /Users/gabrielatlas/clawd/skills/mercados/SKILL.md"