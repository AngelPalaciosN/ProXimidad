@echo off
setlocal enabledelayedexpansion
title ProXimidad - Informacion de Red
cls
echo.
echo ============================================================
echo      ProXimidad - Informacion de Red
echo ============================================================
echo.

REM Detectar todas las IPs IPv4
echo [IPs DETECTADAS]
echo.
set COUNT=0
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "IP=%%a"
    set "IP=!IP: =!"
    if not "!IP!"=="" (
        set /a COUNT+=1
        echo   !COUNT!. !IP!
    )
)

if %COUNT% equ 0 (
    echo   No se detectaron IPs
    echo.
) else (
    echo.
)

REM Leer configuracion actual si existe
if exist "backend\core\local_settings.py" (
    echo [CONFIGURACION ACTUAL BACKEND]
    echo.
    findstr /C:"# IP detectada:" "backend\core\local_settings.py" 2>nul
    echo.
)

if exist "frontend\.env" (
    echo [CONFIGURACION ACTUAL FRONTEND]
    echo.
    type "frontend\.env" 2>nul
    echo.
)

REM Mostrar URLs de acceso
echo ============================================================
echo [ACCESO AL SISTEMA]
echo ============================================================
echo.
echo Si la IP cambio, las URLs actuales son:
echo.

REM Intentar obtener IP del .env
for /f "tokens=2 delims=/" %%a in ('findstr "VITE_API_BASE_URL" "frontend\.env" 2^>nul') do (
    set "DETECTED_IP=%%a"
    set "DETECTED_IP=!DETECTED_IP::8000=!"
    echo   Backend:  http://!DETECTED_IP!:8000
    echo   Frontend: http://!DETECTED_IP!:5173
    echo   Admin:    http://!DETECTED_IP!:8000/admin
    echo   API:      http://!DETECTED_IP!:8000/api
    goto :end_urls
)

echo   [No se pudo detectar la configuracion]
echo   Ejecuta install.bat para configurar
:end_urls

echo.
echo ============================================================
echo [ACCIONES]
echo ============================================================
echo.
echo Si la IP cambio:
echo   1. Ejecuta: install.bat
echo   2. Selecciona la nueva IP
echo   3. Reinicia con: start.bat
echo.

pause
