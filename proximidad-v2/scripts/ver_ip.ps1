# ============================================================
#      ProXimidad - Ver Información de Red
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Información de Red" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Detectar todas las IPs IPv4
Write-Host "[IPs DETECTADAS]" -ForegroundColor Yellow
Write-Host ""

$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" 
} | Select-Object -Property IPAddress, InterfaceAlias, PrefixOrigin

if ($ips.Count -eq 0) {
    Write-Host "  No se detectaron IPs" -ForegroundColor Red
} else {
    $count = 1
    foreach ($ip in $ips) {
        Write-Host "  $count. " -NoNewline -ForegroundColor White
        Write-Host "$($ip.IPAddress)" -NoNewline -ForegroundColor Cyan
        Write-Host " ($($ip.InterfaceAlias)) " -NoNewline -ForegroundColor Gray
        if ($ip.PrefixOrigin -eq "Dhcp") {
            Write-Host "[DHCP]" -ForegroundColor Green
        } else {
            Write-Host "[$($ip.PrefixOrigin)]" -ForegroundColor Yellow
        }
        $count++
    }
}

Write-Host ""

# Leer configuración actual si existe
if (Test-Path "backend\core\local_settings.py") {
    Write-Host "[CONFIGURACIÓN ACTUAL BACKEND]" -ForegroundColor Yellow
    Write-Host ""
    
    $localSettings = Get-Content "backend\core\local_settings.py" -Raw
    
    # Extraer IP de ALLOWED_HOSTS
    if ($localSettings -match "ALLOWED_HOSTS\s*=\s*\[([^\]]+)\]") {
        $hosts = $matches[1] -replace "'", "" -replace '"', "" -replace ' ', ''
        Write-Host "  Hosts permitidos: " -NoNewline -ForegroundColor White
        Write-Host $hosts -ForegroundColor Cyan
    }
    
    # Extraer info de BD
    if ($localSettings -match "'NAME':\s*'([^']+)'") {
        Write-Host "  Base de datos:    " -NoNewline -ForegroundColor White
        Write-Host $matches[1] -ForegroundColor Cyan
    }
    
    Write-Host ""
}

if (Test-Path "frontend\.env") {
    Write-Host "[CONFIGURACIÓN ACTUAL FRONTEND]" -ForegroundColor Yellow
    Write-Host ""
    
    $frontendEnv = Get-Content "frontend\.env"
    foreach ($line in $frontendEnv) {
        if ($line -match "^VITE_API_BASE_URL=(.+)$") {
            Write-Host "  API Backend: " -NoNewline -ForegroundColor White
            Write-Host $matches[1] -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
}

# Mostrar URLs de acceso
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[ACCESO AL SISTEMA]" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$mainIP = ($ips | Where-Object { $_.PrefixOrigin -eq "Dhcp" } | Select-Object -First 1).IPAddress
if (-not $mainIP) {
    $mainIP = ($ips | Select-Object -First 1).IPAddress
}

if ($mainIP) {
    Write-Host "Desde este equipo:" -ForegroundColor White
    Write-Host "  Backend:  " -NoNewline
    Write-Host "http://$mainIP:8000" -ForegroundColor Green
    Write-Host "  Frontend: " -NoNewline
    Write-Host "http://$mainIP:5173" -ForegroundColor Green
    Write-Host "  Admin:    " -NoNewline
    Write-Host "http://$mainIP:8000/admin" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Desde otros dispositivos en la red:" -ForegroundColor White
    Write-Host "  Frontend: " -NoNewline
    Write-Host "http://$mainIP:5173" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "  No se pudo detectar la IP principal" -ForegroundColor Red
    Write-Host "  Usa localhost:5173 para acceder localmente" -ForegroundColor Yellow
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si los servidores están corriendo
Write-Host "[ESTADO DE SERVICIOS]" -ForegroundColor Yellow
Write-Host ""

function Test-Port {
    param([int]$Port)
    $connection = New-Object System.Net.Sockets.TcpClient
    try {
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

$backendRunning = Test-Port 8000
$frontendRunning = Test-Port 5173

if ($backendRunning) {
    Write-Host "  Backend (8000):  " -NoNewline -ForegroundColor White
    Write-Host "✓ ACTIVO" -ForegroundColor Green
} else {
    Write-Host "  Backend (8000):  " -NoNewline -ForegroundColor White
    Write-Host "✗ INACTIVO" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "  Frontend (5173): " -NoNewline -ForegroundColor White
    Write-Host "✓ ACTIVO" -ForegroundColor Green
} else {
    Write-Host "  Frontend (5173): " -NoNewline -ForegroundColor White
    Write-Host "✗ INACTIVO" -ForegroundColor Red
}

Write-Host ""

if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host "Para iniciar el sistema ejecuta: " -NoNewline -ForegroundColor Yellow
    Write-Host ".\start.ps1" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Presiona Enter para salir"
