# ============================================================
#      ProXimidad - Crear Backup Completo
# ============================================================
# Exporta la base de datos MySQL y comprime media/ en RAR protegido

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Crear Backup Completo" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar a la raíz del proyecto
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $PROJECT_ROOT

# ============================================================
# [1/3] EXPORTAR BASE DE DATOS
# ============================================================
Write-Host "[1/3] Exportando Base de Datos..." -ForegroundColor Cyan

# Verificar que MySQL esté corriendo
Write-Host "[INFO] Verificando MySQL..." -ForegroundColor Yellow
$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlRunning) {
    Write-Host "[ERROR] MySQL no está corriendo. Inicia Laragon primero." -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}
Write-Host "[OK] MySQL está corriendo" -ForegroundColor Green

# Solicitar credenciales
$dbUser = Read-Host "Usuario MySQL [root]"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }

$dbPass = Read-Host "Contraseña MySQL (dejar vacío si no tiene)" -AsSecureString
$dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass)
)

# Verificar que la BD existe
Write-Host "[INFO] Verificando base de datos 'proxima'..." -ForegroundColor Yellow
try {
    if ($dbPassPlain) {
        $checkDb = mysql -u $dbUser -p"$dbPassPlain" -e "SHOW DATABASES LIKE 'proxima';" 2>&1
    } else {
        $checkDb = mysql -u $dbUser -e "SHOW DATABASES LIKE 'proxima';" 2>&1
    }
    
    if ($checkDb -notmatch "proxima") {
        Write-Host "[ERROR] La base de datos 'proxima' no existe" -ForegroundColor Red
        Read-Host "`nPresiona Enter para salir"
        exit 1
    }
    Write-Host "[OK] Base de datos encontrada" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo conectar a MySQL" -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Exportar BD
Write-Host "[INFO] Exportando BD a database/proxima_refinado.sql..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "database" | Out-Null

try {
    if ($dbPassPlain) {
        mysqldump -u $dbUser -p"$dbPassPlain" --databases proxima --no-tablespaces > "database\proxima_refinado.sql" 2>&1
    } else {
        mysqldump -u $dbUser --databases proxima --no-tablespaces > "database\proxima_refinado.sql" 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        $sqlSize = (Get-Item "database\proxima_refinado.sql").Length / 1MB
        Write-Host "[OK] BD exportada ($([math]::Round($sqlSize, 2)) MB)" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Fallo al exportar BD" -ForegroundColor Red
        Read-Host "`nPresiona Enter para salir"
        exit 1
    }
} catch {
    Write-Host "[ERROR] Error al exportar BD" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# ============================================================
# [2/3] COMPRIMIR MEDIA
# ============================================================
Write-Host "`n[2/3] Comprimiendo imágenes..." -ForegroundColor Cyan

# Verificar que existe media/
if (-not (Test-Path "backend\media")) {
    Write-Host "[ERROR] No existe backend\media" -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Buscar WinRAR
$rarPaths = @(
    "C:\Program Files\WinRAR\WinRAR.exe",
    "C:\Program Files (x86)\WinRAR\WinRAR.exe",
    "$env:ProgramFiles\WinRAR\WinRAR.exe",
    "$env:ProgramFiles(x86)\WinRAR\WinRAR.exe"
)

$rarCmd = $null
foreach ($path in $rarPaths) {
    if (Test-Path $path) {
        $rarCmd = $path
        Write-Host "[OK] WinRAR encontrado" -ForegroundColor Green
        break
    }
}

if (-not $rarCmd) {
    Write-Host "[ERROR] WinRAR no encontrado" -ForegroundColor Red
    Write-Host "[INFO] Instala WinRAR desde: https://www.winrar.es/" -ForegroundColor Yellow
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Solicitar contraseña del RAR
Write-Host ""
$rarPass = Read-Host "Contraseña para el RAR [proximidad_2025]" -AsSecureString
$rarPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rarPass)
)
if ([string]::IsNullOrWhiteSpace($rarPassPlain)) { $rarPassPlain = "proximidad_2025" }

# Eliminar backup anterior si existe
if (Test-Path "media_backup.rar") {
    Remove-Item "media_backup.rar" -Force
}

# Crear RAR protegido
Write-Host "[INFO] Comprimiendo (puede tardar unos segundos)..." -ForegroundColor Yellow
Set-Location backend
& $rarCmd a -hp"$rarPassPlain" -r "..\media_backup.rar" "media\usuarios\*" "media\servicios\*" | Out-Null
Set-Location ..

if (Test-Path "media_backup.rar") {
    $rarSize = (Get-Item "media_backup.rar").Length / 1MB
    Write-Host "[OK] RAR creado ($([math]::Round($rarSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Fallo al crear RAR" -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# ============================================================
# [3/3] RESUMEN
# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     ✅ BACKUP COMPLETADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Archivos creados:" -ForegroundColor Cyan
Write-Host "   1. database/proxima_refinado.sql" -ForegroundColor Yellow
Write-Host "   2. media_backup.rar (protegido con contraseña)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 Contraseña del RAR: $rarPassPlain" -ForegroundColor Cyan
Write-Host ""
Write-Host "📤 Para subir a GitHub:" -ForegroundColor Cyan
Write-Host "   git add database/proxima_refinado.sql media_backup.rar" -ForegroundColor Yellow
Write-Host "   git commit -m `"Actualizar backup BD + imágenes`"" -ForegroundColor Yellow
Write-Host "   git push" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - La BD está sin contraseña (database/proxima_refinado.sql)" -ForegroundColor White
Write-Host "   - Las imágenes están protegidas (media_backup.rar)" -ForegroundColor White
Write-Host ""
Read-Host "Presiona Enter para salir"
