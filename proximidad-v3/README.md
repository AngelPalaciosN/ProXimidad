# 🚀 ProXimidad - Plataforma de Servicios

Plataforma web full-stack para gestión y búsqueda de servicios profesionales.

---

## 📋 Índice

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación-rápida)
- [Uso](#-uso)
- [Estructura](#-estructura)
- [Scripts](#-scripts)
- [Desarrollo](#-desarrollo)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema seguro de login/registro
- 👤 **Perfiles personalizados** - Banner y foto de perfil
- 📱 **Servicios** - Publicación, búsqueda y gestión
- 🏷️ **Categorías** - Con iconos y colores personalizados
- ⭐ **Favoritos** - Sistema de guardado de servicios
- 💬 **Comentarios** - Calificaciones y reviews
- 📍 **Filtros** - Por ubicación, precio y categoría
- 📊 **Dashboards** - Para clientes y proveedores
- 🎨 **Diseño responsive** - Móvil, tablet y desktop
- 🌈 **SCSS modular** - Arquitectura base/abstracts/components

---

## 🛠️ Tecnologías

### Backend
- Python 3.8+
- Django 4.x + Django REST Framework
- MySQL 8.0
- JWT Authentication

### Frontend
- React 18
- Vite (build tool)
- Bootstrap 5 + SCSS
- React Router + Axios

---

## 📦 Requisitos

### Obligatorio
- ✅ Python 3.8+ → [Descargar](https://www.python.org/)
- ✅ Node.js 16+ → [Descargar](https://nodejs.org/)
- ✅ MySQL 8.0+ → [Descargar](https://www.mysql.com/) o Laragon
- ✅ Git → [Descargar](https://git-scm.com/)

### Recomendado
- WinRAR (para backups)
- Laragon (servidor local todo-en-uno)

---

## 🚀 Instalación Rápida

### 1. Clonar repositorio
```bash
git clone https://github.com/AngelPalaciosN/ProXimidad.git
cd ProXimidad/proximidad-v2
```

### 2. Ejecutar instalador
```powershell
cd scripts
.\install.ps1
```

**Solicita:**
- Contraseña del backup RAR (si existe)
- Usuario MySQL (default: root)
- Contraseña MySQL

**Hace:**
- ✅ Valida Python 3.8+, Node 16+, MySQL
- ✅ Detecta IP local automáticamente
- ✅ Restaura backup de imágenes
- ✅ Crea entorno virtual Python
- ✅ Instala dependencias (backend + frontend)
- ✅ Importa base de datos MySQL
- ✅ Configura Django + Vite
- ✅ Actualiza `baseline-browser-mapping`

### 3. Iniciar aplicación
```powershell
.\start.ps1
```

**Acceso:**
- 🌐 Frontend: `http://TU_IP:5173`
- 🔧 Backend: `http://TU_IP:8000`
- 🔑 Admin: `http://TU_IP:8000/admin`

---

## 💻 Uso

### Inicio diario
```powershell
cd scripts
.\start.ps1
```

### Crear backup
```powershell
cd scripts
.\crear_backup.ps1
```

Genera:
- `database/proxima_refinado.sql` - BD actual
- `media_backup.rar` - Imágenes protegidas

### Subir a GitHub
```bash
git add database/proxima_refinado.sql media_backup.rar
git commit -m "Actualizar backup"
git push
```

---

## 📁 Estructura

```
proximidad-v2/
├── backend/               # Django
│   ├── core/             # Config
│   │   ├── settings.py
│   │   └── local_settings.py (auto-generada)
│   ├── proximidad_app/   # App principal
│   │   ├── models.py     # Usuario, Servicios, etc.
│   │   ├── serializer.py
│   │   ├── views.py
│   │   └── auth_views.py # JWT
│   ├── media/            # Archivos subidos
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── modules/  # Header, Footer, Dashboard, etc.
│   │   ├── scss/
│   │   │   ├── abstracts/ # Variables, mixins
│   │   │   ├── base/      # Reset, typography
│   │   │   ├── components/ # Estilos componentes
│   │   │   └── style.scss # Entry point
│   │   ├── context/      # UserContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env (auto-generada)
│
├── database/             # SQL dumps
│   └── proxima_refinado.sql
│
├── scripts/              # Automatización
│   ├── install.ps1       # Instalación
│   ├── start.ps1         # Inicio
│   ├── crear_backup.ps1  # Backup BD + imágenes
│   ├── ver_ip.ps1        # Detectar IP
│   └── README.md         # Docs scripts
│
├── media_backup.rar      # Backup protegido
└── README.md             # Este archivo
```

---

## 📜 Scripts

### `install.ps1`
Instalación completa desde cero.
```powershell
cd scripts
.\install.ps1
```

### `start.ps1`
Inicia backend + frontend.
```powershell
.\start.ps1
```

### `crear_backup.ps1`
Exporta BD y comprime imágenes.
```powershell
.\crear_backup.ps1
```

### `ver_ip.ps1`
Muestra IP local.
```powershell
.\ver_ip.ps1
```

---

## 💻 Desarrollo

### Backend
```bash
cd backend
.\venv\Scripts\Activate.ps1

python manage.py runserver 0.0.0.0:8000
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Frontend
```bash
cd frontend
npm run dev       # Dev server
npm run build     # Build producción
npm run preview   # Preview build
```

### SCSS
Compila automáticamente con Vite:
- `abstracts/` - Variables, mixins
- `base/` - Reset, typography
- `components/` - Estilos componentes
- `style.scss` - Entry point

---

## ⚙️ Configuración

### Backend (`backend/core/local_settings.py`)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proxima',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://TU_IP:5173",
]
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://TU_IP:8000
```

---

## 🐛 Solución de Problemas

### MySQL no está corriendo
**Solución:** Inicia Laragon o MySQL Server.

### Python/Node no encontrado
**Solución:** Instala Python 3.8+ / Node 16+ y agrégalos a PATH.

### No se importa database/proxima_refinado.sql
**Solución:**
1. Verifica MySQL corriendo
2. Comprueba credenciales MySQL
3. Importa manual: `mysql -u root < database/proxima_refinado.sql`

### Frontend no carga datos
**Solución:**
1. Backend corriendo en `http://TU_IP:8000`
2. Revisa `frontend/.env`
3. Verifica CORS en `local_settings.py`

### Port 8000 ocupado
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process
```

---

## 🔒 Seguridad

### Base de Datos
- SQL en `database/proxima_refinado.sql` (sin contraseña)
- Credenciales en `local_settings.py` (no se sube)

### Imágenes
- RAR protegido: `media_backup.rar`
- Contraseña default: `proximidad_2025`
- `backend/media/` NO se sube a Git

### .gitignore
```
backend/venv/
backend/core/local_settings.py
backend/media/**
frontend/node_modules/
frontend/dist/
.env
```

---

## 🚀 Producción

### Build frontend
```bash
cd frontend
npm run build
```

### Config Django producción
```python
DEBUG = False
ALLOWED_HOSTS = ['tu-dominio.com']
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

### Recolectar estáticos
```bash
python manage.py collectstatic
```

---

## 👥 Autor

**Angel Palacios** - [@AngelPalaciosN](https://github.com/AngelPalaciosN)

---

## 📝 Licencia

Proyecto privado - **ProXimidad**

---

**📖 Más info:** Ver `scripts/README.md` para documentación detallada de scripts.
