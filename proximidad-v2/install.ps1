# ============================================================
#      ProXimidad - Instalación Automática v2.0 PowerShell
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     ProXimidad - Instalación Automática v2.0" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend")) {
    Write-Host "[ERROR] Ejecuta desde el directorio raíz de proximidad-v2" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Detectar IP local
Write-Host "[Detectando IP...]" -ForegroundColor Yellow
$LOCAL_IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" -and $_.PrefixOrigin -eq "Dhcp" } | Select-Object -First 1).IPAddress

if (-not $LOCAL_IP) {
    # Fallback: intentar obtener cualquier IP que no sea localhost
    $LOCAL_IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
}

if (-not $LOCAL_IP) {
    $LOCAL_IP = "192.168.1.101"
}

Write-Host "[OK] IP detectada: " -NoNewline -ForegroundColor Green
Write-Host $LOCAL_IP -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "¿Usar esta IP? (S/N) [S]"
if ($confirm -eq "N" -or $confirm -eq "n") {
    $LOCAL_IP = Read-Host "Ingresa la IP manualmente"
}
Write-Host ""

# [1/5] Verificar Python y Node.js
Write-Host "[1/5] Verificando requisitos..." -ForegroundColor Yellow
try {
    $pythonVersion = (python --version 2>&1) -replace "`r`n", ""
    Write-Host "[OK] $pythonVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python no está instalado" -ForegroundColor Red
    Write-Host "[INFO] Descarga Python desde: https://www.python.org/downloads/" -ForegroundColor Cyan
    Read-Host "Presiona Enter para salir"
    exit 1
}

try {
    $nodeVersion = (node --version 2>&1) -replace "`r`n", ""
    Write-Host "[OK] Node.js $nodeVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js no está instalado" -ForegroundColor Red
    Write-Host "[INFO] Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Cyan
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host ""

# [2/5] Restaurar imágenes desde backup
Write-Host "[2/5] Restaurando imágenes desde backup..." -ForegroundColor Yellow

# Crear estructura de directorios
$mediaPath = "backend\media"
$usuariosPath = "$mediaPath\usuarios"
$serviciosPath = "$mediaPath\servicios\imagenes"

if (-not (Test-Path $usuariosPath)) { 
    New-Item -ItemType Directory -Path $usuariosPath -Force | Out-Null 
    Write-Host "[i] Creado: $usuariosPath" -ForegroundColor Cyan
}
if (-not (Test-Path $serviciosPath)) { 
    New-Item -ItemType Directory -Path $serviciosPath -Force | Out-Null 
    Write-Host "[i] Creado: $serviciosPath" -ForegroundColor Cyan
}

# Intentar restaurar desde backup RAR o ZIP
$backupRestored = $false

if (Test-Path "media_backup.rar") {
    Write-Host "[i] Backup RAR encontrado" -ForegroundColor Cyan
    
    # Buscar WinRAR o 7-Zip
    $unrarPaths = @(
        "C:\Program Files\WinRAR\UnRAR.exe",
        "C:\Program Files (x86)\WinRAR\UnRAR.exe",
        "C:\Program Files\WinRAR\WinRAR.exe",
        "C:\Program Files (x86)\WinRAR\WinRAR.exe"
    )
    
    $zipPaths = @(
        "C:\Program Files\7-Zip\7z.exe",
        "C:\Program Files (x86)\7-Zip\7z.exe"
    )
    
    $unrarCmd = $unrarPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    $zipCmd = $zipPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    
    if ($unrarCmd) {
        Write-Host "[i] Usando WinRAR: $unrarCmd" -ForegroundColor Cyan
        Write-Host "[i] Extrayendo imágenes con contraseña proximidad_2025..." -ForegroundColor Cyan
        
        # Extraer con WinRAR
        $arguments = @(
            "x",
            "-pproximidad_2025",
            "-o+",
            "-y",
            "media_backup.rar",
            "backend\"
        )
        
        & $unrarCmd $arguments 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Imágenes restauradas desde backup RAR" -ForegroundColor Green
            $backupRestored = $true
        } else {
            Write-Host "[!] Error al extraer backup RAR" -ForegroundColor Yellow
            Write-Host "[!] Verifica la contraseña: proximidad_2025" -ForegroundColor Yellow
        }
        
    } elseif ($zipCmd) {
        Write-Host "[i] Usando 7-Zip: $zipCmd" -ForegroundColor Cyan
        Write-Host "[i] Extrayendo imágenes con contraseña proximidad_2025..." -ForegroundColor Cyan
        
        # Extraer con 7-Zip
        $arguments = @(
            "x",
            "media_backup.rar",
            "-pproximidad_2025",
            "-obackend\",
            "-aoa",
            "-y"
        )
        
        & $zipCmd $arguments 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Imágenes restauradas desde backup RAR" -ForegroundColor Green
            $backupRestored = $true
        } else {
            Write-Host "[!] Error al extraer backup RAR" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "[!] WinRAR/7-Zip no instalado" -ForegroundColor Yellow
        Write-Host "[!] Instala WinRAR o 7-Zip para restaurar imágenes:" -ForegroundColor Yellow
        Write-Host "    - WinRAR: https://www.winrar.es/" -ForegroundColor Cyan
        Write-Host "    - 7-Zip:  https://www.7-zip.org/" -ForegroundColor Cyan
        Write-Host "[!] Luego extrae manualmente media_backup.rar" -ForegroundColor Yellow
        Write-Host "[!] Contraseña: proximidad_2025" -ForegroundColor Yellow
    }
    
} elseif (Test-Path "media_backup.zip") {
    Write-Host "[i] Backup ZIP encontrado" -ForegroundColor Cyan
    Write-Host "[i] Extrayendo imágenes..." -ForegroundColor Cyan
    
    try {
        # Intentar extraer con 7-Zip si tiene contraseña
        $zipCmd = @(
            "C:\Program Files\7-Zip\7z.exe",
            "C:\Program Files (x86)\7-Zip\7z.exe"
        ) | Where-Object { Test-Path $_ } | Select-Object -First 1
        
        if ($zipCmd) {
            $arguments = @("x", "media_backup.zip", "-pproximidad_2025", "-obackend\", "-aoa", "-y")
            & $zipCmd $arguments 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Imágenes restauradas desde backup ZIP" -ForegroundColor Green
                $backupRestored = $true
            }
        }
        
        # Si falla o no hay 7-Zip, intentar con PowerShell nativo
        if (-not $backupRestored) {
            Expand-Archive -Path "media_backup.zip" -DestinationPath "backend\" -Force 2>&1 | Out-Null
            Write-Host "[OK] Imágenes restauradas desde backup ZIP" -ForegroundColor Green
            $backupRestored = $true
        }
    } catch {
        Write-Host "[!] Error al extraer backup ZIP" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "[i] No se encontró backup de imágenes" -ForegroundColor Cyan
    Write-Host "[i] Las carpetas están vacías (normal en primera instalación)" -ForegroundColor Cyan
}

# Crear archivos .gitkeep si no existen
if (-not (Test-Path "$usuariosPath\.gitkeep")) {
    "" | Out-File -FilePath "$usuariosPath\.gitkeep" -Encoding ASCII
}
if (-not (Test-Path "$serviciosPath\.gitkeep")) {
    "" | Out-File -FilePath "$serviciosPath\.gitkeep" -Encoding ASCII
}

Write-Host ""

# [3/5] Configurar Backend
Write-Host "[3/5] Configurando Backend..." -ForegroundColor Yellow
Set-Location backend

# Eliminar entorno virtual anterior si existe
if (Test-Path "venv") {
    Write-Host "[i] Eliminando entorno virtual anterior..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force venv 2>&1 | Out-Null
}

Write-Host "[i] Creando entorno virtual..." -ForegroundColor Cyan
python -m venv venv

Write-Host "[i] Activando entorno virtual..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

Write-Host "[i] Actualizando pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip --quiet 2>&1 | Out-Null

Write-Host "[i] Instalando dependencias..." -ForegroundColor Cyan
pip install -r requirements.txt --quiet 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Error en requirements.txt, instalando paquetes esenciales..." -ForegroundColor Yellow
    $packages = @(
        "Django",
        "djangorestframework",
        "mysqlclient",
        "django-cors-headers",
        "Pillow",
        "python-decouple",
        "djangorestframework-simplejwt",
        "django-filter"
    )
    pip install $packages 2>&1 | Out-Null
}

Write-Host "[OK] Backend configurado" -ForegroundColor Green
Write-Host ""

# [4/5] Configurar Base de Datos
Write-Host "[4/5] Configurando Base de Datos..." -ForegroundColor Yellow
$DB_NAME = Read-Host "Nombre de la base de datos [proximidad]"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "proximidad" }

