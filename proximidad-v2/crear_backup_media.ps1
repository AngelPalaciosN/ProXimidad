# ============================================================
#      ProXimidad - Crear Backup de Imágenes
# ============================================================
# Este script crea un archivo RAR protegido con contraseña
# conteniendo todas las imágenes de backend/media

param(
    [string]$OutputFile = "media_backup.rar",
    [string]$Password = "proximidad_2025"
)

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Crear Backup de Imágenes" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend\media")) {
    Write-Host "[ERROR] No se encuentra backend\media" -ForegroundColor Red
    Write-Host "[ERROR] Ejecuta desde el directorio raíz de proximidad-v2" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si hay imágenes para respaldar
$imageCount = (Get-ChildItem -Path "backend\media" -Recurse -File -Exclude ".gitkeep" | Measure-Object).Count

if ($imageCount -eq 0) {
    Write-Host "[!] No hay imágenes para respaldar (solo archivos .gitkeep)" -ForegroundColor Yellow
    $continue = Read-Host "¿Crear backup vacío de todas formas? (S/N) [N]"
    if ($continue -ne "S" -and $continue -ne "s") {
        Write-Host "[INFO] Operación cancelada" -ForegroundColor Cyan
        exit 0
    }
}

Write-Host "[i] Imágenes encontradas: $imageCount" -ForegroundColor Cyan
Write-Host ""

# Buscar WinRAR o 7-Zip
$rarPaths = @(
    "C:\Program Files\WinRAR\WinRAR.exe",
    "C:\Program Files (x86)\WinRAR\WinRAR.exe",
    "C:\Program Files\WinRAR\Rar.exe",
    "C:\Program Files (x86)\WinRAR\Rar.exe"
)

$zipPaths = @(
    "C:\Program Files\7-Zip\7z.exe",
    "C:\Program Files (x86)\7-Zip\7z.exe"
)

$rarCmd = $rarPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
$zipCmd = $zipPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($rarCmd) {
    Write-Host "[OK] WinRAR encontrado: $rarCmd" -ForegroundColor Green
    Write-Host "[i] Creando backup RAR con contraseña..." -ForegroundColor Cyan
    Write-Host ""
    
    # Eliminar backup anterior si existe
    if (Test-Path $OutputFile) {
        Write-Host "[i] Eliminando backup anterior..." -ForegroundColor Yellow
        Remove-Item $OutputFile -Force
    }
    
    # Crear archivo RAR con contraseña
    # Parámetros:
    # a = agregar archivos
    # -r = recursivo
    # -ep1 = excluir ruta base (backend)
    # -hp = contraseña y encriptar nombres de archivo
    # -m5 = máxima compresión
    # -ma5 = formato RAR5
    
    $arguments = @(
        "a",
        "-r",
        "-ep1",
        "-hp$Password",
        "-m5",
        "-ma5",
        $OutputFile,
        "backend\media\*"
    )
    
    & $rarCmd $arguments
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $OutputFile)) {
        $fileSize = (Get-Item $OutputFile).Length / 1MB
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "     BACKUP CREADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Archivo:     $OutputFile" -ForegroundColor Cyan
        Write-Host "Tamaño:      $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
        Write-Host "Contraseña:  $Password" -ForegroundColor Yellow
        Write-Host "Imágenes:    $imageCount archivos" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "[OK] El backup puede ser compartido sin exponer las imágenes" -ForegroundColor Green
        Write-Host "[OK] Las imágenes NO deben subirse al repositorio Git" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Falló la creación del backup RAR" -ForegroundColor Red
        exit 1
    }
    
} elseif ($zipCmd) {
    Write-Host "[!] WinRAR no encontrado, usando 7-Zip" -ForegroundColor Yellow
    Write-Host "[i] 7-Zip: $zipCmd" -ForegroundColor Cyan
    Write-Host "[i] Creando backup ZIP con contraseña..." -ForegroundColor Cyan
    Write-Host ""
    
    # Eliminar backup anterior si existe
    $zipFile = $OutputFile -replace "\.rar$", ".zip"
    if (Test-Path $zipFile) {
        Write-Host "[i] Eliminando backup anterior..." -ForegroundColor Yellow
        Remove-Item $zipFile -Force
    }
    
    # Crear archivo ZIP con contraseña usando 7-Zip
    $arguments = @(
        "a",
        "-tzip",
        "-p$Password",
        "-mem=AES256",
        "-mx=9",
        $zipFile,
        "backend\media\*",
        "-r"
    )
    
    & $zipCmd $arguments | Out-Null
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $zipFile)) {
        $fileSize = (Get-Item $zipFile).Length / 1MB
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "     BACKUP CREADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Archivo:     $zipFile" -ForegroundColor Cyan
        Write-Host "Tamaño:      $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
        Write-Host "Contraseña:  $Password" -ForegroundColor Yellow
        Write-Host "Imágenes:    $imageCount archivos" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "[!] NOTA: Se creó ZIP en lugar de RAR" -ForegroundColor Yellow
        Write-Host "[OK] Las imágenes NO deben subirse al repositorio Git" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Falló la creación del backup ZIP" -ForegroundColor Red
        exit 1
    }
    
} else {
    Write-Host "[ERROR] No se encontró WinRAR ni 7-Zip" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala una de estas herramientas:" -ForegroundColor Yellow
    Write-Host "  - WinRAR: https://www.winrar.es/" -ForegroundColor Cyan
    Write-Host "  - 7-Zip:  https://www.7-zip.org/" -ForegroundColor Cyan
    Write-Host ""
    
    # Opción de fallback con ZIP nativo de PowerShell (sin contraseña)
    $useFallback = Read-Host "¿Crear backup ZIP sin contraseña como alternativa? (S/N) [N]"
    
    if ($useFallback -eq "S" -or $useFallback -eq "s") {
        $zipFile = "media_backup_sin_password.zip"
        Write-Host "[i] Creando backup ZIP sin contraseña..." -ForegroundColor Yellow
        
        if (Test-Path $zipFile) {
            Remove-Item $zipFile -Force
        }
        
        Compress-Archive -Path "backend\media\*" -DestinationPath $zipFile -CompressionLevel Optimal -Force
        
        if (Test-Path $zipFile) {
            $fileSize = (Get-Item $zipFile).Length / 1MB
            Write-Host ""
            Write-Host "[OK] Backup creado: $zipFile" -ForegroundColor Green
            Write-Host "[OK] Tamaño: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "[!] ADVERTENCIA: Este backup NO tiene contraseña" -ForegroundColor Yellow
            Write-Host "[!] Las imágenes están accesibles sin protección" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[INFO] Operación cancelada" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Read-Host "Presiona Enter para salir"
