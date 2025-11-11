# 🚀 ProXimidad - Sistema de Instalación Automática

## 📋 Resumen del Sistema

Este proyecto tiene un sistema completamente automatizado que se adapta a **cualquier PC** sin necesidad de configuración manual de IPs o rutas.

---

## 🔐 Sistema de Respaldo de Imágenes

### **Contraseña del Backup:** `proximidad_2025`

Las imágenes de usuarios y servicios son datos sensibles que **NUNCA** se suben directamente a GitHub. En su lugar:

- ✅ Se crea un archivo `media_backup.rar` **protegido con contraseña**
- ✅ Este `.rar` **SÍ se sube a GitHub**
- ✅ Al clonar en otra PC, las imágenes se restauran automáticamente

---

## 📦 Archivos Importantes

### **Archivos que SÍ se suben a GitHub:**
```
✅ install.bat                    (Instalador automático)
✅ start.bat                      (Generado por install.bat)
✅ scripts/crear_backup.bat       (Crear backup de imágenes)
✅ scripts/ver_ip.bat             (Ver IP actual)
✅ media_backup.rar               (Imágenes protegidas)
✅ backend/media/usuarios/.gitkeep
✅ backend/media/servicios/imagenes/.gitkeep
✅ Código fuente completo
```

### **Archivos que NO se suben (protegidos por .gitignore):**
```
❌ backend/venv/                  (Entorno virtual Python)
❌ backend/media/usuarios/*.jpg   (Imágenes originales)
❌ backend/media/servicios/*.jpg  (Imágenes originales)
❌ backend/.env                   (Variables locales)
❌ backend/core/local_settings.py (Configuración BD local)
❌ frontend/node_modules/         (Dependencias Node)
❌ frontend/.env                  (Variables locales)
```

---

## 🖥️ Instalación en PC Nueva

