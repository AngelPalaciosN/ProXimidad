@echo off
REM Script para activar el entorno virtual de ProXimidad
REM SOLO usar el venv de backend/venv/

echo ============================================
echo Activando entorno virtual de ProXimidad
echo ============================================
echo.

cd backend
call venv\Scripts\activate.bat

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Entorno virtual activado correctamente
    echo Ruta: %CD%\venv
    echo.
    echo Puedes ejecutar:
    echo   - py manage.py runserver 192.168.0.100:8000
    echo   - py manage.py migrate
    echo   - py manage.py createsuperuser
    echo.
) else (
    echo.
    echo [ERROR] No se pudo activar el entorno virtual
    echo Verifica que existe la carpeta backend\venv
    echo.
)
