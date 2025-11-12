# ============================================================
#      ProXimidad - Build Backend
# ============================================================

param(
    [switch]$CreateSuperuser = $false
)

Clear-Host
Write-Host ""
Write-Host "🚀 Building ProXimidad Backend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio backend
if (-not (Test-Path "manage.py")) {
    Write-Host "[ERROR] Ejecuta desde el directorio backend" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Crear entorno virtual si no existe
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Activar entorno virtual
Write-Host "📦 Activando entorno virtual..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Actualizar pip
Write-Host "📦 Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Error instalando desde requirements.txt" -ForegroundColor Yellow
    Write-Host "[i] Instalando paquetes esenciales..." -ForegroundColor Cyan
    pip install Django djangorestframework mysqlclient django-cors-headers Pillow python-decouple djangorestframework-simplejwt django-filter
}

# Ejecutar migraciones
Write-Host "🔄 Ejecutando migraciones..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

# Recolectar archivos estáticos
Write-Host "📂 Recolectando archivos estáticos..." -ForegroundColor Yellow
python manage.py collectstatic --noinput 2>&1 | Out-Null

# Crear superusuario si se solicita
if ($CreateSuperuser) {
    Write-Host "👤 Creando superusuario..." -ForegroundColor Yellow
    
    $pythonCommand = @"
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@proximidad.com', 'admin123')
    print('[OK] Superusuario creado: admin / admin123')
else:
    print('[i] Superusuario admin ya existe')
"@
    
    $pythonCommand | python manage.py shell
}

Write-Host ""
Write-Host "✅ Backend build completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor:" -ForegroundColor Yellow
Write-Host "  python manage.py runserver" -ForegroundColor Cyan
Write-Host ""
Read-Host "Presiona Enter para salir"
