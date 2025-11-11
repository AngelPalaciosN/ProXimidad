# 🚀 ProXimidad - Sistema de Servicios Locales

Sistema completo de gestión de servicios con backend Django y frontend React+Vite.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Automática](#instalación-automática)
3. [Gestión de Imágenes](#gestión-de-imágenes)
4. [Configuración Manual](#configuración-manual)
5. [Ejecución del Proyecto](#ejecución-del-proyecto)
6. [Distribución](#distribución)
7. [Estructura del Proyecto](#estructura-del-proyecto)

---

## 🔧 Requisitos Previos

Antes de instalar, asegúrate de tener instalado:

- **Python** 3.8 o superior ([descargar](https://www.python.org/downloads/))
- **Node.js** 16.x o superior ([descargar](https://nodejs.org/))
- **MySQL Server** 5.7 o superior ([descargar](https://dev.mysql.com/downloads/installer/))
- **Git** (opcional, para clonar el repositorio)

---

## 🎯 Instalación Automática

### Opción 1: Instalación Rápida (Recomendada)

1. **Ejecuta el instalador:**
   ```batch
   install.bat
   ```

2. **Sigue las instrucciones:**
   - El script verificará los requisitos
   - Creará las carpetas necesarias
   - Instalará dependencias automáticamente
   - Te pedirá las credenciales de MySQL
   - Generará los scripts de inicio

3. **Ingresa tus credenciales de MySQL cuando se soliciten:**
   - Nombre de la base de datos (ej: `proximidad_db`)
   - Usuario de MySQL (ej: `root`)
   - Contraseña de MySQL
   - Host (por defecto: `localhost`)
   - Puerto (por defecto: `3306`)

4. **¡Listo!** El sistema está instalado y configurado.

---

## 🖼️ Gestión de Imágenes

### ¿Por qué no están las imágenes en Git?

Las imágenes se mantienen separadas del repositorio Git para:
- ✅ Reducir el tamaño del repositorio
- ✅ Evitar conflictos de merge con archivos binarios
- ✅ Facilitar actualizaciones de código sin afectar imágenes
- ✅ Permitir backups independientes

### 📦 Crear Backup de Imágenes

**Antes de compartir el proyecto o hacer backup:**

```batch
backup_imagenes.bat
```

Este script:
- Comprime todas las imágenes de `backend/media/`
- Crea el archivo `media_backup.zip`
- Muestra el tamaño del backup
- **NO se sube a Git** (está en `.gitignore`)

### 📥 Restaurar Imágenes

**Después de instalar en una PC nueva:**

1. **Automático (durante instalación):**
   - Si `media_backup.zip` existe, `install.bat` lo descomprime automáticamente

2. **Manual (después de la instalación):**
   ```batch
   restaurar_imagenes.bat
   ```

### 🔄 Flujo de Trabajo con Imágenes

#### Para el Desarrollador Original:

```batch
# 1. Crear backup antes de distribuir
backup_imagenes.bat

# 2. Compartir:
#    - Código fuente (Git)
#    - media_backup.zip (Drive/servidor)
```

#### Para Otros Desarrolladores:

```batch
# 1. Clonar repositorio
git clone https://github.com/AngelPalaciosN/ProXimidad.git
cd proximidad-v2

# 2. Copiar media_backup.zip al directorio raíz

# 3. Ejecutar instalación
install.bat

# (Las imágenes se restauran automáticamente)
```

---

## ⚙️ Configuración Manual

Si prefieres configurar manualmente o necesitas personalizar:

### Backend (Django)

1. **Crear entorno virtual:**
   ```batch
   cd backend
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Instalar dependencias:**
   ```batch
   pip install -r requirements.txt
   ```

3. **Configurar base de datos:**
   - Crea el archivo `backend/proxi/local_settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'tu_base_datos',
           'USER': 'tu_usuario',
           'PASSWORD': 'tu_contraseña',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

4. **Aplicar migraciones:**
   ```batch
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Crear superusuario (opcional):**
   ```batch
   python manage.py createsuperuser
   ```

### Frontend (React+Vite)

1. **Instalar dependencias:**
   ```batch
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno:**
   - Crea el archivo `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

---

## 🚀 Ejecución del Proyecto

### Opción 1: Scripts Automáticos (Recomendado)

**Después de ejecutar `install.bat`, usa:**

- **Iniciar todo:**
  ```batch
  start_all.bat
  ```

- **Solo backend:**
  ```batch
  start_backend.bat
  ```

- **Solo frontend:**
  ```batch
  start_frontend.bat
  ```

### Opción 2: Manual

**Terminal 1 - Backend:**
```batch
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```batch
cd frontend
npm run dev
```

### 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Admin Django:** http://localhost:8000/admin

---

## 📤 Distribución

### Crear Paquete Distribuible

```batch
package.bat
```

Esto crea `ProXimidad_Distribuible/` con:
- ✅ Código fuente limpio
- ✅ Scripts de instalación
- ✅ Documentación
- ❌ Sin archivos sensibles (.env, contraseñas)
- ❌ Sin dependencias pesadas (node_modules, venv)

### Compartir el Proyecto

**Para compartir con otros desarrolladores:**

1. **Comprimir carpeta:**
   ```
   ProXimidad_Distribuible.zip (del package.bat)
   ```

2. **Compartir por separado:**
   - `media_backup.zip` (imágenes) → Drive/servidor
   - Código fuente → Git o carpeta comprimida

3. **Instrucciones para el receptor:**
   - Descomprimir `ProXimidad_Distribuible.zip`
   - Copiar `media_backup.zip` al directorio raíz
   - Ejecutar `install.bat`

---

## 📁 Estructura del Proyecto

```
proximidad-v2/
│
├── backend/                    # Django Backend
│   ├── proxi/                 # Configuración del proyecto
│   │   ├── settings.py       # Configuración principal
│   │   ├── local_settings.py # Config local (NO en Git)
│   │   └── urls.py           # Rutas principales
│   │
│   ├── proxiApp/             # Aplicación principal
│   │   ├── models.py         # Modelos (Usuario, Servicios, Favoritos)
│   │   ├── views.py          # Endpoints de API
│   │   ├── serializer.py     # Serializadores DRF
│   │   └── urls.py           # Rutas de la app
│   │
│   ├── media/                # Imágenes (NO en Git)
│   │   ├── usuarios/         # Fotos de perfil
│   │   └── servicios/        # Imágenes de servicios
│   │       └── imagenes/
│   │
│   ├── venv/                 # Entorno virtual (NO en Git)
│   ├── requirements.txt      # Dependencias Python
│   └── manage.py             # Script de Django
│
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── Home.jsx
│   │   │   └── modules/
│   │   │       ├── Header.jsx
│   │   │       ├── Lista_usuarios.jsx
│   │   │       ├── Registrar.jsx
│   │   │       └── ...
│   │   │
│   │   ├── context/          # Context API
│   │   │   └── UserContext.jsx
│   │   │
│   │   ├── scss/             # Estilos
│   │   │   ├── style.scss
│   │   │   └── component-styles/
│   │   │
│   │   ├── App.jsx           # Componente raíz
│   │   └── main.jsx          # Punto de entrada
│   │
│   ├── public/               # Recursos estáticos
│   ├── node_modules/         # Dependencias (NO en Git)
│   ├── .env                  # Variables de entorno (NO en Git)
│   ├── package.json          # Dependencias Node
│   └── vite.config.js        # Configuración Vite
│
├── database/                  # SQL
│   └── proxima.sql           # Schema de base de datos
│
├── install.bat               # Instalador automático
├── backup_imagenes.bat       # Crear backup de imágenes
├── restaurar_imagenes.bat    # Restaurar imágenes
├── media_backup.zip          # Backup de imágenes (NO en Git)
│
├── start_backend.bat         # Iniciar backend (generado)
├── start_frontend.bat        # Iniciar frontend (generado)
├── start_all.bat             # Iniciar todo (generado)
│
├── .gitignore               # Archivos excluidos de Git
└── README.md                # Este archivo
```

---

## 🔒 Archivos Protegidos (NO en Git)

Estos archivos se generan localmente y **NO se suben a GitHub**:

- `backend/proxi/local_settings.py` - Credenciales de base de datos
- `backend/media/` - Imágenes de usuarios y servicios
- `backend/venv/` - Entorno virtual Python
- `frontend/.env` - Variables de entorno
- `frontend/node_modules/` - Dependencias Node
- `media_backup.zip` - Backup de imágenes
- `*.pyc`, `__pycache__/` - Archivos compilados Python
- `*.log` - Logs de aplicación

---

## 🛠️ Comandos Útiles

### Backend

```batch
# Activar entorno virtual
cd backend
venv\Scripts\activate

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

# Shell interactivo
python manage.py shell
```

### Frontend

```batch
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Linter
npm run lint
```

### Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE proximidad_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario
CREATE USER 'proximidad_user'@'localhost' IDENTIFIED BY 'tu_contraseña';

-- Dar permisos
GRANT ALL PRIVILEGES ON proximidad_db.* TO 'proximidad_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🐛 Solución de Problemas

### Error: "No module named 'mysqlclient'"

```batch
cd backend
venv\Scripts\activate
pip install mysqlclient
```

### Error: Puerto 8000 en uso

```batch
# Buscar proceso usando el puerto
netstat -ano | findstr :8000

# Matar proceso
taskkill /PID [número_de_proceso] /F
```

### Error: Puerto 5173 en uso (Vite)

```batch
# Buscar proceso
netstat -ano | findstr :5173

# Matar proceso
taskkill /PID [número_de_proceso] /F
```

### Error: "Access denied for user"

Verifica las credenciales en `backend/proxi/local_settings.py`

### Imágenes no se muestran

1. Verifica que exista `backend/media/`
2. Ejecuta `restaurar_imagenes.bat` si tienes el backup
3. Verifica permisos de carpetas

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección [Solución de Problemas](#solución-de-problemas)
2. Verifica los logs:
   - Backend: `backend/django.log`
   - Frontend: Consola del navegador (F12)
3. Consulta la documentación de:
   - [Django](https://docs.djangoproject.com/)
   - [React](https://react.dev/)
   - [Vite](https://vitejs.dev/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

## 👥 Autores

- **Desarrollo Principal** - ProXimidad Team
- **Backend** - Django REST Framework
- **Frontend** - React + Vite

---

## 🎯 Próximas Características

- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Sistema de valoraciones y reseñas
- [ ] Pasarela de pagos
- [ ] Aplicación móvil (React Native)
- [ ] Panel de administración mejorado

---

## 📝 Changelog

### v2.0.0 (Actual)
- ✅ Sistema de favoritos por usuario
- ✅ Optimización automática de imágenes
- ✅ Instalación automatizada
- ✅ Sistema de backup de imágenes
- ✅ Separación de imágenes del repositorio Git
- ✅ Scripts de inicio automáticos
- ✅ Protección de archivos sensibles

### v1.0.0
- Versión inicial con CRUD básico
- Autenticación de usuarios
- Registro de servicios

---

**¡Gracias por usar ProXimidad! 🚀**
