# Comando para crear migración
# python manage.py makemigrations proxiApp

# Comando para aplicar migración
# python manage.py migrate

# SQL para agregar el campo manualmente si es necesario:
# ALTER TABLE servicios ADD COLUMN imagen VARCHAR(100) DEFAULT NULL;

# Script para migración manual si no se puede usar Django migrations:
"""
USE proxima;
ALTER TABLE servicios ADD COLUMN imagen VARCHAR(100) DEFAULT NULL AFTER imagen_url;
"""