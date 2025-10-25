# ============================================
# SCRIPT PARA ABRIR PUERTOS EN FIREWALL
# ============================================
# Ejecutar como ADMINISTRADOR

Write-Host "🔥 Configurando Firewall de Windows..." -ForegroundColor Cyan
Write-Host ""

# Puerto Frontend (Vite)
Write-Host "📱 Abriendo puerto 5173 (Frontend Vite)..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="ProXimidad Frontend" | Out-Null
netsh advfirewall firewall add rule name="ProXimidad Frontend" dir=in action=allow protocol=TCP localport=5173

# Puerto Backend (Django)
Write-Host "🔧 Abriendo puerto 8000 (Backend Django)..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="ProXimidad Backend" | Out-Null
netsh advfirewall firewall add rule name="ProXimidad Backend" dir=in action=allow protocol=TCP localport=8000

# Puerto Laragon MySQL (si lo necesitas)
Write-Host "💾 Abriendo puerto 3306 (MySQL)..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="ProXimidad MySQL" | Out-Null
netsh advfirewall firewall add rule name="ProXimidad MySQL" dir=in action=allow protocol=TCP localport=3306

Write-Host ""
Write-Host "✅ Firewall configurado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Reglas creadas:" -ForegroundColor Cyan
netsh advfirewall firewall show rule name="ProXimidad Frontend"
netsh advfirewall firewall show rule name="ProXimidad Backend"
Write-Host ""
Write-Host "🌐 Tu IP local es: 192.168.1.100" -ForegroundColor Magenta
Write-Host "📱 Desde tu celular accede a: http://192.168.1.100:5173" -ForegroundColor Magenta
Write-Host ""
pause
