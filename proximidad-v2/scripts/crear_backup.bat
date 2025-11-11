@echo off
title ProXimidad - Crear Backup de Imagenes
cls
echo.
echo ============================================================
echo      Crear Backup de Imagenes
echo ============================================================
echo.
echo Este script crea media_backup.rar con contrasena
echo Contrasena: proximidad_2025
echo.

cd ..

REM Verificar que existe la carpeta media
if not exist "backend\media" (
    echo [ERROR] No existe la carpeta backend\media
    pause
    exit /b 1
)

echo [i] Buscando WinRAR o 7-Zip...
echo.

REM =============================================================
REM Buscar WinRAR en rutas comunes de Windows
REM =============================================================
set "RAR_CMD="

REM 1. Verificar si esta en PATH
where rar >nul 2>&1
if %errorLevel% equ 0 (
    set "RAR_CMD=rar"
    echo [OK] WinRAR encontrado en PATH
    goto :found_rar
)

REM 2. Buscar en Program Files (x64)
if exist "C:\Program Files\WinRAR\rar.exe" (
    set "RAR_CMD=C:\Program Files\WinRAR\rar.exe"
    echo [OK] WinRAR encontrado en Program Files
    goto :found_rar
)

REM 3. Buscar en Program Files (x86)
if exist "C:\Program Files (x86)\WinRAR\rar.exe" (
    set "RAR_CMD=C:\Program Files (x86)\WinRAR\rar.exe"
    echo [OK] WinRAR encontrado en Program Files (x86)
    goto :found_rar
)

REM 4. Buscar en carpeta de usuario (instalacion portable)
if exist "%USERPROFILE%\WinRAR\rar.exe" (
    set "RAR_CMD=%USERPROFILE%\WinRAR\rar.exe"
    echo [OK] WinRAR encontrado en carpeta de usuario
    goto :found_rar
)

REM 5. Buscar en AppData del usuario
if exist "%APPDATA%\WinRAR\rar.exe" (
    set "RAR_CMD=%APPDATA%\WinRAR\rar.exe"
    echo [OK] WinRAR encontrado en AppData
    goto :found_rar
)

REM 6. Buscar en ProgramData
if exist "%ProgramData%\WinRAR\rar.exe" (
    set "RAR_CMD=%ProgramData%\WinRAR\rar.exe"
    echo [OK] WinRAR encontrado en ProgramData
    goto :found_rar
)

echo [!] WinRAR no encontrado
echo.

REM =============================================================
REM Buscar 7-Zip como alternativa
REM =============================================================
set "ZIP_CMD="

REM 1. Verificar si esta en PATH
where 7z >nul 2>&1
if %errorLevel% equ 0 (
    set "ZIP_CMD=7z"
    echo [OK] 7-Zip encontrado en PATH
    goto :found_7z
)

REM 2. Buscar en Program Files (x64)
if exist "C:\Program Files\7-Zip\7z.exe" (
    set "ZIP_CMD=C:\Program Files\7-Zip\7z.exe"
    echo [OK] 7-Zip encontrado en Program Files
    goto :found_7z
)

REM 3. Buscar en Program Files (x86)
if exist "C:\Program Files (x86)\7-Zip\7z.exe" (
    set "ZIP_CMD=C:\Program Files (x86)\7-Zip\7z.exe"
    echo [OK] 7-Zip encontrado en Program Files (x86)
    goto :found_7z
)

REM 4. Buscar en carpeta de usuario
if exist "%USERPROFILE%\7-Zip\7z.exe" (
    set "ZIP_CMD=%USERPROFILE%\7-Zip\7z.exe"
    echo [OK] 7-Zip encontrado en carpeta de usuario
    goto :found_7z
)

echo [!] 7-Zip no encontrado
echo.

REM =============================================================
REM ERROR: Ningun compresor encontrado
REM =============================================================
if "%RAR_CMD%"=="" if "%ZIP_CMD%"=="" (
    echo ============================================================
    echo      ERROR - Compresor Requerido
    echo ============================================================
    echo.
    echo [X] No se encontro WinRAR ni 7-Zip instalado
    echo.
    echo Las imagenes son datos SENSIBLES y DEBEN estar protegidas
    echo con contrasena antes de subirlas a GitHub.
    echo.
    echo Por seguridad, este script NO creara un ZIP sin proteccion.
    echo.
    echo [SOLUCION] Instala uno de estos programas:
    echo.
    echo   1. WinRAR ^(Recomendado^):
    echo      https://www.winrar.es/
    echo      Descarga e instala, luego ejecuta este script nuevamente
    echo.
    echo   2. 7-Zip ^(Gratis^):
    echo      https://www.7-zip.org/
    echo      Descarga e instala, luego ejecuta este script nuevamente
    echo.
    echo NOTA: Despues de instalar, cierra y vuelve a abrir esta ventana
    echo.
    pause
    exit /b 1
)

REM =============================================================
REM Crear backup con WinRAR
REM =============================================================
:found_rar
if not "%RAR_CMD%"=="" (
    echo.
    echo [i] Creando backup con WinRAR...
    if exist "media_backup.rar" del /q media_backup.rar
    
    echo [i] Comprimiendo con contrasena: proximidad_2025
    echo [i] Esto puede tardar unos segundos...
    echo.
    
    REM Cambiar a carpeta backend y comprimir manteniendo estructura media/*
    cd backend
    "%RAR_CMD%" a -hpproximidad_2025 -r ..\media_backup.rar media\usuarios\* media\servicios\*
    cd ..
    goto :check_result
)

REM =============================================================
REM Crear backup con 7-Zip
REM =============================================================
:found_7z
if not "%ZIP_CMD%"=="" (
    echo.
    echo [i] Creando backup con 7-Zip...
    if exist "media_backup.rar" del /q media_backup.rar
    
    echo [i] Comprimiendo con contrasena: proximidad_2025
    echo [i] Esto puede tardar unos segundos...
    echo.
    
    REM Cambiar a carpeta backend y comprimir manteniendo estructura media/*
    cd backend
    "%ZIP_CMD%" a -t7z -pproximidad_2025 -mhe=on ..\media_backup.rar media\usuarios\* media\servicios\*
    cd ..
    goto :check_result
)

:check_result
echo.

if %errorLevel% equ 0 (
    echo.
    echo ============================================================
    echo      BACKUP CREADO EXITOSAMENTE
    echo ============================================================
    echo.
    echo Archivo: media_backup.rar
    echo Contrasena: proximidad_2025
    echo Protegido: SI
    echo.
    echo IMPORTANTE: Sube este archivo a GitHub
    echo.
    echo Comandos:
    echo   git add media_backup.rar
    echo   git commit -m "Actualizar backup de imagenes"
    echo   git push
    echo.
) else (
    echo.
    echo [ERROR] Fallo al crear backup
    echo.
)

pause
