# ⚡ Comandos Rápidos - Fix Solicitudes

## 🚀 Actualización Automática (PowerShell en Windows)

```powershell
cd "C:\Users\Angel David Palacios\Documents\GitHub\ProXimidad\ProXimidad\proximidad-v3\scripts"
.\actualizar_raspberry.ps1
```

Con IP personalizada:
```powershell
.\actualizar_raspberry.ps1 -RaspberryIP "192.168.1.150" -Usuario "proximidad"
```

---

## 📤 Transferencia Manual (Solo copiar archivos)

```powershell
# Backend
scp backend\proximidad_app2\views_solicitudes.py proximidad@192.168.1.100:/home/proximidad/backend/proximidad_app2/

# Frontend
scp frontend\src\components\modules\ServiceRequestModal.jsx proximidad@192.168.1.100:/home/proximidad/frontend/src/components/modules/
```

---

## 🔄 En Raspberry Pi (después de transferir)

### Compilar y Reiniciar TODO

```bash
ssh proximidad@192.168.1.100
cd ~/frontend && npm run build && \
sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx
```

### Solo Reiniciar Backend

```bash
ssh proximidad@192.168.1.100
sudo systemctl restart proximidad_app1.service proximidad_app2.service
```

### Solo Compilar Frontend

```bash
ssh proximidad@192.168.1.100
cd ~/frontend && npm run build && sudo systemctl restart nginx
```

---

## 🔍 Verificación

### Ver logs en tiempo real

```bash
ssh proximidad@192.168.1.100
sudo journalctl -u proximidad_app2.service -f
```

### Ver últimos 50 logs

```bash
ssh proximidad@192.168.1.100
sudo journalctl -u proximidad_app2.service -n 50 --no-pager
```

### Ver logs con errores

```bash
ssh proximidad@192.168.1.100
sudo journalctl -u proximidad_app2.service -p err --no-pager
```

### Estado de servicios

```bash
ssh proximidad@192.168.1.100
sudo systemctl status proximidad_app1.service proximidad_app2.service nginx
```

---

## 🐛 Troubleshooting Rápido

### Servicio no inicia

```bash
ssh proximidad@192.168.1.100
sudo systemctl stop proximidad_app2.service
sudo systemctl start proximidad_app2.service
sudo journalctl -u proximidad_app2.service -n 100 --no-pager
```

### Frontend no actualiza

```bash
ssh proximidad@192.168.1.100
cd ~/frontend
rm -rf dist node_modules/.vite
npm run build
sudo systemctl restart nginx
```

### Verificar archivos actualizados

```bash
ssh proximidad@192.168.1.100
grep "🔍 Recibiendo solicitud" ~/backend/proximidad_app2/views_solicitudes.py
```

Si el comando anterior no muestra nada, el archivo no se actualizó.

---

## 📊 Prueba Completa

### 1. Transferir archivos

```powershell
cd "C:\Users\Angel David Palacios\Documents\GitHub\ProXimidad\ProXimidad\proximidad-v3\scripts"
.\actualizar_raspberry.ps1
```

### 2. Monitorear logs

```bash
ssh proximidad@192.168.1.100
sudo journalctl -u proximidad_app2.service -f
```

### 3. Probar en navegador

1. Abrir: `http://192.168.1.100` (o la IP de tu Raspberry)
2. Iniciar sesión como cliente
3. Buscar un servicio
4. Clic en "Solicitar Servicio"
5. Completar formulario
6. Enviar

**Verás en logs**:
```
[INFO] 🔍 Recibiendo solicitud de creación con datos: {...}
[INFO] ✅ Servicio encontrado: Nombre del Servicio (ID: X)
[INFO] ✅ Cliente encontrado: Nombre Cliente (ID: Y)
[INFO] ✅ Solicitud creada exitosamente: ID Z
```

---

## 🎯 One-Liner Completo

Todo en un solo comando (PowerShell):

```powershell
cd "C:\Users\Angel David Palacios\Documents\GitHub\ProXimidad\ProXimidad\proximidad-v3"; `
scp backend\proximidad_app2\views_solicitudes.py proximidad@192.168.1.100:/home/proximidad/backend/proximidad_app2/; `
scp frontend\src\components\modules\ServiceRequestModal.jsx proximidad@192.168.1.100:/home/proximidad/frontend/src/components/modules/; `
ssh proximidad@192.168.1.100 "cd ~/frontend && npm run build && sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx"
```

---

## ⚠️ Si algo falla

### Rollback rápido

```bash
ssh proximidad@192.168.1.100
cd ~
ls -lt backups/  # Ver backups disponibles
tar -xzf backups/backup_XXXXXX_XXXXXX.tar.gz  # Restaurar último backup
sudo systemctl restart proximidad_app1.service proximidad_app2.service
```

### Contactar soporte

Recopilar información:

```bash
ssh proximidad@192.168.1.100
echo "=== VERSIÓN PYTHON ===" && python3 --version
echo "=== STATUS SERVICIOS ===" && sudo systemctl status proximidad_app2.service --no-pager
echo "=== ÚLTIMOS LOGS ===" && sudo journalctl -u proximidad_app2.service -n 50 --no-pager
echo "=== ERRORES ===" && sudo journalctl -u proximidad_app2.service -p err --no-pager
```

Copiar toda la salida y enviársela al equipo de desarrollo.

---

## 📋 Checklist Final

Marca cuando completes:

- [ ] Archivos transferidos a Raspberry Pi
- [ ] Frontend compilado
- [ ] Servicios reiniciados
- [ ] Logs muestran emojis (🔍 ✅ ❌)
- [ ] Prueba de solicitud exitosa
- [ ] Sin errores en logs

**Todo listo!** ✅
