# 🚀 Guía de Despliegue - ProXimidad Backend en Raspberry Pi

## 📋 Requisitos Previos

### 1. Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar dependencias del sistema
```bash
# Python y herramientas
sudo apt install python3 python3-pip python3-venv -y

# MySQL/MariaDB (base de datos)
sudo apt install mariadb-server mariadb-client -y
sudo apt install libmariadb-dev libmariadb-dev-compat -y

# Nginx (servidor web)
sudo apt install nginx -y

# Herramientas adicionales
sudo apt install git curl -y
```

### 3. Instalar Gunicorn
Gunicorn se instalará en el entorno virtual, pero también lo necesitas actualizar en requirements.txt:
```bash
# Añade esta línea al final de requirements.txt
gunicorn==21.2.0
```

---

## 🗄️ Configuración de la Base de Datos

### 1. Configurar MySQL/MariaDB
```bash
# Iniciar servicio
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Configuración segura
sudo mysql_secure_installation
```

### 2. Crear la base de datos
```bash
sudo mysql -u root
```

Ejecuta en MySQL:
```sql
CREATE DATABASE proxima CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EXIT;
```

**Nota:** Usaremos el usuario `root` de MySQL sin contraseña para simplificar (esto es común en Raspberry Pi para desarrollo/pruebas locales).

---

## 📦 Despliegue del Backend

### 1. Clonar o copiar el proyecto
```bash
cd /home/pi
git clone https://github.com/tu-usuario/proximidad-v2.git
# O copia los archivos con scp/rsync desde tu PC
```

### 2. Crear entorno virtual e instalar dependencias
```bash
cd /home/pi/proximidad-v2/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.production .env

# Editar con tus datos
nano .env
```

**Importante:** Cambia estos valores en `.env`:
- `SECRET_KEY` - Genera una nueva con: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- `DEBUG=False` (o `True` si estás probando)
- `ALLOWED_HOSTS` - Añade la IP de tu Raspberry (ejemplo: `192.168.1.100,localhost`)
- `DATABASE_PASSWORD` - Déjalo vacío si usas root sin password: `DATABASE_PASSWORD=`

### 4. Ejecutar migraciones y recolectar estáticos
```bash
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 5. Probar Gunicorn manualmente
```bash
# Desde el directorio backend con el venv activado
gunicorn core.wsgi:application --config gunicorn_config.py --bind 0.0.0.0:8000
```

Abre tu navegador en `http://IP_RASPBERRY:8000/admin/` para verificar que funciona.

---

## ⚙️ Configurar Gunicorn como Servicio (systemd)

### 1. Ajustar las rutas en el archivo de servicio
Edita `proximidad.service` y cambia:
- `/home/pi/proximidad-v2/backend` por tu ruta real
- `User=pi` por tu usuario real

### 2. Copiar el archivo de servicio
```bash
sudo cp proximidad.service /etc/systemd/system/
sudo chmod 644 /etc/systemd/system/proximidad.service
```

### 3. Habilitar e iniciar el servicio
```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar para inicio automático
sudo systemctl enable proximidad.service

# Iniciar el servicio
sudo systemctl start proximidad.service

# Verificar estado
sudo systemctl status proximidad.service
```

### 4. Comandos útiles para el servicio
```bash
# Ver logs en tiempo real
sudo journalctl -u proximidad.service -f

# Reiniciar el servicio
sudo systemctl restart proximidad.service

# Detener el servicio
sudo systemctl stop proximidad.service
```

---

## 🌐 Configuración de Nginx

### 1. Editar la configuración
Edita `nginx_config.conf` y cambia:
- `server_name` - Tu IP o dominio
- Las rutas de `alias` - Tu ruta real del proyecto
- `root` - La ruta donde está tu frontend

### 2. Copiar configuración a Nginx
```bash
# Copiar archivo de configuración
sudo cp nginx_config.conf /etc/nginx/sites-available/proximidad

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/proximidad /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default
```

### 3. Verificar y aplicar configuración
```bash
# Verificar sintaxis
sudo nginx -t

# Si todo está OK, reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. Configurar directorios de media e imágenes
```bash
# Crear directorios necesarios
cd /home/pi/proximidad-v2/backend
mkdir -p media/servicios/imagenes
mkdir -p media/usuarios

# Dar permisos correctos para que Django y Nginx puedan leer/escribir
sudo chown -R pi:www-data staticfiles
sudo chown -R pi:www-data media
sudo chmod -R 775 staticfiles
sudo chmod -R 775 media

# Asegurar que los subdirectorios tengan permisos correctos
sudo chmod -R 775 media/servicios/imagenes
sudo chmod -R 775 media/usuarios
```

**Importante para las imágenes:**
- Django necesita permisos de escritura en `media/` para subir imágenes
- Nginx necesita permisos de lectura para servir las imágenes
- Los permisos `775` permiten que tanto Django (usuario `pi`) como Nginx (grupo `www-data`) accedan

---

## 🧪 Pruebas

### Probar el backend
```bash
# API
curl http://tu-ip-raspberry/api/

# Admin
curl http://tu-ip-raspberry/admin/

# Archivos estáticos
curl http://tu-ip-raspberry/static/admin/css/base.css

# Verificar que el directorio media es accesible
curl -I http://tu-ip-raspberry/media/
```

### Probar subida de imágenes
1. Accede al admin de Django: `http://tu-ip-raspberry/admin/`
2. Crea un servicio o usuario con imagen
3. Verifica que la imagen se guardó en: `/home/pi/proximidad-v2/backend/media/servicios/imagenes/` o `/media/usuarios/`
4. Verifica que puedes acceder a la imagen desde el navegador: `http://tu-ip-raspberry/media/servicios/imagenes/nombre-imagen.jpg`

