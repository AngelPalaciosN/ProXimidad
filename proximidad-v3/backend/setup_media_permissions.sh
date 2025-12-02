#!/bin/bash
# Script para configurar permisos correctos para media e imágenes
# ProXimidad Backend - Raspberry Pi

echo "🔧 Configurando directorios y permisos para media e imágenes..."

# Obtener el directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Crear directorios si no existen
echo "📁 Creando directorios..."
mkdir -p media/servicios/imagenes
mkdir -p media/usuarios
mkdir -p staticfiles

# Configurar permisos
echo "🔐 Configurando permisos..."

# Cambiar propietario (ajusta 'pi' por tu usuario si es diferente)
USER=$(whoami)
sudo chown -R $USER:www-data media
sudo chown -R $USER:www-data staticfiles

# Establecer permisos
# 775 = rwxrwxr-x (owner y group pueden leer/escribir/ejecutar)
sudo chmod -R 775 media
sudo chmod -R 775 staticfiles

# Asegurar que los nuevos archivos hereden los permisos del grupo
sudo chmod g+s media
sudo chmod g+s media/servicios
sudo chmod g+s media/servicios/imagenes
sudo chmod g+s media/usuarios

echo "✅ Permisos configurados correctamente!"
echo ""
echo "📋 Estado actual:"
ls -la media/
echo ""
ls -la media/servicios/
echo ""
ls -la media/servicios/imagenes/
echo ""
ls -la media/usuarios/
echo ""
echo "✨ Listo! Ahora Django puede subir imágenes y Nginx puede servirlas."
