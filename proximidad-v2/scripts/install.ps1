# ============================================================
#      ProXimidad - Instalación Automática v2.1
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Instalación Automática v2.1" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar a la raíz del proyecto
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $PROJECT_ROOT

if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "[ERROR] Este script debe ejecutarse desde scripts/" -ForegroundColor Red
    Write-Host "        Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# ============================================================
# FUNCIÓN: Detectar IP usando ver_ip.ps1
# ============================================================
function Get-LocalIP {
    $verIpScript = Join-Path $PSScriptRoot "ver_ip.ps1"
    if (Test-Path $verIpScript) {
        Write-Host "[INFO] Usando ver_ip.ps1 para detectar IP..." -ForegroundColor Yellow
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

# ============================================================
# [1/7] VERIFICAR REQUISITOS
# ============================================================
Write-Host "[1/7] Verificando requisitos previos..." -ForegroundColor Cyan

Write-Host "`n[Python]" -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python (\d+)\.(\d+)") {
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        if ($major -ge 3 -and $minor -ge 8) {
            Write-Host "[OK] $pythonVersion" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Se requiere Python 3.8+" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "[ERROR] Python no instalado" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Node.js]" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(\d+)") {
        if ([int]$Matches[1] -ge 16) {
            Write-Host "[OK] Node.js $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Se requiere Node.js 16+" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "[ERROR] Node.js no instalado" -ForegroundColor Red
    exit 1
}

Write-Host "`n[MySQL]" -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version 2>&1
    Write-Host "[OK] MySQL detectado" -ForegroundColor Green
} catch {
    Write-Host "[WARN] MySQL no detectado en PATH" -ForegroundColor Yellow
}

# ============================================================
# [2/7] DETECTAR IP
# ============================================================
Write-Host "`n[2/7] Detectando IP..." -ForegroundColor Cyan
$LOCAL_IP = Get-LocalIP

if (-not $LOCAL_IP) {
    $LOCAL_IP = Read-Host "No se detectó IP. Ingrésala manualmente"
}

Write-Host "[OK] IP: $LOCAL_IP" -ForegroundColor Green

# ============================================================
# [3/7] RESTAURAR BACKUP
# ============================================================
Write-Host "`n[3/7] Restaurando imágenes..." -ForegroundColor Cyan

$backupFiles = @("media.rar", "media.zip", "media_backup.rar", "media_backup.zip")
$backupFound = $false

foreach ($file in $backupFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] Encontrado: $file" -ForegroundColor Green
        $password = Read-Host "Contraseña del backup" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        )
        
        Write-Host "[INFO] Extrayendo..." -ForegroundColor Yellow
        
        if ($file -like "*.rar") {
            $rarPath = "C:\Program Files\WinRAR\UnRAR.exe"
            if (Test-Path $rarPath) {
                & $rarPath x -p"$passwordPlain" "$file" "backend\media\" -y 2>&1 | Out-Null
                Write-Host "[OK] Imágenes restauradas" -ForegroundColor Green
                $backupFound = $true
                break
            }
        }
    }
}

if (-not $backupFound) {
    Write-Host "[WARN] Sin backup de imágenes" -ForegroundColor Yellow
}

# Crear directorios
New-Item -ItemType Directory -Force -Path "backend\media\usuarios" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\media\servicios\imagenes" | Out-Null

# ============================================================
# [4/7] BACKEND
# ============================================================
Write-Host "`n[4/7] Configurando Backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "[INFO] Instalando dependencias..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

Write-Host "[OK] Dependencias instaladas" -ForegroundColor Green

# Configurar local_settings.py
Write-Host "[INFO] Configurando Django..." -ForegroundColor Yellow
$localSettings = @"
# Configuración local generada automáticamente
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proxima',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://$($LOCAL_IP):5173",
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Debug
DEBUG = True
ALLOWED_HOSTS = ['*']
"@

Set-Content -Path "core\local_settings.py" -Value $localSettings -Encoding UTF8

# ============================================================
# [5/7] BASE DE DATOS
# ============================================================
Write-Host "`n[5/7] Configurando Base de Datos..." -ForegroundColor Cyan

# Verificar que MySQL esté corriendo
Write-Host "[INFO] Verificando MySQL..." -ForegroundColor Yellow
try {
    $mysqlTest = mysql --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] MySQL no está en PATH" -ForegroundColor Red
        Write-Host "[INFO] Inicia Laragon y asegúrate de que MySQL esté corriendo" -ForegroundColor Yellow
        Read-Host "`nPresiona Enter para salir"
        exit 1
    }
} catch {
    Write-Host "[ERROR] MySQL no está disponible" -ForegroundColor Red
    Write-Host "[INFO] Inicia Laragon primero" -ForegroundColor Yellow
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Solicitar credenciales
$dbUser = Read-Host "Usuario MySQL [root]"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }

