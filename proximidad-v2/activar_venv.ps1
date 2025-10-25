# Script para activar el entorno virtual de ProXimidad
# SOLO usar el venv de backend/venv/

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Activando entorno virtual de ProXimidad" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
    
    Write-Host ""
    Write-Host "[OK] Entorno virtual activado correctamente" -ForegroundColor Green
    Write-Host "Ruta: $PWD\venv" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Puedes ejecutar:" -ForegroundColor White
    Write-Host "  - py manage.py runserver 192.168.0.100:8000" -ForegroundColor Gray
    Write-Host "  - py manage.py migrate" -ForegroundColor Gray
    Write-Host "  - py manage.py createsuperuser" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] No se pudo activar el entorno virtual" -ForegroundColor Red
    Write-Host "Verifica que existe la carpeta backend\venv" -ForegroundColor Yellow
    Write-Host ""
}
