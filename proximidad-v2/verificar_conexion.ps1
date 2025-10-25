# ============================================
# SCRIPT DE DIAGNÓSTICO DE CONEXIÓN
# ============================================

Write-Host "🔍 DIAGNÓSTICO DE CONEXIÓN - ProXimidad" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar IP
Write-Host "1️⃣ Tu IP Local:" -ForegroundColor Yellow
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.1.*"})[0].IPAddress
if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*","Ethernet*" | Where-Object {$_.IPAddress -notlike "127.*"})[0].IPAddress
}
Write-Host "   📍 $ip" -ForegroundColor Green
Write-Host ""

# 2. Verificar Firewall
Write-Host "2️⃣ Reglas de Firewall:" -ForegroundColor Yellow
$reglasFrontend = Get-NetFirewallRule -DisplayName "ProXimidad Frontend" -ErrorAction SilentlyContinue
$reglasBackend = Get-NetFirewallRule -DisplayName "ProXimidad Backend" -ErrorAction SilentlyContinue

if ($reglasFrontend) {
    Write-Host "   ✅ ProXimidad Frontend: CONFIGURADO" -ForegroundColor Green
} else {
    Write-Host "   ❌ ProXimidad Frontend: NO CONFIGURADO" -ForegroundColor Red
    Write-Host "      → Ejecuta abrir_firewall.ps1 como ADMINISTRADOR" -ForegroundColor Yellow
}

if ($reglasBackend) {
    Write-Host "   ✅ ProXimidad Backend: CONFIGURADO" -ForegroundColor Green
} else {
    Write-Host "   ❌ ProXimidad Backend: NO CONFIGURADO" -ForegroundColor Red
    Write-Host "      → Ejecuta abrir_firewall.ps1 como ADMINISTRADOR" -ForegroundColor Yellow
}
Write-Host ""

# 3. Verificar puertos en uso
Write-Host "3️⃣ Puertos en Uso:" -ForegroundColor Yellow
$puertos = netstat -an | Select-String "5173|8000"
if ($puertos) {
    Write-Host "   📊 Servicios detectados:" -ForegroundColor Green
    $puertos | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} else {
    Write-Host "   ⚠️ No se detectaron servicios en puertos 5173 o 8000" -ForegroundColor Red
    Write-Host "      → Inicia el backend y frontend" -ForegroundColor Yellow
}
Write-Host ""

# 4. Verificar conectividad local
Write-Host "4️⃣ Test de Conectividad:" -ForegroundColor Yellow
Write-Host "   🔌 Probando localhost:5173..." -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Frontend: RESPONDE" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend: NO RESPONDE" -ForegroundColor Red
    Write-Host "      → Verifica que npm run dev esté ejecutándose" -ForegroundColor Yellow
}

Write-Host "   🔌 Probando localhost:8000..." -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Backend: RESPONDE" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend: NO RESPONDE" -ForegroundColor Red
    Write-Host "      → Verifica que python manage.py runserver esté ejecutándose" -ForegroundColor Yellow
}
Write-Host ""

# 5. Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📱 ACCESO DESDE CELULAR" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL Frontend: http://$ip:5173" -ForegroundColor Cyan
Write-Host "URL Backend:  http://$ip:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   • Tu celular debe estar en la MISMA red WiFi" -ForegroundColor White
Write-Host "   • Si cambias de red, la IP puede cambiar" -ForegroundColor White
Write-Host "   • Ejecuta este script nuevamente si hay problemas" -ForegroundColor White
Write-Host ""

# 6. Comandos útiles
Write-Host "🔧 COMANDOS ÚTILES:" -ForegroundColor Yellow
Write-Host "   Backend:  cd backend && python manage.py runserver 0.0.0.0:8000" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
pause
