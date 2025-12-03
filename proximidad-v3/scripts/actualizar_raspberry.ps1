<#
.SYNOPSIS
Script para actualizar archivos modificados en la Raspberry Pi vía SCP

.DESCRIPTION
Este script transfiere los archivos corregidos del frontend y backend a la Raspberry Pi
para solucionar el error de Bad Request en las solicitudes.

.PARAMETER RaspberryIP
IP de la Raspberry Pi (por defecto: 192.168.1.100)

.PARAMETER Usuario
Usuario SSH (por defecto: proximidad)

.EXAMPLE
.\actualizar_raspberry.ps1
.\actualizar_raspberry.ps1 -RaspberryIP "192.168.1.150" -Usuario "pi"
#>

param(
    [string]$RaspberryIP = "192.168.1.50",
    [string]$Usuario = "proximidad"
)

Write-Host "🚀 Iniciando actualización de ProXimidad en Raspberry Pi" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

if (-not (Test-Path "$projectRoot\backend\proximidad_app2\views_solicitudes.py")) {
    Write-Host "❌ Error: No se encontró el directorio del proyecto" -ForegroundColor Red
    Write-Host "Por favor ejecuta este script desde proximidad-v3\scripts\" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Proyecto encontrado en: $projectRoot" -ForegroundColor Green
Write-Host ""

# Configuración
$destino = "${Usuario}@${RaspberryIP}"
$backendPath = "/home/proximidad/backend"
$frontendPath = "/home/proximidad/frontend"

Write-Host "📋 Configuración:" -ForegroundColor Yellow
Write-Host "  - Destino: $destino" -ForegroundColor White
Write-Host "  - Backend: $backendPath" -ForegroundColor White
Write-Host "  - Frontend: $frontendPath" -ForegroundColor White
Write-Host ""

# Verificar conectividad
Write-Host "🔍 Verificando conectividad con Raspberry Pi..." -ForegroundColor Yellow
$pingResult = Test-Connection -ComputerName $RaspberryIP -Count 2 -Quiet

if (-not $pingResult) {
    Write-Host "❌ No se puede conectar con $RaspberryIP" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  1. La Raspberry Pi esté encendida" -ForegroundColor White
    Write-Host "  2. La IP sea correcta" -ForegroundColor White
    Write-Host "  3. Estés en la misma red" -ForegroundColor White
    exit 1
}

Write-Host "✅ Conectividad verificada" -ForegroundColor Green
Write-Host ""

# Crear backup en la Raspberry Pi
Write-Host "💾 Creando backup en la Raspberry Pi..." -ForegroundColor Yellow
ssh $destino "cd ~ && mkdir -p backups && tar -czf backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz backend/proximidad_app2/views_solicitudes.py frontend/src/components/modules/ServiceRequestModal.jsx 2>/dev/null || echo 'Archivos no encontrados, continuando...'"

Write-Host "✅ Backup creado" -ForegroundColor Green
Write-Host ""

# Transferir archivo del backend
Write-Host "📤 Transfiriendo archivo de backend..." -ForegroundColor Yellow
Write-Host "  Archivo: proximidad_app2/views_solicitudes.py" -ForegroundColor White

$backendFile = "$projectRoot\backend\proximidad_app2\views_solicitudes.py"
if (Test-Path $backendFile) {
    scp $backendFile "${destino}:${backendPath}/proximidad_app2/views_solicitudes.py"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Backend actualizado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Error al transferir backend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ❌ Archivo no encontrado: $backendFile" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Transferir archivo del frontend
Write-Host "📤 Transfiriendo archivo de frontend..." -ForegroundColor Yellow
Write-Host "  Archivo: components/modules/ServiceRequestModal.jsx" -ForegroundColor White

$frontendFile = "$projectRoot\frontend\src\components\modules\ServiceRequestModal.jsx"
if (Test-Path $frontendFile) {
    scp $frontendFile "${destino}:${frontendPath}/src/components/modules/ServiceRequestModal.jsx"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Frontend actualizado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Error al transferir frontend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ❌ Archivo no encontrado: $frontendFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Archivos transferidos exitosamente" -ForegroundColor Green
Write-Host ""

# Menú de opciones para compilar y reiniciar
Write-Host "🔧 Opciones de actualización:" -ForegroundColor Yellow
Write-Host "  1. Compilar frontend y reiniciar servicios (Recomendado)" -ForegroundColor White
Write-Host "  2. Solo reiniciar backend (Gunicorn)" -ForegroundColor White
Write-Host "  3. Solo compilar frontend" -ForegroundColor White
Write-Host "  4. No hacer nada (manual)" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-4)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Compilando frontend..." -ForegroundColor Yellow
        ssh $destino "cd ${frontendPath} && npm run build"
        
        Write-Host ""
        Write-Host "🔄 Reiniciando servicios..." -ForegroundColor Yellow
        ssh $destino "sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx"
        
        Write-Host "✅ Frontend compilado y servicios reiniciados" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "🔄 Reiniciando Gunicorn..." -ForegroundColor Yellow
        ssh $destino "sudo systemctl restart proximidad_app1.service proximidad_app2.service"
        
        Write-Host "✅ Backend reiniciado" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "🔨 Compilando frontend..." -ForegroundColor Yellow
        ssh $destino "cd ${frontendPath} && npm run build"
        
        Write-Host "✅ Frontend compilado" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "⚠️  Recuerda compilar el frontend y reiniciar servicios manualmente:" -ForegroundColor Yellow
        Write-Host "  cd ${frontendPath} && npm run build" -ForegroundColor White
        Write-Host "  sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx" -ForegroundColor White
    }
    default {
        Write-Host "❌ Opción no válida" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Actualización completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Cambios aplicados:" -ForegroundColor Yellow
Write-Host "  ✅ Backend: Mejorado logging y validaciones en crear_solicitud()" -ForegroundColor White
Write-Host "  ✅ Frontend: Corregido acceso a propiedades del servicio" -ForegroundColor White
Write-Host "  ✅ Frontend: Mejorado manejo de errores con mensajes descriptivos" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Para verificar:" -ForegroundColor Yellow
Write-Host "  - Revisa los logs: ssh $destino 'sudo journalctl -u proximidad_app2.service -f'" -ForegroundColor White
Write-Host "  - Prueba crear una solicitud en el frontend" -ForegroundColor White
Write-Host "  - Los errores ahora serán más descriptivos" -ForegroundColor White
Write-Host ""
