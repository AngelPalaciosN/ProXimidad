# 🔧 Instrucciones de Actualización - Fix Solicitudes

## 📋 Resumen del Problema

Se detectó un error `Bad Request` en el endpoint `/api/solicitudes/crear/` causado por:

1. **Frontend**: El componente `ServiceRequestModal.jsx` intentaba acceder a propiedades del objeto `service` con nombres incorrectos
   - ❌ `service.nombre` → ✅ `service.nombre_servicio`
   - ❌ `service.precio` → ✅ `service.precio_base`
   - ❌ `service.proveedor.nombre` → ✅ `service.proveedor_info.nombre_completo`

2. **Backend**: Faltaba validación y logging detallado para debugging

## ✅ Cambios Realizados

### Frontend (`ServiceRequestModal.jsx`)

- ✅ Corregido acceso a propiedades del servicio (líneas 140-155 y 281-290)
- ✅ Mejorado manejo de errores con mensajes descriptivos según código HTTP
- ✅ Agregado logging detallado en consola para debugging
- ✅ Agregado fallbacks para compatibilidad con diferentes estructuras

### Backend (`views_solicitudes.py`)

- ✅ Agregado logging detallado con emojis para fácil identificación
- ✅ Validaciones exhaustivas de todos los campos requeridos
- ✅ Verificación de existencia de servicio, cliente y proveedor
- ✅ Manejo de errores mejorado con mensajes descriptivos
- ✅ Logging de errores con `exc_info=True` para stack traces completos

---

## 🚀 Método 1: Actualización Automática (Recomendado)

Usa el script PowerShell para transferir automáticamente:

```powershell
cd proximidad-v3\scripts
.\actualizar_raspberry.ps1
```

Si tu Raspberry tiene una IP diferente:

```powershell
.\actualizar_raspberry.ps1 -RaspberryIP "192.168.1.150" -Usuario "proximidad"
```

El script:
1. ✅ Verifica conectividad
2. ✅ Crea backup automático
3. ✅ Transfiere archivos vía SCP
4. ✅ Ofrece opciones para compilar y reiniciar

---

## 📦 Método 2: Transferencia Manual vía SCP

### Paso 1: Crear backup en Raspberry Pi

```bash
ssh proximidad@192.168.1.100
cd ~
mkdir -p backups
tar -czf backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  backend/proximidad_app2/views_solicitudes.py \
  frontend/src/components/modules/ServiceRequestModal.jsx
exit
```

### Paso 2: Transferir archivo de Backend

Desde tu PC Windows (PowerShell):

```powershell
# Navegar al proyecto
cd "C:\Users\Angel David Palacios\Documents\GitHub\ProXimidad\ProXimidad\proximidad-v3"

# Transferir views_solicitudes.py
scp backend\proximidad_app2\views_solicitudes.py proximidad@192.168.1.100:/home/proximidad/backend/proximidad_app2/views_solicitudes.py
```

### Paso 3: Transferir archivo de Frontend

```powershell
# Transferir ServiceRequestModal.jsx
scp frontend\src\components\modules\ServiceRequestModal.jsx proximidad@192.168.1.100:/home/proximidad/frontend/src/components/modules/ServiceRequestModal.jsx
```

### Paso 4: Compilar Frontend y Reiniciar Servicios

Conectarse a la Raspberry:

```bash
ssh proximidad@192.168.1.100
```

Compilar el frontend:

```bash
cd ~/frontend
npm run build
```

Reiniciar servicios:

```bash
sudo systemctl restart proximidad_app1.service proximidad_app2.service
sudo systemctl restart nginx
```

---

## 🔍 Verificación Post-Actualización

### 1. Verificar que los servicios estén corriendo

```bash
sudo systemctl status proximidad_app1.service
sudo systemctl status proximidad_app2.service
sudo systemctl status nginx
```

### 2. Ver logs en tiempo real

```bash
# Backend App2 (API de Solicitudes)
sudo journalctl -u proximidad_app2.service -f

# Buscar los nuevos logs con emojis:
# 🔍 Recibiendo solicitud de creación...
# ✅ Servicio encontrado...
# ✅ Cliente encontrado...
# ✅ Solicitud creada exitosamente...
```

### 3. Verificar errores de Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```

