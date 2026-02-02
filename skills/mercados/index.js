#!/usr/bin/env node

/**
 * Skill: Reportes de Mercados
 * Descripción: Genera reportes automáticos de mercados financieros
 * Horarios: 8:30 AM y 4:35 PM, lunes a viernes
 * Formato: 📊 MERCADOS - [Día] [Fecha] FUTUROS PREMERCADO S&P [%] | Nasdaq [%] | Dow [%] 📈 HOY AM/PM [Ticker] [%] - [Noticia] 🎯 HOY POST-CIERRE [Empresas] MACRO • [Hora] - [Evento]
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuración
const HORARIOS = ['08:30', '16:35'];
const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

// Símbolos de futuros principales
const FUTUROS = {
    'SPX': 'S&P 500',
    'NDX': 'Nasdaq 100', 
    'DJI': 'Dow Jones'
};

// Función principal para generar el reporte
async function generarReporteMercados() {
    try {
        console.log('🔄 Generando reporte de mercados...');
        
        const fecha = new Date();
        const diaSemana = DIAS_SEMANA[fecha.getDay() - 1];
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Obtener datos de futuros
        const datosFuturos = await obtenerDatosFuturos();
        
        // Obtener principales movers
        const movers = await obtenerPrincipalesMovers();
        
        // Obtener eventos macro del día
        const eventosMacro = await obtenerEventosMacro();
        
        // Construir el reporte
        const reporte = construirReporte(diaSemana, fechaFormateada, datosFuturos, movers, eventosMacro);
        
        // Enviar el reporte
        await enviarReporte(reporte);
        
        console.log('✅ Reporte de mercados generado y enviado');
        return reporte;
        
    } catch (error) {
        console.error('❌ Error generando reporte:', error);
        throw error;
    }
}

// Función para obtener datos de futuros usando Brave Search
async function obtenerDatosFuturos() {
    const resultados = {};
    
    try {
        // Buscar datos de futuros S&P 500
        const searchSPX = await buscarConBrave('futuros S&P 500 premercado hoy cotizacion');
        resultados.SPX = extraerVariacion(searchSPX);
        
        // Buscar datos de futuros Nasdaq
        const searchNDX = await buscarConBrave('futuros Nasdaq 100 premercado hoy cotizacion');
        resultados.NDX = extraerVariacion(searchNDX);
        
        // Buscar datos de futuros Dow Jones
        const searchDJI = await buscarConBrave('futuros Dow Jones premercado hoy cotizacion');
        resultados.DJI = extraerVariacion(searchDJI);
        
    } catch (error) {
        console.error('Error obteniendo datos de futuros:', error);
        // Valores por defecto si hay error
        resultados.SPX = '+0.0%';
        resultados.NDX = '+0.0%';
        resultados.DJI = '+0.0%';
    }
    
    return resultados;
}

// Función para obtener principales movers
async function obtenerPrincipalesMovers() {
    try {
        const searchMovers = await buscarConBrave('principales ganadores y perdedores bolsa hoy movers');
        return extraerPrincipalesMovers(searchMovers);
    } catch (error) {
        console.error('Error obteniendo movers:', error);
        return [];
    }
}

// Función para obtener eventos macroeconómicos
async function obtenerEventosMacro() {
    try {
        const searchEventos = await buscarConBrave('eventos economicos hoy calendario macroeconomico');
        return extraerEventosMacro(searchEventos);
    } catch (error) {
        console.error('Error obteniendo eventos macro:', error);
        return [];
    }
}

// Función para buscar con Brave Search API
async function buscarConBrave(query) {
    try {
        // Usar la herramienta web_search disponible en Clawdbot
        const result = await require('../../index').web_search({
            query: query,
            count: 5,
            freshness: 'pd' // Past day - últimas 24 horas
        });
        
        return result;
    } catch (error) {
        console.error('Error en búsqueda Brave:', error);
        throw error;
    }
}

// Función para extraer variación porcentual del texto
function extraerVariacion(searchResults) {
    if (!searchResults || !searchResults.results) return '+0.0%';
    
    const text = searchResults.results.map(r => r.snippet).join(' ');
    
    // Buscar patrones como +1.2%, -0.5%, etc.
    const match = text.match(/[+-]\d+\.?\d*%/);
    if (match) {
        return match[0];
    }
    
    return '+0.0%';
}

// Función para extraer principales movers
function extraerPrincipalesMovers(searchResults) {
    if (!searchResults || !searchResults.results) return [];
    
    const movers = [];
    const text = searchResults.results.map(r => r.snippet).join(' ');
    
    // Patrones simples para detectar movers (esto puede mejorarse)
    const lines = text.split(/[.\n]/);
    
    for (const line of lines) {
        // Buscar líneas que mencionen acciones con variaciones
        const match = line.match(/([A-Z]{1,5})\s*.*?(\+\d+\.?\d*%|-\d+\.?\d*%)/);
        if (match && movers.length < 3) {
            movers.push({
                ticker: match[1],
                variacion: match[2],
                noticia: line.trim().substring(0, 100)
            });
        }
    }
    
    return movers;
}

// Función para extraer eventos macro
function extraerEventosMacro(searchResults) {
    if (!searchResults || !searchResults.results) return [];
    
    const eventos = [];
    const text = searchResults.results.map(r => r.snippet).join(' ');
    
    // Buscar menciones de horas y eventos económicos
    const lines = text.split(/[.\n]/);
    
    for (const line of lines) {
        // Buscar patrones de tiempo y eventos
        const match = line.match(/(\d{1,2}:\d{2}).*?(PIB|IPC|PMI|NFP|Fed|BCE|tipos de interés|desempleo|ventas minoristas)/i);
        if (match && eventos.length < 3) {
            eventos.push({
                hora: match[1],
                evento: match[2],
                descripcion: line.trim().substring(0, 80)
            });
        }
    }
    
    return eventos;
}

// Función para construir el reporte final
function construirReporte(diaSemana, fecha, futuros, movers, eventos) {
    const hora = new Date().getHours();
    const periodo = hora < 12 ? 'AM' : 'PM';
    
    let reporte = `📊 MERCADOS - ${diaSemana.toUpperCase()} ${fecha}\n`;
    reporte += `FUTUROS PREMERCADO S&P ${futuros.SPX || '+0.0%'} | Nasdaq ${futuros.NDX || '+0.0%'} | Dow ${futuros.DJI || '+0.0%'}\n`;
    
    // Sección de movers
    if (movers.length > 0) {
        reporte += `📈 HOY ${periodo} `;
        movers.forEach((mover, index) => {
            if (index < 2) { // Limitar a 2 movers
                reporte += `${mover.ticker} ${mover.variacion} - ${mover.noticia} `;
            }
        });
        reporte += '\n';
    }
    
    // Sección de eventos post-cierre
    reporte += `🎯 HOY POST-CIERRE `;
    if (movers.length > 0) {
        const empresas = movers.map(m => m.ticker).slice(0, 3).join(', ');
        reporte += `${empresas} `;
    }
    
    // Sección de eventos macro
    if (eventos.length > 0) {
        reporte += '\nMACRO • ';
        eventos.forEach((evento, index) => {
            if (index < 2) { // Limitar a 2 eventos
                reporte += `${evento.hora} - ${evento.evento} `;
            }
        });
    }
    
    return reporte.trim();
}

// Función para enviar el reporte
async function enviarReporte(reporte) {
    try {
        // Usar la herramienta message disponible en Clawdbot
        await require('../../index').message({
            action: 'send',
            message: reporte,
            channel: 'telegram' // Canal por defecto
        });
        
        console.log('Reporte enviado exitosamente');
    } catch (error) {
        console.error('Error enviando reporte:', error);
        throw error;
    }
}

// Función para verificar si es hora de ejecutar
function esHoraEjecucion() {
    const ahora = new Date();
    const horaActual = ahora.toTimeString().substring(0, 5); // HH:MM format
    const diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Verificar si es día de semana (1-5 = lunes a viernes)
    if (diaActual < 1 || diaActual > 5) {
        return false;
    }
    
    // Verificar si es una de las horas de ejecución
    return HORARIOS.includes(horaActual);
}

// Función principal para ejecutar según cron
async function ejecutar() {
    if (esHoraEjecucion()) {
        try {
            await generarReporteMercados();
        } catch (error) {
            console.error('Error en ejecución programada:', error);
        }
    } else {
        console.log('No es hora de ejecución. Horarios permitidos:', HORARIOS);
    }
}

// Exportar funciones para uso externo
module.exports = {
    generarReporteMercados,
    ejecutar,
    esHoraEjecucion
};

// Si se ejecuta directamente
if (require.main === module) {
    ejecutar();
}