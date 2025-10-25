# ============================================
# INICIAR PROYECTO COMPLETO - ProXimidad
# ============================================

Write-Host "🚀 INICIANDO ProXimidad..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Obtener IP actual
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.1.*"})[0].IPAddress
if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*","Ethernet*" | Where-Object {$_.IPAddress -notlike "127.*"})[0].IPAddress
}
Write-Host "📍 Tu IP Local: $ip" -ForegroundColor Green
Write-Host ""

# Verificar si hay puertos en uso
Write-Host "🔍 Verificando puertos..." -ForegroundColor Yellow
$puerto5173 = netstat -an | Select-String "5173" | Select-String "LISTENING"
$puerto8000 = netstat -an | Select-String "8000" | Select-String "LISTENING"

if ($puerto5173) {
    Write-Host "   ⚠️ Puerto 5173 en uso. Cerrando..." -ForegroundColor Yellow
    Get-Process -Name *node* -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

if ($puerto8000) {
    Write-Host "   ⚠️ Puerto 8000 en uso. Cerrando..." -ForegroundColor Yellow
    Get-Process -Name *python* -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

Write-Host "   ✅ Puertos liberados" -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "🔧 Iniciando Backend Django..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🐍 BACKEND DJANGO' -ForegroundColor Cyan; python manage.py runserver 0.0.0.0:8000"
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "📱 Iniciando Frontend Vite..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '⚛️ FRONTEND VITE' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ PROYECTO INICIADO CORRECTAMENTE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 ACCESO LOCAL:" -ForegroundColor Magenta
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📱 ACCESO DESDE CELULAR:" -ForegroundColor Magenta
Write-Host "   Frontend: http://$ip:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://$ip:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   • Asegúrate de estar en la MISMA red WiFi" -ForegroundColor White
Write-Host "   • Si no funciona, ejecuta: .\abrir_firewall.ps1 (como Admin)" -ForegroundColor White
Write-Host "   • Para diagnóstico: .\verificar_conexion.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener los servicios" -ForegroundColor Gray
Write-Host ""
pause