$DB_USER = Read-Host "Usuario MySQL [root]"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "root" }

$DB_PASSWORD = Read-Host "Contraseña MySQL (dejar vacío si no tiene)"

# Crear local_settings.py
$localSettings = @"
# Auto-generado con IP: $LOCAL_IP
import os

# Base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '$DB_NAME',
        'USER': '$DB_USER',
        'PASSWORD': '$DB_PASSWORD',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4'
        }
    }
}

# Media
MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media')
MEDIA_URL = '/media/'

# Desarrollo
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '$LOCAL_IP', '*']

# CORS - Permitir frontend
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
"@

$localSettings | Out-File -FilePath "core\local_settings.py" -Encoding UTF8

Write-Host "[i] Ejecutando migraciones..." -ForegroundColor Cyan
python manage.py makemigrations 2>&1 | Out-Null
python manage.py migrate 2>&1

deactivate 2>&1 | Out-Null
Set-Location ..

Write-Host "[OK] Base de datos configurada" -ForegroundColor Green
Write-Host ""

# [5/5] Configurar Frontend
Write-Host "[5/5] Configurando Frontend..." -ForegroundColor Yellow
Set-Location frontend

Write-Host "[i] Instalando dependencias de Node.js..." -ForegroundColor Cyan
npm install --silent 2>&1 | Out-Null

