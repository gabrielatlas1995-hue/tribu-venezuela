#!/bin/bash
# Reporte financiero tarde 4:35 PM ET
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/gabrielatlas/clawd/skills/mercados && node reporte-v2.js 2>&1 | tee /Users/gabrielatlas/clawd/logs/reporte-pm-$(date +%Y%m%d).log