### **Requisitos previos:**
1. **Python 3.8+** instalado ([Descargar](https://www.python.org/))
2. **Node.js 16+** instalado ([Descargar](https://nodejs.org/))
3. **MySQL/Laragon** corriendo con base de datos creada
4. **WinRAR o 7-Zip** instalado ([WinRAR](https://www.winrar.es/) | [7-Zip](https://www.7-zip.org/))

### **Pasos:**

```batch
# 1. Clonar repositorio
git clone https://github.com/AngelPalaciosN/ProXimidad.git
cd ProXimidad/proximidad-v2

# 2. Ejecutar instalador
install.bat

# El instalador te preguntará:
#   - IP a usar (detecta automáticamente)
#   - Nombre de la base de datos
#   - Usuario MySQL
#   - Contraseña MySQL

# 3. Iniciar el sistema
start.bat

# ¡LISTO! El sistema está corriendo
```

### **¿Qué hace install.bat automáticamente?**

1. ✅ Detecta tu IP local (ej: 192.168.1.100, 172.20.0.1, etc.)
2. ✅ Crea carpetas `backend/media/usuarios` y `backend/media/servicios/imagenes`
3. ✅ **Busca y extrae** `media_backup.rar` con contraseña `proximidad_2025`
4. ✅ Instala dependencias Python (Django, MySQL, CORS, etc.)
5. ✅ Crea `backend/core/local_settings.py` con tu configuración de BD
6. ✅ Aplica migraciones de Django
7. ✅ Instala dependencias Node.js (React, Vite, etc.)
8. ✅ Crea `frontend/.env` con tu IP y `/api` incluido
9. ✅ Genera `start.bat` configurado para tu PC

---

## 🎮 Uso Diario

### **Iniciar el sistema:**
```batch
start.bat
```

Esto abre 2 ventanas:
- **Backend Django** en `http://TU_IP:8000`
- **Frontend React** en `http://TU_IP:5173`

### **Ver tu IP actual:**
```batch
scripts\ver_ip.bat
```

Muestra:
- IPs detectadas en tu PC
- Configuración actual del sistema
- URLs de acceso

### **Crear backup de imágenes:**
```batch
scripts\crear_backup.bat
```

Crea `media_backup.rar` con contraseña `proximidad_2025` y te indica cómo subirlo a GitHub.

---

## 🔧 Detección Inteligente

### **Búsqueda automática de WinRAR:**
El sistema busca WinRAR en estas ubicaciones:
```
1. PATH (variables de entorno)
2. C:\Program Files\WinRAR\
3. C:\Program Files (x86)\WinRAR\
4. %USERPROFILE%\WinRAR\
5. %APPDATA%\WinRAR\
6. %ProgramData%\WinRAR\
```

### **Búsqueda automática de 7-Zip:**
```
1. PATH (variables de entorno)
2. C:\Program Files\7-Zip\
3. C:\Program Files (x86)\7-Zip\
4. %USERPROFILE%\7-Zip\
```

### **Detección automática de IP:**
- Detecta todas las interfaces de red IPv4
- Excluye localhost (127.0.0.1)
- Muestra la primera IP válida encontrada
- Te permite elegir otra si tienes múltiples redes

---

## 🌐 Cambio de IP

Si cambias de red WiFi o tu IP cambia:

```batch
# Opción 1: Reinstalar (recomendado)
install.bat

# Opción 2: Ver IP actual
scripts\ver_ip.bat
```

El sistema te dirá si la IP cambió y qué hacer.

---

## 📱 URLs de Acceso

Después de ejecutar `start.bat`, accede al sistema:

```
Backend API:  http://TU_IP:8000/api
Admin Panel:  http://TU_IP:8000/admin
Frontend:     http://TU_IP:5173
```

Reemplaza `TU_IP` con la IP que se muestra en `start.bat`.

---

## 🔐 Seguridad

### **Contraseña del backup:**
- **Contraseña:** `proximidad_2025`
- **Uso:** Protege las imágenes en `media_backup.rar`
- **Cambiar:** Edita `scripts/crear_backup.bat` y busca `proximidad_2025`

### **Protección de datos sensibles:**
- `.env` nunca se sube a GitHub
- `local_settings.py` nunca se sube a GitHub
- Imágenes originales nunca se suben a GitHub
- Solo el backup encriptado se sube

---

## 🆘 Solución de Problemas

### **Error: "WinRAR/7-Zip no instalado"**
```
Solución:
1. Instala WinRAR: https://www.winrar.es/
   O
2. Instala 7-Zip: https://www.7-zip.org/
3. Reinicia el terminal
4. Ejecuta el script nuevamente
```

### **Error: "MySQL no responde"**
```
Solución:
1. Asegúrate de que Laragon/XAMPP esté corriendo
2. Verifica que la base de datos exista
3. Confirma usuario y contraseña en install.bat
```

### **Error: "CORS blocked"**
```
Solución:
1. Verifica que frontend/.env tenga /api al final:
   VITE_API_BASE_URL=http://TU_IP:8000/api
   
2. Si falta, ejecuta install.bat nuevamente
```

### **Error: "404 en /usuarios/ o /servicios/"**
```
Solución:
1. Las rutas deben incluir /api:
   ✅ http://TU_IP:8000/api/usuarios/
   ❌ http://TU_IP:8000/usuarios/
   
2. El frontend ahora usa buildApiUrl() automáticamente
```

---

## 📝 Flujo Completo de Trabajo

### **En tu PC de desarrollo:**

```batch
# 1. Hacer cambios en el código
# (editar archivos Python, React, etc.)

# 2. Crear backup de imágenes nuevas
scripts\crear_backup.bat

# 3. Subir cambios a GitHub
git add .
git add media_backup.rar
git commit -m "Actualizar proyecto e imágenes"
git push
```

### **En PC de otro desarrollador:**

```batch
# 1. Clonar o actualizar
git clone https://github.com/AngelPalaciosN/ProXimidad.git
# O si ya existe: git pull

# 2. Instalar (extrae backup automáticamente)
cd proximidad-v2
install.bat

# 3. Iniciar
start.bat
```

---

## ✅ Checklist de Validación

Después de instalar, verifica:

- [ ] Backend corriendo en `http://TU_IP:8000`
- [ ] Frontend corriendo en `http://TU_IP:5173`
- [ ] Admin accesible en `http://TU_IP:8000/admin`
- [ ] API responde en `http://TU_IP:8000/api/usuarios/`
- [ ] No hay errores CORS en consola del navegador (F12)
- [ ] Imágenes se cargan correctamente
- [ ] `media_backup.rar` existe en el directorio raíz

---

## 🎉 ¡Todo Listo!

El sistema ahora es completamente portable y se adapta automáticamente a cualquier PC. Solo necesitas:

1. Clonar el repositorio
2. Ejecutar `install.bat`
3. Ejecutar `start.bat`

**¡Y ya está funcionando!** 🚀

---

## 📞 Contacto

Si tienes problemas, revisa:
1. Este README
2. Los mensajes de error en la consola
3. El archivo `backend/django.log`
