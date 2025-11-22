# ============================================================
#      ProXimidad - Script de Inicio
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Iniciando Servicios" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar a la raíz del proyecto
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $PROJECT_ROOT

# ============================================================
# FUNCIÓN: Detectar IP usando ver_ip.ps1
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
    $LOCAL_IP = Read-Host "No se detectó IP. Ingrésala manualmente"
}

Write-Host "[OK] IP detectada: $LOCAL_IP" -ForegroundColor Green

# ============================================================
# INICIAR BACKEND
# ============================================================
Write-Host "`n[Backend] Iniciando Django..." -ForegroundColor Cyan
Set-Location backend

# Activar entorno virtual
if (Test-Path "venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
} else {
    Write-Host "[ERROR] Entorno virtual no encontrado. Ejecuta install.ps1 primero." -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Iniciar servidor Django en segundo plano
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PROJECT_ROOT\backend'; .\venv\Scripts\Activate.ps1; python manage.py runserver $($LOCAL_IP):8000" -WindowStyle Minimized

Write-Host "[OK] Backend iniciado en http://$($LOCAL_IP):8000" -ForegroundColor Green

# ============================================================
# INICIAR FRONTEND
# ============================================================
Write-Host "`n[Frontend] Iniciando Vite..." -ForegroundColor Cyan
Set-Location ../frontend

# Actualizar .env con IP actual
$envContent = "VITE_API_URL=http://$($LOCAL_IP):8000"
Set-Content -Path ".env" -Value $envContent -Encoding UTF8

# Iniciar Vite en segundo plano
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PROJECT_ROOT\frontend'; npm run dev -- --host $LOCAL_IP" -WindowStyle Minimized

Write-Host "[OK] Frontend iniciado en http://$($LOCAL_IP):5173" -ForegroundColor Green

# ============================================================
# FINALIZACIÓN
# ============================================================
Set-Location $PROJECT_ROOT

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     ✅ SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Aplicación disponible en:" -ForegroundColor Cyan
Write-Host "   Frontend: http://$($LOCAL_IP):5173" -ForegroundColor Yellow
Write-Host "   Backend:  http://$($LOCAL_IP):8000" -ForegroundColor Yellow
Write-Host "   Admin:    http://$($LOCAL_IP):8000/admin" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para salir (los servicios seguirán activos)"


