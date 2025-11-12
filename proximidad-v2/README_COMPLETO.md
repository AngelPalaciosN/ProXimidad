# 🚀 ProXimidad - Sistema de Gestión de Servicios Locales

## 📋 Requisitos Previos

- **Python 3.8+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 16+** - [Descargar](https://nodejs.org/)
- **MySQL 8.0+** - [Descargar](https://dev.mysql.com/downloads/mysql/)
- **WinRAR o 7-Zip** (recomendado) - Para restaurar imágenes desde backup

## 🔧 Instalación Rápida

### Opción 1: PowerShell (Recomendado)

```powershell
.\install.ps1
```

### Opción 2: Símbolo del sistema (CMD)

```cmd
install.bat
```

El instalador automáticamente:
1. ✅ Detecta tu IP local
2. ✅ Configura el entorno virtual de Python
3. ✅ Instala todas las dependencias
4. ✅ Restaura las imágenes desde `media_backup.rar` (con contraseña)
5. ✅ Configura la base de datos MySQL
6. ✅ Ejecuta las migraciones de Django
7. ✅ Instala dependencias de Node.js
8. ✅ Crea el script de inicio `start.ps1`

## 🎯 Iniciar el Sistema

Después de la instalación, ejecuta:

```powershell
.\start.ps1
```

Esto abrirá dos ventanas:
- **Backend Django** → `http://TU_IP:8000`
- **Frontend React** → `http://TU_IP:5173`

## 🔐 Backup de Imágenes

### Sistema de Seguridad

Las imágenes están protegidas y **NO se suben directamente a Git**. En su lugar:

- ✅ Las imágenes se comprimen en `media_backup.rar` con contraseña
- ✅ Solo el archivo RAR se sube al repositorio
- ✅ Contraseña del backup: `proximidad_2025`
- ✅ Las carpetas `backend/media/usuarios/` y `backend/media/servicios/` están en `.gitignore`

### Crear Backup de Imágenes

Cuando agregues nuevas imágenes al sistema:

```powershell
.\crear_backup_media.ps1
```

Este script:
1. Busca WinRAR o 7-Zip en tu sistema
2. Comprime `backend/media/*` en `media_backup.rar`
3. Protege el archivo con contraseña `proximidad_2025`
4. Encripta los nombres de archivos para mayor seguridad

**⚠️ IMPORTANTE:** Después de crear el backup:
1. Sube solo `media_backup.rar` a GitHub
2. **NO** subas las carpetas `backend/media/usuarios/` o `backend/media/servicios/imagenes/`

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `.\install.ps1` | Instalación completa del sistema |
| `.\start.ps1` | Iniciar backend y frontend |
| `.\crear_backup_media.ps1` | Crear backup de imágenes con contraseña |
| `.\scripts\ver_ip.ps1` | Ver información de red y estado del sistema |
| `.\backend\build.ps1` | Compilar backend (migraciones, static files) |
| `.\frontend\build.ps1` | Compilar frontend para producción |

## 📁 Estructura del Proyecto

```
proximidad-v2/
├── install.ps1              # ← Instalador principal (PowerShell)
├── install.bat              # ← Wrapper para CMD (llama a install.ps1)
├── start.ps1                # ← Generado por install.ps1
├── crear_backup_media.ps1   # ← Crear backup de imágenes
├── media_backup.rar         # ← Imágenes protegidas (SE SUBE A GIT)
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── build.ps1            # ← Build del backend
│   ├── core/
│   │   ├── settings.py
│   │   └── local_settings.py  # ← Generado por install.ps1 (NO EN GIT)
│   ├── media/
│   │   ├── usuarios/          # ← NO SE SUBE A GIT
│   │   └── servicios/
│   │       └── imagenes/      # ← NO SE SUBE A GIT
│   └── venv/                  # ← NO SE SUBE A GIT
│
├── frontend/
│   ├── package.json
│   ├── build.ps1            # ← Build del frontend
│   ├── .env                 # ← Generado por install.ps1 (NO EN GIT)
│   └── src/
│
└── scripts/
    └── ver_ip.ps1           # ← Utilidad de red
```

## 🔄 Flujo de Trabajo con Git

### Al clonar el repositorio:

```powershell
git clone https://github.com/TuUsuario/ProXimidad.git
cd ProXimidad/proximidad-v2
.\install.ps1
```

El instalador restaurará automáticamente las imágenes desde `media_backup.rar`.

### Al agregar nuevas imágenes:

```powershell
# 1. Las imágenes se guardan automáticamente en backend/media/
#    cuando los usuarios suben fotos desde la aplicación

# 2. Crear backup
.\crear_backup_media.ps1

# 3. Subir solo el backup a Git
git add media_backup.rar
git commit -m "Actualizar imágenes (backup protegido)"
git push
```

### Archivos que NO se suben a Git:

- ❌ `backend/media/usuarios/**` (excepto `.gitkeep`)
- ❌ `backend/media/servicios/**` (excepto `.gitkeep`)
- ❌ `backend/venv/`
- ❌ `backend/core/local_settings.py`
- ❌ `frontend/node_modules/`
- ❌ `frontend/.env`
- ❌ `start.ps1` (se genera automáticamente)

### Archivos que SÍ se suben a Git:

- ✅ `media_backup.rar` (imágenes protegidas con contraseña)
- ✅ `backend/media/usuarios/.gitkeep` (mantiene estructura)
- ✅ `backend/media/servicios/imagenes/.gitkeep` (mantiene estructura)
- ✅ Todos los scripts `.ps1`

## 🌐 Acceso desde Otros Dispositivos

Una vez iniciado el sistema, otros dispositivos en tu red pueden acceder:

```
http://TU_IP:5173
```

Para ver tu IP, ejecuta:

```powershell
.\scripts\ver_ip.ps1
```

## 🗄️ Configuración de Base de Datos

Durante la instalación se te pedirá:

- **Nombre de BD**: `proximidad` (por defecto)
- **Usuario**: `root` (por defecto)
- **Contraseña**: Tu contraseña de MySQL

La configuración se guarda en `backend/core/local_settings.py`.

## 🐛 Solución de Problemas

### Error: "No se puede ejecutar scripts en este sistema"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "WinRAR/7-Zip no encontrado"

Instala una de estas herramientas:
- **WinRAR**: https://www.winrar.es/
- **7-Zip**: https://www.7-zip.org/

### Error: "No se pueden restaurar las imágenes"

Extrae manualmente `media_backup.rar`:
1. Clic derecho → Extraer aquí
2. Contraseña: `proximidad_2025`
3. Asegúrate de que los archivos vayan a `backend/media/`

### Error de conexión a MySQL

Verifica que:
1. MySQL esté corriendo
2. Las credenciales sean correctas
3. La base de datos exista o pueda ser creada

## 📝 Notas Importantes

- **Contraseña del backup**: `proximidad_2025` (no la cambies sin actualizar el instalador)
- **Scripts legacy** (`.bat`): Están siendo reemplazados por versiones PowerShell (`.ps1`)
- **Python 3.11+**: Recomendado para mejor rendimiento
- **Puerto 8000**: Asegúrate de que esté libre para el backend
- **Puerto 5173**: Asegúrate de que esté libre para el frontend

## 🔗 URLs del Sistema

Una vez iniciado:

| Servicio | URL |
|----------|-----|
| Frontend | `http://TU_IP:5173` |
| Backend API | `http://TU_IP:8000/api` |
| Admin Django | `http://TU_IP:8000/admin` |
| Media Files | `http://TU_IP:8000/media` |

## 👥 Contribuir

Al contribuir al proyecto:

1. 🔒 **NUNCA** subas imágenes directamente
2. ✅ Usa `crear_backup_media.ps1` para crear el backup
3. ✅ Sube solo `media_backup.rar`
4. 📝 Documenta cualquier cambio en este README

## 📄 Licencia

[Especificar licencia]

---

**Desarrollado con ❤️ para facilitar la conexión de servicios locales**
