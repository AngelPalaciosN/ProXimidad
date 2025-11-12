# ============================================================
#      ProXimidad - Build Frontend
# ============================================================

Clear-Host
Write-Host ""
Write-Host "🚀 Building ProXimidad Frontend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio frontend
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Ejecuta desde el directorio frontend" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al instalar dependencias" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Build para producción
Write-Host "🔨 Compilando para producción..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al compilar" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "✅ Frontend build completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Archivos de producción en: " -NoNewline
Write-Host "dist\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ejecutar en modo desarrollo:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para previsualizar build:" -ForegroundColor Yellow
Write-Host "  npm run preview" -ForegroundColor Cyan
Write-Host ""
Read-Host "Presiona Enter para salir"
