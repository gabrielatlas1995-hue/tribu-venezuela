#!/usr/bin/env node

/**
 * Script de prueba para el skill de reportes de mercados
 * Prueba las funciones principales sin enviar mensajes reales
 */

const path = require('path');
const mercados = require('./index.js');

console.log('🧪 Iniciando pruebas del skill de mercados...\n');

// Test 1: Verificar estructura del módulo
console.log('1️⃣ Verificando estructura del módulo:');
console.log('   - generarReporteMercados:', typeof mercados.generarReporteMercados === 'function' ? '✅' : '❌');
console.log('   - ejecutar:', typeof mercados.ejecutar === 'function' ? '✅' : '❌');
console.log('   - esHoraEjecucion:', typeof mercados.esHoraEjecucion === 'function' ? '✅' : '❌');

// Test 2: Verificar hora de ejecución
console.log('\n2️⃣ Verificando hora de ejecución:');
const horaActual = new Date().toTimeString().substring(0, 5);
const esHoraValida = mercados.esHoraEjecucion();
console.log(`   - Hora actual: ${horaActual}`);
console.log(`   - ¿Es hora de ejecución?: ${esHoraValida ? '✅ Sí' : '❌ No'}`);
console.log(`   - Horarios permitidos: 08:30, 16:35`);

// Test 3: Simular generación de reporte (sin enviar)
console.log('\n3️⃣ Probando generación de reporte:');
console.log('   🔄 Generando reporte de prueba...');

// Mock de funciones de búsqueda para prueba
const mockWebSearch = async (query) => {
    console.log(`   🔍 Búsqueda simulada: ${query}`);
    
    // Datos simulados para diferentes búsquedas
    if (query.includes('S&P 500')) {
        return {
            results: [
                { snippet: 'Futuros S&P 500 suben +0.3% en premercado, mostrando optimismo inversor' }
            ]
        };
    } else if (query.includes('Nasdaq')) {
        return {
            results: [
                { snippet: 'Futuros Nasdaq 100 ganan +0.5% impulsados por tecnología' }
            ]
        };
    } else if (query.includes('Dow Jones')) {
        return {
            results: [
                { snippet: 'Futuros Dow Jones avanzan +0.2% con buenos datos económicos' }
            ]
        };
    } else if (query.includes('movers')) {
        return {
            results: [
                { snippet: 'AAPL sube +2.1% tras presentar nuevos productos. TSLA gana +1.8%' }
            ]
        };
    } else if (query.includes('eventos economicos')) {
        return {
            results: [
                { snippet: '10:30 - Publicación de ventas minoristas. 14:00 - Discurso de Powell' }
            ]
        };
    }
    
    return { results: [{ snippet: 'Datos no disponibles' }] };
};

// Mock de función de mensaje
const mockMessage = async (options) => {
    console.log(`   📤 Mensaje simulado (no enviado):`);
    console.log(`   ${options.message.replace(/\n/g, '\n   ')}`);
    return { success: true };
};

// Reemplazar funciones reales con mocks para prueba
const originalRequire = require;
require = function(modulePath) {
    if (modulePath === '../../index') {
        return {
            web_search: mockWebSearch,
            message: mockMessage
        };
    }
    return originalRequire(modulePath);
};

// Ejecutar prueba de generación
(async () => {
    try {
        // Recargar el módulo con mocks
        delete require.cache[require.resolve('./index.js')];
        const mercadosMocked = require('./index.js');
        
        const reporte = await mercadosMocked.generarReporteMercados();
        console.log('\n✅ Reporte generado exitosamente!');
        
    } catch (error) {
        console.log(`\n❌ Error en prueba: ${error.message}`);
        console.log('   Stack:', error.stack);
    }
    
    // Test 4: Verificar cron jobs
    console.log('\n4️⃣ Verificando configuración de cron:');
    try {
        const { execSync } = require('child_process');
        const cronJobs = execSync('crontab -l 2>/dev/null || echo "No hay cron jobs"', { encoding: 'utf8' });
        
        if (cronJobs.includes('mercados/index.js')) {
            console.log('   ✅ Cron jobs de mercados configurados');
            console.log('   📋 Jobs encontrados:');
            cronJobs.split('\n').forEach(line => {
                if (line.includes('mercados')) {
                    console.log(`      ${line.trim()}`);
                }
            });
        } else {
            console.log('   ⚠️  No se encontraron cron jobs de mercados');
            console.log('   💡 Ejecuta: ./setup.sh para configurar');
        }
    } catch (error) {
        console.log(`   ❌ Error verificando cron: ${error.message}`);
    }
    
    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📚 Próximos pasos:');
    console.log('   1. Ejecutar ./setup.sh para configurar cron jobs');
    console.log('   2. Verificar logs de ejecución automática');
    console.log('   3. Ajustar formatos o contenido según necesidad');
})();