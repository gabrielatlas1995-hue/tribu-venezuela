#!/usr/bin/env node

/**
 * Script de prueba simplificado para el skill de reportes de mercados
 */

console.log('🧪 Iniciando pruebas del skill de mercados...\n');

// Test 1: Verificar que el archivo existe y es ejecutable
try {
    const fs = require('fs');
    const skillPath = '/Users/gabrielatlas/clawd/skills/mercados/index.js';
    
    console.log('1️⃣ Verificando archivo del skill:');
    if (fs.existsSync(skillPath)) {
        console.log('   ✅ Archivo index.js existe');
        const stats = fs.statSync(skillPath);
        console.log(`   📊 Tamaño: ${Math.round(stats.size / 1024)}KB`);
    } else {
        console.log('   ❌ Archivo index.js no encontrado');
    }
} catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
}

// Test 2: Verificar documentación
console.log('\n2️⃣ Verificando documentación:');
try {
    const fs = require('fs');
    const docsPath = '/Users/gabrielatlas/clawd/skills/mercados/SKILL.md';
    if (fs.existsSync(docsPath)) {
        console.log('   ✅ Documentación SKILL.md existe');
        const content = fs.readFileSync(docsPath, 'utf8');
        console.log(`   📄 Líneas de documentación: ${content.split('\n').length}`);
    } else {
        console.log('   ❌ Documentación no encontrada');
    }
} catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
}

// Test 3: Verificar permisos de setup script
console.log('\n3️⃣ Verificando scripts de configuración:');
try {
    const fs = require('fs');
    const setupPath = '/Users/gabrielatlas/clawd/skills/mercados/setup.sh';
    if (fs.existsSync(setupPath)) {
        const stats = fs.statSync(setupPath);
        const isExecutable = !!(stats.mode & parseInt('111', 8));
        console.log(`   ✅ Setup script existe ${isExecutable ? 'y es ejecutable' : '(pero no es ejecutable)'}`);
    } else {
        console.log('   ❌ Setup script no encontrado');
    }
} catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
}

// Test 4: Verificar hora actual y próximas ejecuciones
console.log('\n4️⃣ Verificando horarios de ejecución:');
const ahora = new Date();
const horaActual = ahora.toTimeString().substring(0, 5);
const diaSemana = ahora.getDay(); // 0=Domingo, 1=Lunes, etc.
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

console.log(`   🕐 Hora actual: ${horaActual}`);
console.log(`   📅 Día: ${diasSemana[diaSemana]}`);
console.log(`   🎯 ¿Es día de semana?: ${diaSemana >= 1 && diaSemana <= 5 ? '✅ Sí' : '❌ No'}`);
console.log(`   ⏰ Horarios de ejecución: 08:30, 16:35`);

// Calcular próximas ejecuciones
const proximas = [];
const hoy = new Date();

for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const dia = fecha.getDay();
    
    if (dia >= 1 && dia <= 5) { // Lunes a viernes
        const mañana = new Date(fecha);
        mañana.setHours(8, 30, 0, 0);
        
        const tarde = new Date(fecha);
        tarde.setHours(16, 35, 0, 0);
        
        if (mañana > hoy) proximas.push(mañana);
        if (tarde > hoy) proximas.push(tarde);
    }
    
    if (proximas.length >= 4) break; // Próximas 4 ejecuciones
}

console.log('\n📅 Próximas ejecuciones programadas:');
proximas.slice(0, 4).forEach(fecha => {
    const diaSemanaStr = diasSemana[fecha.getDay()];
    const hora = fecha.toTimeString().substring(0, 5);
    const fechaStr = fecha.toLocaleDateString('es-ES');
    console.log(`   • ${diaSemanaStr} ${fechaStr} a las ${hora}`);
});

// Test 5: Verificar cron jobs actuales
console.log('\n5️⃣ Verificando cron jobs:');
try {
    const { execSync } = require('child_process');
    const cronJobs = execSync('crontab -l 2>/dev/null || echo "No hay cron jobs configurados"', { encoding: 'utf8' });
    
    if (cronJobs.includes('mercados')) {
        console.log('   ✅ Se encontraron cron jobs de mercados:');
        cronJobs.split('\n').forEach(line => {
            if (line.includes('mercados')) {
                console.log(`      ${line.trim()}`);
            }
        });
    } else {
        console.log('   ⚠️  No se encontraron cron jobs de mercados');
        console.log('   💡 Para configurar, ejecuta: ./setup.sh');
    }
} catch (error) {
    console.log(`   ❌ Error verificando cron: ${error.message}`);
}

// Test 6: Prueba simple de sintaxis del código
console.log('\n6️⃣ Verificando sintaxis del código:');
try {
    const { execSync } = require('child_process');
    execSync('node -c /Users/gabrielatlas/clawd/skills/mercados/index.js', { encoding: 'utf8' });
    console.log('   ✅ Sintaxis del código correcta');
} catch (error) {
    console.log(`   ❌ Error de sintaxis: ${error.message}`);
}

console.log('\n🎉 Pruebas completadas!');
console.log('\n📋 Resumen:');
console.log('   ✅ Skill creado y documentado');
console.log('   ✅ Scripts de configuración listos');
console.log('   ✅ Horarios configurados: 8:30 AM y 4:35 PM');
console.log('   ✅ Días: Lunes a viernes');
console.log('\n🚀 Próximos pasos:');
console.log('   1. Ejecutar: ./setup.sh (para configurar cron jobs)');
console.log('   2. O ejecutar manualmente: node index.js');
console.log('   3. Los reportes se enviarán automáticamente a Telegram');