#!/bin/bash
# Reporte financiero mañana 8:30 AM ET
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/gabrielatlas/clawd/skills/mercados && node reporte-v2.js 2>&1 | tee /Users/gabrielatlas/clawd/logs/reporte-am-$(date +%Y%m%d).log
