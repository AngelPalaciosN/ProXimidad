# Comandos Útiles para ProXimidad

## Comandos de Django

### Gestión de Base de Datos
```bash
# Crear migraciones (después de cambios en models.py)
python manage.py makemigrations proxiApp

# Aplicar migraciones
python manage.py migrate

# Ver migraciones pendientes
python manage.py showmigrations

# Crear superusuario
python manage.py createsuperuser

# Shell de Django
python manage.py shell

# Volcar datos de la base de datos
python manage.py dumpdata > backup.json

# Cargar datos
python manage.py loaddata backup.json

# Verificar configuración de modelos
python manage.py check
```

### Servidor de Desarrollo
```bash
# Ejecutar servidor de desarrollo
python manage.py runserver

# Ejecutar en puerto específico
python manage.py runserver 8080

# Ejecutar en todas las interfaces
python manage.py runserver 0.0.0.0:8000
```

### Testing y Debugging
```bash
# Ejecutar tests
python manage.py test

# Ejecutar tests específicos
python manage.py test proxiApp.tests

# Recopilar archivos estáticos
python manage.py collectstatic

# Verificar configuración
python manage.py check
```

## Comandos de NPM/Node.js

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Linting y Formato
```bash
# Ejecutar ESLint
npm run lint

# Arreglar problemas de linting automáticamente
npm run lint:fix

# Formatear código con Prettier (si está configurado)
npm run format
```

## Comandos de Git

### Workflow básico
```bash
# Verificar estado
git status

# Añadir cambios
git add .

# Commit con mensaje
git commit -m "feat: agregar sistema de imágenes para servicios"

# Push a rama principal
git push origin main

# Pull últimos cambios
git pull origin main
```

### Branching
```bash
# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Listar ramas
git branch

# Eliminar rama
git branch -d feature/rama-completada
```

## Comandos de Docker

### Desarrollo con Docker
```bash
# Construir y ejecutar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar contenedores
docker-compose down

# Reconstruir contenedores
docker-compose up --build
```

### Comandos de base de datos en Docker
```bash
# Acceder al contenedor de MySQL
docker exec -it proximidad_db_1 mysql -u root -p

# Backup de la base de datos
docker exec proximidad_db_1 mysqldump -u root -p proxima > backup.sql

# Restaurar backup
docker exec -i proximidad_db_1 mysql -u root -p proxima < backup.sql
```

## Comandos de MySQL

### Gestión de base de datos
```sql
-- Crear base de datos
CREATE DATABASE proxima;

-- Usar base de datos
USE proxima;

-- Ver tablas
SHOW TABLES;

-- Describir tabla
DESCRIBE servicios;

-- Agregar campo de imagen manualmente
ALTER TABLE servicios ADD COLUMN imagen VARCHAR(100) DEFAULT NULL AFTER imagen_url;

-- Ver estructura de tabla
SHOW CREATE TABLE servicios;

-- Backup de datos
SELECT * INTO OUTFILE '/tmp/servicios_backup.csv' 
FIELDS TERMINATED BY ',' 
FROM servicios;
```

## Scripts de Mantenimiento

### Limpieza de archivos temporales
```bash
# Limpiar cache de Python
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -name "*.pyc" -delete

# Limpiar node_modules
rm -rf node_modules
npm install

# Limpiar logs antiguos
find . -name "*.log" -mtime +7 -delete
```

### Backup automático
```bash
#!/bin/bash
# Script de backup automático
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p proxima > backup_$DATE.sql
tar -czf backup_$DATE.tar.gz backup_$DATE.sql media/
```

## Variables de Entorno

### Archivo .env de desarrollo
```env
DEBUG=True
SECRET_KEY=django-insecure-+4!lyxyrot*7as_9&mg=o5bd@k@+^l$+3zo@9b6yno#v4ohp3z
DB_NAME=proxima
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_password
EMAIL_USE_TLS=True
```

### Archivo .env de producción
```env
DEBUG=False
SECRET_KEY=tu_clave_super_secreta_de_producción
DB_NAME=proxima_prod
DB_USER=proxima_user
DB_PASSWORD=password_super_seguro
DB_HOST=localhost
DB_PORT=3306
EMAIL_HOST=tu_servidor_email
EMAIL_PORT=587
EMAIL_HOST_USER=noreply@tudominio.com
EMAIL_HOST_PASSWORD=password_email
EMAIL_USE_TLS=True
ALLOWED_HOSTS=tudominio.com,www.tudominio.com
```

## Solución de Problemas Comunes

### Error de migración
```bash
# Resetear migraciones
python manage.py migrate --fake proxiApp zero
python manage.py makemigrations proxiApp
python manage.py migrate proxiApp
```

### Error de permisos en archivos
```bash
# En Linux/Mac
chmod +x manage.py
chown -R www-data:www-data media/

# En Windows con WSL
sudo chown -R $USER:$USER .
```

### Error de módulos no encontrados
```bash
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall

# Para frontend
rm -rf node_modules package-lock.json
npm install
```

## Monitoreo y Logs

### Ver logs en tiempo real
```bash
# Logs de Django
tail -f Django/proxi/django.log

# Logs del sistema (Linux)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs de Docker
docker-compose logs -f django
docker-compose logs -f frontend
```

### Configuración de logs
```python
# En settings.py para logs más detallados
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'proxiApp': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```