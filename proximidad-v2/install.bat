@echo off
setlocal enabledelayedexpansion
cls
echo.
echo ============================================================
echo      ProXimidad - Instalacion Automatica v2.0
echo ============================================================
echo.

if not exist "backend" (
    echo [ERROR] Ejecuta desde el directorio raiz
    pause
    exit /b 1
)

REM Detectar IP
echo [Detectando IP...]
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set "TEMP_IP=%%a"
    goto :found
)
:found
set "LOCAL_IP=%TEMP_IP: =%"
if "%LOCAL_IP%"=="" set "LOCAL_IP=192.168.1.101"
echo [OK] IP: %LOCAL_IP%
echo.
set /p CONFIRM="Usar esta IP? (S/N) [S]: "
if "%CONFIRM%"=="" set "CONFIRM=S"
if /i "%CONFIRM%"=="N" set /p LOCAL_IP="IP manual: "
echo.

echo [1/5] Verificando...
python --version >nul 2>&1 || (echo [ERROR] Python no instalado & pause & exit /b 1)
node --version >nul 2>&1 || (echo [ERROR] Node.js no instalado & pause & exit /b 1)
echo [OK] Python y Node.js OK
echo.

echo [2/5] Imagenes...
if not exist "backend\media\usuarios" mkdir "backend\media\usuarios"
if not exist "backend\media\servicios\imagenes" mkdir "backend\media\servicios\imagenes"
if exist "media_backup.zip" powershell -command "Expand-Archive -Path 'media_backup.zip' -DestinationPath 'backend\' -Force" 2>nul
echo [OK] Carpetas OK
echo.

echo [3/5] Backend...
cd backend
if exist "venv" rmdir /s /q venv
python -m venv venv
call venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt
if %errorLevel% neq 0 pip install Django djangorestframework mysqlclient django-cors-headers Pillow python-decouple djangorestframework-simplejwt django-filter
echo [OK] Backend OK
echo.

echo [4/5] Base de datos...
set /p DB_NAME="BD [proximidad]: "
if "%DB_NAME%"=="" set "DB_NAME=proximidad"
set /p DB_USER="Usuario [root]: "
if "%DB_USER%"=="" set "DB_USER=root"
set /p DB_PASSWORD="Contrasena: "
(
echo # Auto-generado con IP: %LOCAL_IP%
echo import os
echo.
echo # Base de datos
echo DATABASES = {
echo     'default': {
echo         'ENGINE': 'django.db.backends.mysql',
echo         'NAME': '%DB_NAME%',
echo         'USER': '%DB_USER%',
echo         'PASSWORD': '%DB_PASSWORD%',
echo         'HOST': 'localhost',
echo         'PORT': '3306',
echo         'OPTIONS': {
echo             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
echo             'charset': 'utf8mb4'
echo         }
echo     }
echo }
echo.
echo # Media
echo MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__^)^), 'media'^)
echo MEDIA_URL = '/media/'
echo.
echo # Desarrollo
echo DEBUG = True
echo ALLOWED_HOSTS = ['localhost', '127.0.0.1', '%LOCAL_IP%', '*']
echo.
echo # CORS - Permitir frontend
echo CORS_ALLOW_ALL_ORIGINS = True
echo CORS_ALLOW_CREDENTIALS = True
) > core\local_settings.py
python manage.py makemigrations 2>nul
python manage.py migrate
call venv\Scripts\deactivate.bat 2>nul
cd ..
echo [OK] BD OK
echo.

echo [5/5] Frontend...
cd frontend
call npm install --silent 2>nul
echo VITE_API_BASE_URL=http://%LOCAL_IP%:8000 > .env
cd ..
echo [OK] Frontend OK
echo.

if not exist "scripts" mkdir "scripts"

(
echo @echo off
echo title ProXimidad
echo cls
echo Iniciando con IP: %LOCAL_IP%
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver %LOCAL_IP%:8000"
timeout /t 3 /nobreak ^>nul
start "Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Backend:  http://%LOCAL_IP%:8000
echo Frontend: http://localhost:5173
pause ^>nul
) > start.bat

(
echo @echo off
echo cls
echo Creando backup...
powershell -command "Compress-Archive -Path 'backend\media\*' -DestinationPath 'media_backup.zip' -Force"
echo [OK] media_backup.zip creado
pause
) > scripts\backup.bat

echo.
echo ============================================================
echo           INSTALACION COMPLETADA
echo ============================================================
echo.
echo IP Local: %LOCAL_IP%
echo Backend:  http://%LOCAL_IP%:8000
echo Frontend: http://localhost:5173
echo.
echo Ejecuta: start.bat
echo.
pause