### Verificar logs
```bash
# Logs de Gunicorn
sudo journalctl -u proximidad.service -n 50

# Logs de Nginx
sudo tail -f /var/log/nginx/proximidad_access.log
sudo tail -f /var/log/nginx/proximidad_error.log

# Logs de Django (si LOG_TO_FILE=True)
tail -f /home/pi/proximidad-v2/backend/django.log
```

---

## 🔥 Firewall (Opcional pero Recomendado)

```bash
# Instalar UFW
sudo apt install ufw -y

# Permitir SSH (¡importante antes de habilitar!)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Ver estado
sudo ufw status
```

---

## 📝 Configuración en tu Frontend

Actualiza la URL del API en tu frontend (Next.js, React, etc.):

```javascript
// Ejemplo en Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.100/api';
```

O en tu archivo `.env.local` del frontend:
```
NEXT_PUBLIC_API_URL=http://192.168.1.100/api
```

---

## 🔄 Actualizar el Backend

Cuando hagas cambios:

```bash
# 1. Conectar a la Raspberry
ssh pi@192.168.1.100

# 2. Ir al directorio del proyecto
cd /home/pi/proximidad-v2/backend

# 3. Activar entorno virtual
source venv/bin/activate

# 4. Actualizar código (si usas git)
git pull

# 5. Instalar nuevas dependencias (si las hay)
pip install -r requirements.txt

# 6. Ejecutar migraciones
python manage.py migrate

# 7. Recolectar estáticos
python manage.py collectstatic --noinput

# 8. Reiniciar Gunicorn
sudo systemctl restart proximidad.service

# 9. Verificar que todo funcione
sudo systemctl status proximidad.service
```

---

## ⚠️ Solución de Problemas

### Gunicorn no inicia
```bash
# Ver logs detallados
sudo journalctl -u proximidad.service -xe

# Verificar permisos
ls -la /home/pi/proximidad-v2/backend/venv/bin/gunicorn

# Probar manualmente
cd /home/pi/proximidad-v2/backend
source venv/bin/activate
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Nginx muestra 502 Bad Gateway
```bash
# Verificar que Gunicorn esté corriendo
sudo systemctl status proximidad.service

# Ver logs de Nginx
sudo tail -f /var/log/nginx/proximidad_error.log

# Verificar que el puerto 8000 esté escuchando
sudo netstat -tulpn | grep :8000
```

### Archivos estáticos no se cargan
```bash
# Verificar permisos
ls -la /home/pi/proximidad-v2/backend/staticfiles/

# Recolectar estáticos nuevamente
cd /home/pi/proximidad-v2/backend
source venv/bin/activate
python manage.py collectstatic --noinput --clear

# Verificar configuración de Nginx
sudo nginx -t
```

### Base de datos no conecta
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mariadb

# Probar conexión (sin password si usas root)
mysql -u root proxima

# Verificar credenciales en .env
cat /home/pi/proximidad-v2/backend/.env | grep DATABASE
```

### Las imágenes no se suben o no se ven
```bash
# Verificar permisos del directorio media
ls -la /home/pi/proximidad-v2/backend/media/
ls -la /home/pi/proximidad-v2/backend/media/servicios/imagenes/

# Reestablecer permisos si es necesario
sudo chown -R pi:www-data /home/pi/proximidad-v2/backend/media
sudo chmod -R 775 /home/pi/proximidad-v2/backend/media

# Verificar que Django puede escribir
cd /home/pi/proximidad-v2/backend
source venv/bin/activate
python manage.py shell
>>> from django.core.files.base import ContentFile
>>> from django.core.files.storage import default_storage
>>> path = default_storage.save('test.txt', ContentFile(b'test'))
>>> print(path)
>>> exit()

# Verificar configuración de MEDIA en settings
cat .env | grep MEDIA

# Ver logs de Gunicorn para errores de permisos
sudo journalctl -u proximidad.service -f
```

---

## 🔒 Seguridad Adicional (Recomendado para Producción)

### 1. HTTPS con Let's Encrypt (si tienes un dominio)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com
```

### 2. Cambiar puerto SSH
```bash
sudo nano /etc/ssh/sshd_config
# Cambiar Port 22 a Port 2222
sudo systemctl restart sshd
```

### 3. Deshabilitar login root
```bash
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
sudo systemctl restart sshd
```

---

## 📊 Monitoreo (Opcional)

### Instalar htop para monitorear recursos
```bash
sudo apt install htop -y
htop
```

### Ver uso de memoria y CPU
```bash
free -h
top
```

---

## ✅ Checklist Final

- [ ] MySQL/MariaDB instalado y configurado
- [ ] Base de datos creada con usuario y permisos
- [ ] Entorno virtual creado e dependencias instaladas
- [ ] Archivo `.env` configurado correctamente
- [ ] Migraciones ejecutadas
- [ ] Archivos estáticos recolectados
- [ ] Gunicorn funciona manualmente
- [ ] Servicio systemd configurado y activo
- [ ] Nginx instalado y configurado
- [ ] Permisos correctos en archivos estáticos y media
- [ ] Backend accesible desde el navegador
- [ ] Frontend actualizado con la URL del API
- [ ] Logs revisados sin errores

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Gunicorn: `sudo journalctl -u proximidad.service -f`
2. Revisa los logs de Nginx: `sudo tail -f /var/log/nginx/proximidad_error.log`
3. Verifica el status de los servicios: `sudo systemctl status proximidad nginx mariadb`

---

¡Listo! Tu backend de Django debería estar funcionando con Gunicorn y Nginx en tu Raspberry Pi 🎉
