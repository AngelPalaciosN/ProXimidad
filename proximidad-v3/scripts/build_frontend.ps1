# Script de Build del Frontend para Produccion
param(
    [switch]$Clean = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "   BUILD FRONTEND PROXIMIDAD V3" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Obtener rutas
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$FrontendDir = Join-Path $ProjectRoot "frontend"
$DistDir = Join-Path $FrontendDir "dist"

# Cambiar al directorio del frontend
Set-Location $FrontendDir

# 1. Verificar Node.js
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   Error: Node.js no esta instalado" -ForegroundColor Red
    exit 1
}

# 2. Verificar/Instalar dependencias
if (-not (Test-Path "node_modules") -or $Clean) {
    Write-Host "`nInstalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "   Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "`nDependencias ya instaladas" -ForegroundColor Green
}

# 3. Limpiar build anterior
if (Test-Path $DistDir) {
    Write-Host "`nLimpiando build anterior..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $DistDir
    Write-Host "   Build anterior eliminado" -ForegroundColor Green
}

# 4. Verificar .env de produccion
$EnvFile = Join-Path $FrontendDir ".env"
if (-not (Test-Path $EnvFile)) {
    Write-Host "`nAdvertencia: No existe archivo .env" -ForegroundColor Yellow
    Write-Host "   Creando .env con valores por defecto..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost
VITE_API_PORT=
"@ | Out-File -FilePath $EnvFile -Encoding UTF8
}

# 5. Ejecutar build
Write-Host "`nGenerando build de produccion..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError al generar build" -ForegroundColor Red
    exit 1
}

# 6. Verificar que el build se genero correctamente
if (-not (Test-Path (Join-Path $DistDir "index.html"))) {
    Write-Host "`nError: No se genero index.html" -ForegroundColor Red
    exit 1
}

# 7. Calcular tamano del build
$TotalSize = (Get-ChildItem -Recurse $DistDir | Measure-Object -Property Length -Sum).Sum
$SizeMB = [math]::Round($TotalSize / 1MB, 2)

# 8. Contar archivos
$FileCount = (Get-ChildItem -Recurse $DistDir -File).Count

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "   BUILD COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "`nEstadisticas del build:" -ForegroundColor Cyan
Write-Host "   Ubicacion: $DistDir" -ForegroundColor White
Write-Host "   Tamano:    $SizeMB MB" -ForegroundColor White
Write-Host "   Archivos:  $FileCount" -ForegroundColor White
Write-Host "`nBuild listo para desplegar en:" -ForegroundColor Yellow
Write-Host "   /var/www/proximidad/frontend_build/" -ForegroundColor White
Write-Host "`nSiguiente paso:" -ForegroundColor Cyan
Write-Host "   Comprime la carpeta dist/ y subela a la Raspberry" -ForegroundColor White
Write-Host "   O usa el script de deploy automatico" -ForegroundColor White
Write-Host ""

# 9. Opcional: Crear tarball para deploy
$TarFile = Join-Path $ProjectRoot "dist.tar.gz"
if (Get-Command tar -ErrorAction SilentlyContinue) {
    Write-Host "Comprimiendo build..." -ForegroundColor Yellow
    Set-Location $FrontendDir
    tar -czf $TarFile -C $DistDir .
    if (Test-Path $TarFile) {
        $TarSize = [math]::Round((Get-Item $TarFile).Length / 1MB, 2)
        Write-Host "   Archivo comprimido: dist.tar.gz ($TarSize MB)" -ForegroundColor Green
        Write-Host "   Ubicacion: $TarFile" -ForegroundColor White
    }
}

Write-Host "`nProceso completado" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
