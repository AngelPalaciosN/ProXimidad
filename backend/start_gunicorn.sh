#!/bin/bash

# Script para iniciar Gunicorn - ProXimidad Backend

# Activar el entorno virtual
source venv/bin/activate

# Navegar al directorio del proyecto
cd "$(dirname "$0")"

# Exportar variables de entorno (opcional, si usas .env)
# export DJANGO_SETTINGS_MODULE=core.settings

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py migrate --noinput

# Iniciar Gunicorn
echo "Iniciando Gunicorn..."
gunicorn core.wsgi:application \
    --config gunicorn_config.py \
    --bind 127.0.0.1:8000