### 4. Probar la funcionalidad

1. Abre el frontend en tu navegador
2. Inicia sesión como cliente
3. Busca un servicio
4. Haz clic en "Solicitar Servicio"
5. Completa el formulario
6. Envía la solicitud

**Antes**: Bad Request sin detalles
**Ahora**: 
- Si hay error, verás un mensaje descriptivo específico
- En la consola del navegador (F12) verás logs detallados
- En los logs del servidor verás el flujo completo con emojis

---

## 🐛 Troubleshooting

### Error: "Connection refused"

```bash
# Verificar que Gunicorn esté corriendo
ps aux | grep gunicorn

# Si no está corriendo, iniciarlo
sudo systemctl start proximidad_app1.service proximidad_app2.service
```

### Error: "Permission denied"

```bash
# Verificar permisos de los archivos
ls -la ~/backend/proximidad_app2/views_solicitudes.py
ls -la ~/frontend/src/components/modules/ServiceRequestModal.jsx

# Corregir permisos si es necesario
chmod 644 ~/backend/proximidad_app2/views_solicitudes.py
chmod 644 ~/frontend/src/components/modules/ServiceRequestModal.jsx
```

### Frontend no actualiza

```bash
# Limpiar cache y rebuild
cd ~/frontend
rm -rf dist node_modules/.vite
npm run build

# Verificar que nginx sirva los archivos actualizados
sudo nginx -t
sudo systemctl restart nginx
```

### Logs no muestran los nuevos mensajes

```bash
# Verificar que el archivo fue actualizado
grep "🔍 Recibiendo solicitud" ~/backend/proximidad_app2/views_solicitudes.py

# Si no aparece, el archivo no se transfirió correctamente
```

---

## 📊 Nuevos Logs para Debugging

### Backend (views_solicitudes.py)

Ahora verás logs como:

```
[INFO] 🔍 Recibiendo solicitud de creación con datos: {'servicio': 1, 'cliente': 2, ...}
[INFO] ✅ Servicio encontrado: Desarrollo Web (ID: 1)
[INFO] ✅ Cliente encontrado: Juan Pérez (ID: 2)
[INFO] 📝 Creando solicitud con proveedor auto-asignado: María García (ID: 3)
[INFO] ✅ Solicitud creada exitosamente: ID 15
[INFO] 📧 Emails de notificación enviados para solicitud 15
```

O en caso de error:

```
[ERROR] ❌ Campo 'servicio' faltante en la solicitud
[ERROR] ❌ Servicio con ID 99 no encontrado
[ERROR] ❌ Campo 'descripcion_personalizada' faltante o vacío
```

### Frontend (Consola del Navegador)

Ahora verás:

```javascript
📤 Enviando solicitud: {servicio: 1, cliente: 2, descripcion_personalizada: "..."}
✅ Solicitud creada: {message: "Solicitud creada exitosamente", solicitud: {...}}
```

O en caso de error:

```javascript
❌ Error al enviar solicitud: Error: Request failed with status code 400
❌ Detalles del error: {
  status: 400,
  data: {servicio: ["El campo servicio es requerido"]},
  config: {...}
}
```

---

## ✅ Checklist de Verificación

- [ ] Archivos transferidos a Raspberry Pi
- [ ] Frontend compilado (`npm run build`)
- [ ] Servicios backend reiniciados
- [ ] Nginx reiniciado
- [ ] Logs muestran nuevos mensajes con emojis
- [ ] Prueba de crear solicitud funciona
- [ ] Errores muestran mensajes descriptivos

---

## 📞 Soporte

Si después de seguir estos pasos aún hay problemas:

1. **Revisa los logs completos**:
   ```bash
   sudo journalctl -u proximidad_app2.service --since "10 minutes ago" --no-pager
   ```

2. **Verifica la versión de Python**:
   ```bash
   python3 --version
   source ~/backend/venv/bin/activate
   python --version
   ```

3. **Verifica las dependencias**:
   ```bash
   cd ~/backend
   source venv/bin/activate
   pip list | grep -E "django|djangorestframework|gunicorn"
   ```

4. **Contacta al equipo de desarrollo** con:
   - Logs completos del error
   - Capturas de pantalla de la consola del navegador
   - Pasos para reproducir el error