$dbPass = Read-Host "Contraseña MySQL (dejar vacío si no tiene)" -AsSecureString
$dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass)
)

# Probar conexión
Write-Host "[INFO] Probando conexión..." -ForegroundColor Yellow
try {
    if ($dbPassPlain) {
        $testConnection = echo "SELECT 1;" | mysql -u $dbUser -p"$dbPassPlain" 2>&1
    } else {
        $testConnection = echo "SELECT 1;" | mysql -u $dbUser 2>&1
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] No se pudo conectar a MySQL" -ForegroundColor Red
        Write-Host "[INFO] Verifica usuario/contraseña o inicia Laragon" -ForegroundColor Yellow
        Read-Host "`nPresiona Enter para salir"
        exit 1
    }
    Write-Host "[OK] Conexión exitosa" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error de conexión MySQL" -ForegroundColor Red
    Read-Host "`nPresiona Enter para salir"
    exit 1
}

# Importar SQL desde database/
Write-Host "[INFO] Buscando archivo SQL..." -ForegroundColor Yellow
Set-Location ..

$sqlFiles = @("database\proxima_refinado.sql", "database\proxima.sql")
$sqlImported = $false

foreach ($sqlFile in $sqlFiles) {
    if (Test-Path $sqlFile) {
        Write-Host "[OK] Encontrado: $sqlFile" -ForegroundColor Green
        Write-Host "[INFO] Importando base de datos 'proxima' (puede tardar 1-2 min)..." -ForegroundColor Yellow
        
        try {
            # Usar redirección CMD para importar SQL correctamente
            if ($dbPassPlain) {
                cmd /c "mysql -u $dbUser -p$dbPassPlain < $sqlFile 2>&1"
            } else {
                cmd /c "mysql -u $dbUser < $sqlFile 2>&1"
            }
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Base de datos 'proxima' importada correctamente" -ForegroundColor Green
                $sqlImported = $true
                break
            } else {
                Write-Host "[WARN] Error al importar $sqlFile" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "[WARN] No se pudo importar $sqlFile" -ForegroundColor Yellow
        }
    }
}

if (-not $sqlImported) {
    Write-Host "[ERROR] No se encontró ningún archivo SQL en database/" -ForegroundColor Red
    Write-Host "[INFO] Archivos esperados: proxima_refinado.sql o proxima.sql" -ForegroundColor Yellow
    Read-Host "`nPresiona Enter para continuar sin base de datos"
}

Set-Location backend

# Actualizar local_settings con credenciales
(Get-Content "core\local_settings.py") -replace "'NAME': 'proximidad_db',", "'NAME': 'proxima'," | Set-Content "core\local_settings.py"
(Get-Content "core\local_settings.py") -replace "'PASSWORD': '',", "'PASSWORD': '$dbPassPlain'," | Set-Content "core\local_settings.py"

Write-Host "[INFO] Ejecutando migraciones Django..." -ForegroundColor Yellow
python manage.py migrate --no-input 2>&1 | Out-Null
Write-Host "[OK] Migraciones aplicadas" -ForegroundColor Green

Set-Location ..

# ============================================================
# [6/7] FRONTEND
# ============================================================
Write-Host "`n[6/7] Configurando Frontend..." -ForegroundColor Cyan
Set-Location frontend

Write-Host "[INFO] Instalando dependencias..." -ForegroundColor Yellow
npm install --silent

# Actualizar baseline-browser-mapping
Write-Host "[INFO] Actualizando baseline-browser-mapping..." -ForegroundColor Yellow
npm install baseline-browser-mapping@latest -D --silent

# Configurar .env
$envContent = @"
VITE_API_URL=http://$($LOCAL_IP):8000
"@
Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "[OK] Frontend configurado" -ForegroundColor Green

Set-Location ..

# ============================================================
# [7/7] ACTUALIZAR START.PS1
# ============================================================
Write-Host "`n[7/7] Actualizando start.ps1..." -ForegroundColor Cyan

$startScript = Join-Path $PSScriptRoot "start.ps1"
$startContent = Get-Content $startScript -Raw
$startContent = $startContent -replace 'LOCAL_IP = ".*"', "LOCAL_IP = `"$LOCAL_IP`""
Set-Content -Path $startScript -Value $startContent -Encoding UTF8

Write-Host "[OK] start.ps1 actualizado" -ForegroundColor Green

# ============================================================
# FINALIZACIÓN
# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     ✅ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar el proyecto:" -ForegroundColor Cyan
Write-Host "   cd scripts" -ForegroundColor Yellow
Write-Host "   .\start.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 La aplicación estará disponible en:" -ForegroundColor Cyan
Write-Host "   Frontend: http://$($LOCAL_IP):5173" -ForegroundColor Yellow
Write-Host "   Backend:  http://$($LOCAL_IP):8000" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para salir"
