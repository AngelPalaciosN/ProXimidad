# 📁 Scripts - ProXimidad

Scripts de instalación, inicio y mantenimiento del proyecto.

## 🚀 Scripts Principales

### `install.ps1` - Instalación Completa
Script de instalación automatizada con mejoras v2.1:

**Características:**
- ✅ Sin contraseñas hardcodeadas (solicita interactivamente)
- ✅ Validación de requisitos (Python 3.8+, Node 16+, MySQL)
- ✅ Detección automática de IP usando `ver_ip.ps1`
- ✅ Creación de base de datos si no existe
- ✅ Actualización automática de `baseline-browser-mapping`
- ✅ Configuración de entornos virtuales
- ✅ Opción de crear superusuario Django

**Uso:**
```powershell
cd scripts
.\install.ps1
```

**Datos que solicita:**
- Contraseña del backup de imágenes (media.rar/media.zip)
- Usuario MySQL (default: root)
- Contraseña MySQL
- Datos del superusuario Django (opcional)

---

### `start.ps1` - Inicio Rápido
Script para iniciar backend y frontend automáticamente.

**Características:**
- ✅ Detección automática de IP actual usando `ver_ip.ps1`
- ✅ Actualiza configuración de CORS y .env
- ✅ Inicia Django en `http://IP:8000`
- ✅ Inicia Vite en `http://IP:5173`
- ✅ Ventanas minimizadas para backend/frontend

**Uso:**
```powershell
cd scripts
.\start.ps1
```

**Acceso:**
- Frontend: `http://IP:5173`
- Backend: `http://IP:8000`
- Admin: `http://IP:8000/admin`

---

## 🛠️ Scripts de Utilidad

### `ver_ip.ps1` - Detectar IP
Detecta la IP local (excluye 127.x.x.x y 169.254.x.x).

**Uso:**
```powershell
.\ver_ip.ps1
```

---

### `crear_backup.ps1` - Crear Backup Completo
Exporta la base de datos MySQL actual y comprime `backend/media/` en RAR protegido.

**Características:**
- ✅ Exporta BD MySQL a `database/proxima_refinado.sql`
- ✅ Comprime imágenes en `media_backup.rar` con contraseña
- ✅ Valida que MySQL esté corriendo
- ✅ Contraseña personalizable para el RAR

**Uso:**
```powershell
cd scripts
.\crear_backup.ps1
```

**Datos que solicita:**
- Usuario MySQL (default: root)
- Contraseña MySQL
- Contraseña para el RAR (default: proximidad_2025)

**Resultado:**
- `database/proxima_refinado.sql` - BD exportada (sin contraseña)
- `media_backup.rar` - Imágenes protegidas con contraseña

---

## 📝 Workflow Típico

### Primera Instalación
```powershell
# 1. Clonar repositorio
git clone <url-repo>
cd ProXimidad/proximidad-v2

# 2. Instalar
cd scripts
.\install.ps1

# 3. Iniciar
.\start.ps1
```

### Inicio Diario
```powershell
cd scripts
.\start.ps1
```

---

## 🔧 Solución de Problemas

### Error: "Python no instalado"
- Instalar Python 3.8+ desde python.org
- Asegurar que está en PATH

### Error: "MySQL no detectado"
- Instalar MySQL Server 8.0+
- Agregar `C:\Program Files\MySQL\MySQL Server 8.0\bin` a PATH
- O ingresar credenciales manualmente durante instalación

### Error: "Node.js no instalado"
- Instalar Node.js 16+ desde nodejs.org
- Reiniciar PowerShell después de instalar

### Error: "No se detectó IP"
- Verificar conexión de red
- Ingresar IP manualmente cuando se solicite
- Verificar que `ver_ip.ps1` existe en `scripts/`

### Frontend no carga
- Verificar que backend está corriendo en `http://IP:8000/admin`
- Revisar archivo `frontend/.env` (debe tener `VITE_API_URL=http://IP:8000`)
- Ejecutar `npm install` en `frontend/`

---

## 📂 Estructura de Scripts

```
scripts/
├── install.ps1              # Instalación principal
├── start.ps1                # Inicio rápido
├── ver_ip.ps1               # Detectar IP
├── crear_backup.ps1         # Crear backup BD + imágenes
└── README.md                # Documentación
```

---

## ⚙️ Configuración Manual (Avanzado)

Si necesitas configurar manualmente:

### Backend
```python
# backend/core/local_settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proximidad_db',
        'USER': 'root',
        'PASSWORD': 'tu_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://TU_IP:5173",
]
```

### Frontend
```env
# frontend/.env
VITE_API_URL=http://TU_IP:8000
```

---

## 📌 Notas Importantes

- `start.ps1` ahora es **permanente** (incluido en git)
- Los scripts detectan la IP automáticamente cada vez que se ejecutan
- No es necesario editar archivos manualmente
- Las contraseñas **NO** se guardan en archivos (seguridad)
- Los backups de imágenes están protegidos con contraseña

---

**Versión:** 2.1  
**Última actualización:** 2025  
**Mantenedor:** Equipo ProXimidad
