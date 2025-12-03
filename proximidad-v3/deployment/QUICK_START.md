# 🚀 Quick Deploy Guide - ProXimidad V3

## Pre-requisitos

✅ Raspberry Pi con Raspberry Pi OS  
✅ Python 3, pip, MariaDB, Nginx instalados  
✅ Acceso SSH a la Raspberry (usuario: proximidad)  
✅ No-IP configurado (proximidad.serveirc.com)

---

## 📦 Paso 1: Compilar Frontend

**En tu máquina Windows:**

```powershell
cd proximidad-v3
.\scripts\build_frontend.ps1
```

✅ Genera: `dist.tar.gz`

---

## 🚚 Paso 2: Copiar Archivos a Raspberry

```powershell
# Copiar backend
scp -r backend/* proximidad@192.168.1.50:/home/proximidad/backend/

# Copiar frontend build
scp dist.tar.gz proximidad@192.168.1.50:/home/proximidad/

# Copiar archivos de deployment
scp -r deployment/* proximidad@192.168.1.50:/tmp/deployment/
```

---

## ⚙️ Paso 3: Configurar Servicios

**Conectarse a Raspberry:**

```bash
ssh proximidad@192.168.1.50
```

**Copiar configuraciones:**

```bash
# Nginx
sudo cp /tmp/deployment/nginx/proximidad_v3.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/proximidad_v3.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/proximidad  # Desactivar V2

# Systemd
sudo cp /tmp/deployment/systemd/proximidad_app1.service /etc/systemd/system/
sudo cp /tmp/deployment/systemd/proximidad_app2.service /etc/systemd/system/
sudo systemctl daemon-reload

# Scripts
sudo cp /tmp/deployment/scripts/start_server_v3.sh /home/proximidad/Desktop/
sudo chmod +x /home/proximidad/Desktop/start_server_v3.sh

# Auto-inicio
mkdir -p /home/proximidad/.config/autostart
cp /tmp/deployment/autostart/proximidad.desktop /home/proximidad/.config/autostart/
```

---

## 🗄️ Paso 4: Deploy Backend

```bash
cd /home/proximidad/backend

# Instalar dependencias
pip3 install -r requirements.txt

# Migrar BD
python3 manage.py migrate

# Recolectar estáticos
python3 manage.py collectstatic --noinput

# Crear directorios
mkdir -p media/servicios/imagenes
mkdir -p media/usuarios
mkdir -p /home/proximidad/logs

# Permisos
chmod -R 755 media/
chmod -R 755 /home/proximidad/logs
```

---

## 🎨 Paso 5: Deploy Frontend

```bash
cd /home/proximidad

# Extraer build
sudo mkdir -p /var/www/proximidad/frontend_build
sudo tar -xzf dist.tar.gz -C /var/www/proximidad/frontend_build/

# Permisos
sudo chown -R www-data:www-data /var/www/proximidad/frontend_build
```

---

## 🚀 Paso 6: Iniciar Servicios

```bash
# Habilitar auto-inicio
sudo systemctl enable proximidad_app1
sudo systemctl enable proximidad_app2
sudo systemctl enable nginx
sudo systemctl enable mariadb

# Iniciar todo
sudo bash /home/proximidad/Desktop/start_server_v3.sh
```

---

## ✅ Paso 7: Verificar

```bash
# Estado de servicios
sudo systemctl status proximidad_app1
sudo systemctl status proximidad_app2
sudo systemctl status nginx

# Test APIs
curl http://localhost/api/servicios/
curl http://localhost/api/contacto/

# Test Frontend
curl http://localhost/
```

---

## 🌐 URLs de Acceso

- **Local:** http://localhost
- **Red LAN:** http://192.168.1.50
- **Externo:** http://proximidad.serveirc.com

---

## 📝 Logs

```bash
# Ver logs en tiempo real
sudo journalctl -u proximidad_app1 -f
sudo journalctl -u proximidad_app2 -f

# Logs de archivo
tail -f /home/proximidad/logs/app1_error.log
tail -f /home/proximidad/logs/app2_error.log
tail -f /var/log/nginx/proximidad_error.log
```

---

## 🔄 Comandos Útiles

```bash
# Reiniciar backend
sudo systemctl restart proximidad_app1 proximidad_app2

# Reiniciar frontend
sudo systemctl restart nginx

# Reiniciar todo
sudo bash /home/proximidad/Desktop/start_server_v3.sh

# Ver puertos
netstat -tuln | grep -E ':80|:8000|:8001'
```

---

## ⏮️ Rollback a V2

```bash
sudo bash /home/proximidad/rollback_to_v2.sh
```

---

## 🆘 Problemas Comunes

### App no inicia
```bash
sudo journalctl -u proximidad_app1 -n 50
sudo journalctl -u proximidad_app2 -n 50
```

### API no responde
```bash
netstat -tuln | grep 8000
netstat -tuln | grep 8001
curl http://localhost:8000/api/servicios/
```

### Frontend en blanco
```bash
ls -la /var/www/proximidad/frontend_build/
sudo tail -f /var/log/nginx/proximidad_error.log
```

---

## 📚 Documentación Completa

Ver: `deployment/README_DEPLOY.md`

---

## ✅ Checklist

- [ ] Frontend compilado
- [ ] Archivos copiados a Raspberry
- [ ] Nginx configurado
- [ ] Servicios systemd creados
- [ ] Backend migrado
- [ ] Frontend extraído
- [ ] Servicios iniciados
- [ ] APIs respondiendo
- [ ] Frontend accesible
- [ ] Auto-inicio configurado

---

**¡Listo! Tu aplicación está corriendo en producción 🎉**