# Crear .env para frontend
"VITE_API_BASE_URL=http://${LOCAL_IP}:8000/api" | Out-File -FilePath ".env" -Encoding UTF8

Set-Location ..
Write-Host "[OK] Frontend configurado" -ForegroundColor Green
Write-Host ""

# Crear script de inicio PowerShell
Write-Host "[i] Creando scripts de inicio..." -ForegroundColor Cyan

$startPS = @"
# ============================================================
#      ProXimidad - Inicio del Sistema
# ============================================================

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     Iniciando ProXimidad" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IP Local: $LOCAL_IP" -ForegroundColor Yellow
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]`$Port)
    `$connection = New-Object System.Net.Sockets.TcpClient
    try {
        `$connection.Connect("localhost", `$Port)
        `$connection.Close()
        return `$true
    } catch {
        return `$false
    }
}

# Verificar puertos
if (Test-Port 8000) {
    Write-Host "[!] El puerto 8000 ya está en uso" -ForegroundColor Yellow
    Write-Host "[!] Cierra el servidor backend existente o cambia el puerto" -ForegroundColor Yellow
}

if (Test-Port 5173) {
    Write-Host "[!] El puerto 5173 ya está en uso" -ForegroundColor Yellow
    Write-Host "[!] Cierra el servidor frontend existente o cambia el puerto" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[1/2] Iniciando Backend Django..." -ForegroundColor Yellow

# Iniciar Backend en nueva ventana PowerShell
`$backendScript = @'
Set-Location backend
.\venv\Scripts\Activate.ps1
Write-Host "Backend corriendo en http://$LOCAL_IP:8000" -ForegroundColor Green
python manage.py runserver $LOCAL_IP:8000
'@

Start-Process powershell -ArgumentList "-NoExit", "-Command", `$backendScript

Start-Sleep -Seconds 4

Write-Host "[2/2] Iniciando Frontend React..." -ForegroundColor Yellow

# Iniciar Frontend en nueva ventana PowerShell
`$frontendScript = @'
Set-Location frontend
Write-Host "Frontend corriendo en http://$LOCAL_IP:5173" -ForegroundColor Green
npm run dev -- --host $LOCAL_IP
'@

Start-Process powershell -ArgumentList "-NoExit", "-Command", `$frontendScript

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     Servidores Activos" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://$LOCAL_IP:8000" -ForegroundColor Cyan
Write-Host "Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://$LOCAL_IP:5173" -ForegroundColor Cyan
Write-Host "Admin:    " -NoNewline -ForegroundColor White
Write-Host "http://$LOCAL_IP:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener los servidores, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para cerrar este launcher"
"@

$startPS | Out-File -FilePath "start.ps1" -Encoding UTF8

Write-Host "[OK] Script de inicio creado: start.ps1" -ForegroundColor Green
Write-Host ""

# Mostrar resumen final
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "          INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuración:" -ForegroundColor White
Write-Host "  IP Local:  " -NoNewline
Write-Host $LOCAL_IP -ForegroundColor Yellow
Write-Host "  Backend:   " -NoNewline
Write-Host "http://$LOCAL_IP:8000" -ForegroundColor Cyan
Write-Host "  Frontend:  " -NoNewline
Write-Host "http://$LOCAL_IP:5173" -ForegroundColor Cyan
Write-Host "  Admin:     " -NoNewline
Write-Host "http://$LOCAL_IP:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Scripts disponibles:" -ForegroundColor White
Write-Host "  .\start.ps1                 " -NoNewline -ForegroundColor Cyan
Write-Host "- Iniciar el sistema" -ForegroundColor Gray
Write-Host "  .\crear_backup_media.ps1    " -NoNewline -ForegroundColor Cyan
Write-Host "- Crear backup de imágenes" -ForegroundColor Gray
Write-Host ""

if ($backupRestored) {
    Write-Host "[OK] Imágenes restauradas correctamente" -ForegroundColor Green
} else {
    Write-Host "[i] Sistema instalado sin imágenes (carpetas vacías)" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Presiona Enter para salir"
