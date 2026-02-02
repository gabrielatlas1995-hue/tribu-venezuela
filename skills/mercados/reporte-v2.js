#!/usr/bin/env node

/**
 * Skill: Reportes de Mercados - Formato Profesional v2
 * Usa herramientas nativas de Clawdbot (web_search)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const TIMEZONE = 'America/New_York';

// Función para obtener fecha en timezone NY
function getNYDate() {
    return new Date().toLocaleDateString('es-ES', {
        timeZone: TIMEZONE,
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

function getNYTime() {
    return new Date().toLocaleTimeString('en-US', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Función para hacer web search usando clawdbot CLI
async function buscar(query) {
    try {
        const result = execSync(
            `cd /Users/gabrielatlas/clawd && clawdbot web-search "${query.replace(/"/g, '\\"')}" --json`,
            { encoding: 'utf-8', timeout: 15000 }
        );
        return JSON.parse(result);
    } catch (e) {
        console.error(`Error buscando "${query}":`, e.message);
        return { results: [] };
    }
}

// Función para generar reporte AM (8:30 AM ET)
async function generarReporteAM() {
    const fecha = getNYDate();
    let reporte = `📊 REPORTE AM — ${fecha.toUpperCase()}\n\n`;
    
    // A) FUTUROS
    console.log('🔍 Buscando futuros...');
    try {
        const futuros = await buscar('S&P 500 Nasdaq Dow futures premarket today percentage');
        const spx = extraerVariacion(futuros, 'S&P');
        const ndx = extraerVariacion(futuros, 'Nasdaq');
        const dji = extraerVariacion(futuros, 'Dow');
        reporte += `A) FUTUROS: S&P ${spx} | Nasdaq ${ndx} | Dow ${dji}\n\n`;
    } catch (e) {
        reporte += `A) FUTUROS: S&P (pendiente) | Nasdaq (pendiente) | Dow (pendiente)\n\n`;
    }
    
    // B) EARNINGS RECAP (AYER)
    console.log('🔍 Buscando earnings de ayer...');
    try {
        const earningsAyer = await buscar('after hours earnings yesterday results beats misses guidance');
        reporte += `B) EARNINGS RECAP (AYER post-cierre):\n`;
        const recap = extraerEarnings(earningsAyer);
        if (recap.length > 0) {
            recap.slice(0, 5).forEach(item => {
                reporte += `• *${item.empresa} (${item.ticker})* ${item.variacion} — ${item.driver}\n`;
            });
        } else {
            reporte += `• (Sin resultados destacados reportados)\n`;
        }
        reporte += `\n`;
    } catch (e) {
        reporte += `B) EARNINGS RECAP: (datos no disponibles)\n\n`;
    }
    
    // C) PREMARKET MOVERS
    console.log('🔍 Buscando premarket movers...');
    try {
        const movers = await buscar('premarket stock movers today biggest gains losses news');
        reporte += `C) PREMARKET MOVERS:\n`;
        const listaMovers = extraerMovers(movers);
        if (listaMovers.length > 0) {
            listaMovers.slice(0, 5).forEach(m => {
                reporte += `• *${m.ticker}* ${m.variacion} — ${m.razon}\n`;
            });
        } else {
            reporte += `• (Movimientos preliminares pendientes)\n`;
        }
        reporte += `\n`;
    } catch (e) {
        reporte += `C) PREMARKET MOVERS: (datos no disponibles)\n\n`;
    }
    
    // D) EARNINGS HOY
    console.log('🔍 Buscando earnings de hoy...');
    try {
        const earningsPre = await buscar('earnings today before market open premarket');
        const earningsPost = await buscar('earnings today after market close after-hours');
        
        reporte += `D) EARNINGS HOY:\n`;
        const pre = extraerTickers(earningsPre);
        const post = extraerTickers(earningsPost);
        
        reporte += `Pre-mercado: ${pre.slice(0, 6).join(', ') || '(sin datos)'}\n`;
        reporte += `Post-cierre: ${post.slice(0, 6).join(', ') || '(sin datos)'}\n\n`;
    } catch (e) {
        reporte += `D) EARNINGS HOY: (calendario no disponible)\n\n`;
    }
    
    // E) MACRO HOY
    console.log('🔍 Buscando eventos macro...');
    try {
        const macro = await buscar('economic calendar today US GDP CPI Fed interest rates');
        reporte += `E) MACRO HOY (ET):\n`;
        const eventos = extraerEventosMacro(macro);
        if (eventos.length > 0) {
            eventos.slice(0, 4).forEach(ev => {
                reporte += `• ${ev.hora} — ${ev.evento} (${ev.importancia})\n`;
            });
        } else {
            reporte += `• Sin eventos macro destacados\n`;
        }
        reporte += `\n`;
    } catch (e) {
        reporte += `E) MACRO HOY: (calendario no disponible)\n\n`;
    }
    
    // F) A VIGILAR
    reporte += `🎯 A VIGILAR:\n`;
    reporte += `• Niveles técnicos S&P 500 (soporte/resistencia)\n`;
    reporte += `• Mega caps: AAPL, MSFT, NVDA, AMZN, GOOGL, META\n`;
    reporte += `• Narrativa de tasas de interés (Fed y bonos)\n`;
    
    return reporte;
}

// Función para generar reporte PM (4:35 PM ET)
async function generarReportePM() {
    const fecha = getNYDate();
    let reporte = `📊 REPORTE PM — ${fecha.toUpperCase()}\n\n`;
    
    // A) CIERRE
    console.log('🔍 Buscando cierres...');
    try {
        const cierres = await buscar('S&P 500 Nasdaq Dow close today percentage change final');
        const spx = extraerVariacion(cierres, 'S&P');
        const ndx = extraerVariacion(cierres, 'Nasdaq');
        const dji = extraerVariacion(cierres, 'Dow');
        reporte += `A) CIERRE: S&P ${spx} | Nasdaq ${ndx} | Dow ${dji}\n\n`;
    } catch (e) {
        reporte += `A) CIERRE: S&P (pendiente) | Nasdaq (pendiente) | Dow (pendiente)\n\n`;
    }
    
    // B) LO QUE MOVIÓ EL DÍA
    console.log('🔍 Buscando drivers del día...');
    try {
        const drivers = await buscar('what moved the stock market today rally decline reasons');
        reporte += `B) Lo que movió el día:\n`;
        const bullets = extraerDrivers(drivers);
        if (bullets.length >= 2) {
            reporte += `• ${bullets[0]}\n`;
            reporte += `• ${bullets[1]}\n`;
        } else {
            reporte += `• Sentimiento general del mercado\n`;
            reporte += `• Flujos sectoriales observados\n`;
        }
        reporte += `\n`;
    } catch (e) {
        reporte += `B) Lo que movió el día: (análisis pendiente)\n\n`;
    }
    
    // C) TOP GANADORES Y PERDEDORES
    console.log('🔍 Buscando ganadores y perdedores...');
    try {
        const ganadores = await buscar('biggest stock gainers today S&P 500 percentage');
        const perdedores = await buscar('biggest stock losers today S&P 500 percentage');
        
        reporte += `C) MOVIMIENTOS DESTACADOS:\n`;
        
        const topGanadores = extraerMovers(ganadores);
        const topPerdedores = extraerMovers(perdedores);
        
        reporte += `Ganadores: `;
        topGanadores.slice(0, 3).forEach((g, i) => {
            reporte += `*${g.ticker}* ${g.variacion}${i < 2 ? ', ' : ''}`;
        });
        reporte += `\n`;
        
        reporte += `Perdedores: `;
        topPerdedores.slice(0, 3).forEach((p, i) => {
            reporte += `*${p.ticker}* ${p.variacion}${i < 2 ? ', ' : ''}`;
        });
        reporte += `\n\n`;
    } catch (e) {
        reporte += `C) MOVIMIENTOS: (datos no disponibles)\n\n`;
    }
    
    // D) EARNINGS DEL DÍA
    console.log('🔍 Buscando earnings reportados...');
    try {
        const earningsHoy = await buscar('earnings results today reported beats misses guidance');
        const earningsManana = await buscar('earnings tomorrow before market open premarket');
        
        reporte += `D) EARNINGS DEL DÍA:\n`;
        
        const publicados = extraerTickers(earningsHoy);
        const manana = extraerTickers(earningsManana);
        
        reporte += `Reportados hoy: ${publicados.slice(0, 5).join(', ') || '(pendiente)'}\n`;
        reporte += `Mañana pre-mercado: ${manana.slice(0, 5).join(', ') || '(pendiente)'}\n\n`;
    } catch (e) {
        reporte += `D) EARNINGS: (calendario no disponible)\n\n`;
    }
    
    // E) AFTER-HOURS
    console.log('🔍 Buscando after-hours...');
    try {
        const afterHours = await buscar('after hours stock movers today earnings news');
        reporte += `E) AFTER-HOURS:\n`;
        const ah = extraerMovers(afterHours);
        if (ah.length > 0) {
            ah.slice(0, 3).forEach(mov => {
                reporte += `• *${mov.ticker}* ${mov.variacion} — ${mov.razon}\n`;
            });
        } else {
            reporte += `• (Sin movimientos significativos)\n`;
        }
        reporte += `\n`;
    } catch (e) {
        reporte += `E) AFTER-HOURS: (datos no disponibles)\n\n`;
    }
    
    // F) MAÑANA
    console.log('🔍 Buscando catalizadores de mañana...');
    try {
        const catalizadores = await buscar('tomorrow market catalysts economic data earnings events');
        reporte += `🔭 Mañana:\n`;
        const cats = extraerDrivers(catalizadores);
        if (cats.length >= 2) {
            cats.slice(0, 3).forEach(c => {
                if (c.length > 10 && c.length < 100) {
                    reporte += `• ${c}\n`;
                }
            });
        } else {
            reporte += `• Earnings destacados en el calendario\n`;
            reporte += `• Datos económicos programados\n`;
        }
    } catch (e) {
        reporte += `🔭 Mañana: (calendario no disponible)\n`;
    }
    
    return reporte;
}

// Funciones auxiliares
function extraerVariacion(data, tipo) {
    if (!data || !data.results || data.results.length === 0) return '(pendiente)';
    
    const text = JSON.stringify(data.results).toLowerCase();
    
    // Buscar patrones como "up 0.54%", "+0.54%", "gained 0.54%"
    const patterns = [
        new RegExp(`${tipo.toLowerCase()}.*?up ([\\d\\.]+)%`, 'i'),
        new RegExp(`${tipo.toLowerCase()}.*?down ([\\d\\.]+)%`, 'i'),
        new RegExp(`${tipo.toLowerCase()}.*?([\\+\\-]?[\\d\\.]+)%`, 'i'),
        /up ([\d\.]+)%/i,
        /down ([\d\.]+)%/i,
        /gained ([\d\.]+)%/i,
        /declined ([\d\.]+)%/i,
        /([\+\-][\d\.]+)%/
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const val = parseFloat(match[1]);
            if (text.includes('down') || text.includes('declined') || text.includes('-')) {
                return `-${Math.abs(val)}%`;
            }
            return `+${Math.abs(val)}%`;
        }
    }
    
    return '(pendiente)';
}

function extraerEarnings(data) {
    const results = [];
    if (!data || !data.results) return results;
    
    data.results.forEach(r => {
        const text = (r.title + ' ' + r.description).toUpperCase();
        const desc = r.description || '';
        
        // Buscar ticker
        const tickerMatch = text.match(/\b([A-Z]{2,5})\b/);
        if (!tickerMatch) return;
        
        const ticker = tickerMatch[1];
        
        // Buscar variación
        const variacionMatch = desc.match(/([+-]?\d+\.?\d*)%/);
        const variacion = variacionMatch ? `${variacionMatch[1] >= 0 ? '+' : ''}${variacionMatch[1]}%` : '(variación pendiente)';
        
        // Determinar driver
        let driver = 'Resultados trimestrales';
        const upperDesc = desc.toUpperCase();
        if (upperDesc.includes('BEAT') || upperDesc.includes('SUPERA')) driver = 'Supera expectativas';
        else if (upperDesc.includes('MISS') || upperDesc.includes('DEBAJO')) driver = 'Por debajo expectativas';
        else if (upperDesc.includes('GUIDANCE') || upperDesc.includes('OUTLOOK')) driver = 'Guidance actualizado';
        else if (upperDesc.includes('REVENUE') || upperDesc.includes('INGRESOS')) driver = 'Ingresos destacados';
        
        results.push({
            empresa: ticker,
            ticker: ticker,
            variacion: variacion,
            driver: driver
        });
    });
    
    return results;
}

function extraerMovers(data) {
    const results = [];
    if (!data || !data.results) return results;
    
    data.results.forEach(r => {
        const text = (r.title + ' ' + r.description).toUpperCase();
        const desc = r.description || r.title || '';
        
        // Buscar ticker (evitar palabras comunes)
        const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE'];
        const tickerMatch = text.match(/\b([A-Z]{2,5})\b/);
        
        if (!tickerMatch || commonWords.includes(tickerMatch[1])) return;
        
        const ticker = tickerMatch[1];
        
        // Buscar variación
        const variacionMatch = desc.match(/([+-]?\d+\.?\d*)%/);
        if (!variacionMatch) return;
        
        const variacion = `${variacionMatch[1] >= 0 ? '+' : ''}${variacionMatch[1]}%`;
        
        // Determinar razón
        let razon = 'Movimiento significativo';
        const lowerDesc = desc.toLowerCase();
        if (lowerDesc.includes('earnings') || lowerDesc.includes('result')) razon = 'Earnings';
        else if (lowerDesc.includes('upgrade')) razon = 'Upgrade';
        else if (lowerDesc.includes('downgrade')) razon = 'Downgrade';
        else if (lowerDesc.includes('news') || lowerDesc.includes('announc')) razon = 'Noticia';
        else if (lowerDesc.includes('fda') || lowerDesc.includes('approval')) razon = 'Aprobación FDA';
        else if (lowerDesc.includes('merger') || lowerDesc.includes('acquisition')) razon = 'M&A';
        
        results.push({ ticker, variacion, razon });
    });
    
    return results;
}

function extraerTickers(data) {
    const tickers = [];
    if (!data || !data.results) return tickers;
    
    const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'STOCK', 'SHARE', 'MARKET', 'TRADE', 'PRICE'];
    
    data.results.forEach(r => {
        const text = (r.title + ' ' + r.description).toUpperCase();
        const matches = text.match(/\b([A-Z]{2,5})\b/g);
        
        if (matches) {
            matches.forEach(m => {
                if (!commonWords.includes(m) && !tickers.includes(m) && m.length >= 2 && m.length <= 5) {
                    tickers.push(m);
                }
            });
        }
    });
    
    return tickers;
}

function extraerEventosMacro(data) {
    const eventos = [];
    if (!data || !data.results) return eventos;
    
    const text = data.results.map(r => r.title + ' ' + r.description).join(' ');
    const eventosClave = [
        { name: 'GDP', importance: 'alta' },
        { name: 'CPI', importance: 'alta' },
        { name: 'PPI', importance: 'alta' },
        { name: 'Fed', importance: 'alta' },
        { name: 'FOMC', importance: 'alta' },
        { name: 'NFP', importance: 'alta' },
        { name: 'Nonfarm Payrolls', importance: 'alta' },
        { name: 'jobs', importance: 'media' },
        { name: 'unemployment', importance: 'media' },
        { name: 'PMI', importance: 'media' },
        { name: 'retail sales', importance: 'media' },
        { name: 'interest rate', importance: 'alta' }
    ];
    
    eventosClave.forEach(ev => {
        if (text.toLowerCase().includes(ev.name.toLowerCase())) {
            // Buscar hora cercana
            const horaMatch = text.match(/(\d{1,2}:\d{2})\s*(AM|PM|ET|EST|Eastern)?/i);
            const hora = horaMatch ? `${horaMatch[1]} ${horaMatch[2] || 'ET'}` : 'Hora TBD';
            
            eventos.push({
                hora: hora,
                evento: ev.name.toUpperCase(),
                importancia: ev.importance
            });
        }
    });
    
    return eventos.slice(0, 4);
}

function extraerDrivers(data) {
    const drivers = [];
    if (!data || !data.results) return drivers;
    
    data.results.forEach(r => {
        const title = r.title || '';
        if (title.length > 20 && title.length < 150 && !title.includes('$')) {
            drivers.push(title);
        }
    });
    
    return drivers.slice(0, 3);
}

// Función para enviar a Telegram
function enviarATelegram(mensaje) {
    try {
        execSync(
            `cd /Users/gabrielatlas/clawd && clawdbot message send "${mensaje.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
            { encoding: 'utf-8', timeout: 10000 }
        );
        console.log('✅ Reporte enviado a Telegram');
    } catch (e) {
        console.error('❌ Error enviando a Telegram:', e.message);
    }
}

// Función principal
async function main() {
    const hora = getNYTime();
    const horaNum = parseInt(hora.split(':')[0]);
    const esAM = horaNum >= 5 && horaNum < 12; // 5 AM - 12 PM es AM
    
    console.log(`🕐 Hora NY: ${hora}`);
    console.log(`📊 Generando reporte ${esAM ? 'AM' : 'PM'}...\n`);
    
    try {
        let reporte;
        if (esAM) {
            reporte = await generarReporteAM();
        } else {
            reporte = await generarReportePM();
        }
        
        console.log('\n' + '='.repeat(50));
        console.log(reporte);
        console.log('='.repeat(50) + '\n');
        
        // Guardar en archivo
        const timestamp = new Date().toISOString().split('T')[0];
        const tipo = esAM ? 'AM' : 'PM';
        const logPath = `/Users/gabrielatlas/clawd/logs/reporte-${tipo}-${timestamp}.txt`;
        fs.writeFileSync(logPath, reporte);
        console.log(`📝 Reporte guardado en: ${logPath}`);
        
        // Enviar a Telegram
        enviarATelegram(reporte);
        
    } catch (error) {
        console.error('❌ Error generando reporte:', error);
        process.exit(1);
    }
}

main();
