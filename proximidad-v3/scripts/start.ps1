# ============================================================
#      ProXimidad - Script de Inicio
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Iniciando Servicios" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar a la raÃ­z del proyecto
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $PROJECT_ROOT

# ============================================================
# FUNCIÃ“N: Detectar IP usando ver_ip.ps1
# ============================================================
function Get-LocalIP {
    $verIpScript = Join-Path $PSScriptRoot "ver_ip.ps1"
    if (Test-Path $verIpScript) {
        Write-Host "[INFO] Detectando IP..." -ForegroundColor Yellow
        try {
            $ip = & $verIpScript 2>&1 | Select-Object -Last 1
            if ($ip -match "\d+\.\d+\.\d+\.\d+") {
                return $ip.Trim()
            }
        } catch {}
    }
    
    # Fallback
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | 
           Where-Object { $_.IPAddress -notlike "127.*" -and 
                          $_.IPAddress -notlike "169.254.*" } | 
           Select-Object -First 1).IPAddress
    return $ip
}

# Detectar IP
$LOCAL_IP = Get-LocalIP
if (-not $LOCAL_IP) {
    $LOCAL_IP = Read-Host "No se detectÃ³ IP. IngrÃ©sala manualmente"
}

Write-Host "[OK] IP detectada: $LOCAL_IP" -ForegroundColor Green

# ============================================================
# INICIAR BACKEND
# ============================================================
Write-Host "`n[Backend] Iniciando Django..." -ForegroundColor Cyan
Set-Location backend

# Iniciar servidor Django en ventana visible con tÃ­tulo personalizado
Write-Host "[INFO] Abriendo ventana de Backend (Django)..." -ForegroundColor Yellow
$backendCommand = @"
`$host.UI.RawUI.WindowTitle = 'ProXimidad - Backend Django'
cd '$PROJECT_ROOT\backend'
if (Test-Path 'venv\Scripts\Activate.ps1') {
    .\venv\Scripts\Activate.ps1
}
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'BACKEND DJANGO - CODIGOS DE VERIFICACION APARECERAN AQUI' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Cyan
python manage.py runserver $($LOCAL_IP):8000
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

Write-Host "[OK] Backend iniciado en http://$($LOCAL_IP):8000" -ForegroundColor Green

# ============================================================
# INICIAR FRONTEND
# ============================================================
Write-Host "`n[Frontend] Iniciando Vite..." -ForegroundColor Cyan
Set-Location ../frontend

# Actualizar .env con IP actual
$envContent = "VITE_API_URL=http://$($LOCAL_IP):8000"
Set-Content -Path ".env" -Value $envContent -Encoding UTF8

# Iniciar Vite en ventana visible con tÃ­tulo personalizado
Write-Host "[INFO] Abriendo ventana de Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$host.UI.RawUI.WindowTitle = 'ProXimidad - Frontend Vite'; cd '$PROJECT_ROOT\frontend'; npm run dev -- --host $LOCAL_IP"

Write-Host "[OK] Frontend iniciado en http://$($LOCAL_IP):5173" -ForegroundColor Green

# ============================================================
# FINALIZACIÃ“N
# ============================================================
Set-Location $PROJECT_ROOT

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Aplicacion disponible en:" -ForegroundColor Cyan
Write-Host "   Frontend: http://$($LOCAL_IP):5173" -ForegroundColor Yellow
Write-Host "   Backend:  http://$($LOCAL_IP):8000" -ForegroundColor Yellow
Write-Host "   Admin:    http://$($LOCAL_IP):8000/admin" -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTA: Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para salir (los servicios seguiran activos)"






