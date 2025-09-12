# ProXimidad - Plataforma de Servicios Locales

![ProXimidad Logo](Lib/Logo-v1.png)

## 📋 Descripción

ProXimidad es una plataforma web que conecta proveedores de servicios locales con usuarios que necesitan dichos servicios. La aplicación permite a los usuarios buscar, contactar y contratar servicios como limpieza, jardinería, plomería, transporte y más en su área local.

## 🚀 Características Principales

### Para Usuarios (Arrendadores)
- ✅ Registro y autenticación con código de verificación
- 🔍 Búsqueda de servicios por categoría
- ⭐ Sistema de favoritos
- 💬 Sistema de comentarios y reseñas
- 📱 Interfaz responsive para móviles y desktop

### Para Proveedores
- 📝 Registro como proveedor de servicios
- 📸 Carga de imágenes para servicios
- 💰 Gestión de precios y descripciones
- 📊 Panel de administración completo

### Funcionalidades Técnicas
- 🔐 Autenticación segura con códigos de verificación
- 🖼️ Gestión de imágenes de servicios y usuarios
- 📱 API REST completa
- 🗄️ Base de datos MySQL optimizada
- 🔄 Sistema de logs detallado

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django 5.0.6** - Framework web principal
- **Django REST Framework** - API REST
- **MySQL** - Base de datos principal
- **Python 3.x** - Lenguaje de programación

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **SCSS** - Preprocesador CSS
- **JavaScript ES6+** - Lenguaje de programación

### Herramientas de Desarrollo
- **Docker** - Containerización
- **ESLint** - Linting de JavaScript
- **Git** - Control de versiones

## 📦 Instalación y Configuración

### Prerrequisitos
- Python 3.8 o superior
- Node.js 18 o superior
- MySQL 8.0 o superior
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/AngelPalaciosN/ProXimidad.git
cd ProXimidad/proXimidad
```

### 2. Configuración del Backend (Django)

#### Crear entorno virtual
```bash
cd Django/proxi
python -m venv venv

# Activar entorno virtual
# Windows:
venv\\Scripts\\activate
# Linux/Mac:
source venv/bin/activate
```

#### Instalar dependencias
```bash
pip install -r ../../requirements.txt
```

#### Configurar base de datos
1. Crear base de datos MySQL llamada `proxima`
2. Importar el archivo SQL:
```bash
mysql -u root -p proxima < ../../database/proxima.sql
```

#### Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
DEBUG=True
SECRET_KEY=django-insecure-+4!lyxyrot*7as_9&mg=o5bd@k@+^l$+3zo@9b6yno#v4ohp3z
DB_NAME=proxima
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=3306
```

#### Ejecutar migraciones (si es necesario)
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Crear superusuario
```bash
python manage.py createsuperuser
```

#### Ejecutar servidor de desarrollo
```bash
python manage.py runserver
```

### 3. Configuración del Frontend (React)

#### Instalar dependencias
```bash
cd ../../  # Volver a la raíz del proyecto
npm install
```

#### Ejecutar servidor de desarrollo
```bash
npm run dev
```

### 4. Usando Docker (Opcional)

```bash
cd docker
docker-compose up -d
```

## 🌐 URLs y Endpoints

### Backend API (Puerto 8000)
- **Admin Panel**: `http://localhost:8000/admin/`
- **API Base**: `http://localhost:8000/api/`

#### Principales Endpoints:
- `GET /api/usuarios/` - Lista de usuarios
- `GET /api/servicios/` - Lista de servicios
- `GET /api/categorias/` - Lista de categorías
- `POST /api/generar-codigo/` - Generar código de verificación
- `POST /api/usuarios/` - Crear usuario
- `GET /api/comentarios/` - Lista de comentarios

### Frontend (Puerto 5173)
- **Aplicación Web**: `http://localhost:5173/`

## 📁 Estructura del Proyecto

```
proXimidad/
├── Django/                     # Backend Django
│   └── proxi/
│       ├── manage.py
│       ├── proxi/              # Configuración del proyecto
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── proxiApp/           # Aplicación principal
│       │   ├── models.py       # Modelos de datos
│       │   ├── views.py        # Vistas/endpoints
│       │   ├── serializer.py   # Serializadores
│       │   ├── admin.py        # Panel de administración
│       │   └── urls.py         # URLs de la app
│       └── media/              # Archivos multimedia
│           ├── usuarios/       # Imágenes de usuarios
│           └── servicios/      # Imágenes de servicios
│               └── imagenes/
├── src/                        # Frontend React
│   ├── components/
│   │   ├── Home.jsx
│   │   └── modules/            # Componentes modulares
│   ├── context/                # Context API
│   └── scss/                   # Estilos SCSS
├── public/                     # Archivos públicos
├── database/                   # Scripts de base de datos
│   └── proxima.sql
├── docker/                     # Configuración Docker
└── Lib/                        # Recursos y assets
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno Importantes

#### Django Settings
- `DEBUG`: Modo debug (True/False)
- `SECRET_KEY`: Clave secreta de Django
- `ALLOWED_HOSTS`: Hosts permitidos
- `DATABASE_URL`: URL de conexión a la base de datos

#### Archivos de Configuración
- `package.json`: Dependencias y scripts de Node.js
- `requirements.txt`: Dependencias de Python
- `vite.config.js`: Configuración de Vite
- `eslint.config.js`: Configuración de ESLint

## 🗄️ Base de Datos

### Modelos Principales

#### Usuario
- Información personal completa
- Tipo de usuario (proveedor/arrendador)
- Sistema de verificación por código
- Imagen de perfil

#### Servicios
- Información del servicio
- Precios y descripciones
- Imágenes (campo nuevo y URL)
- Relación con proveedor y categoría

#### Categorías
- Clasificación de servicios
- Descripción de categorías

#### Comentarios y Favoritos
- Sistema de interacción entre usuarios
- Reseñas de servicios

## 🧪 Testing

### Ejecutar tests del backend
```bash
cd Django/proxi
python manage.py test
```

### Linting del frontend
```bash
npm run lint
```

## 📝 Códigos de Verificación

El sistema de códigos de verificación ahora muestra el código generado en la consola del servidor para facilitar el debugging durante el desarrollo:

```
=== CÓDIGO DE VERIFICACIÓN GENERADO ===
Usuario: Juan Pérez
Email: juan@example.com
Código: 123456
=====================================
```

## 🔄 Nuevas Características Implementadas

### Sistema de Imágenes Mejorado
- ✅ Nuevo campo `imagen` en el modelo Servicios
- ✅ Carpetas organizadas para imágenes de servicios
- ✅ Serializer actualizado con URLs relativas (corrige duplicación)
- ✅ Panel de administración mejorado
- ✅ Compatibilidad con URLs externas
- ✅ Optimización automática de imágenes (resolución y calidad)
- ✅ URLs corregidas para evitar duplicación con VITE_API_BASE_URL

### Mejoras en el Código
- ✅ Función utilitaria para manejo de errores
- ✅ Logs mejorados y más informativos
- ✅ Código optimizado y limpio
- ✅ Documentación completa
- ✅ Procesador de imágenes automático
- ✅ URLs relativas en lugar de absolutas

### Corrección de URLs Duplicadas
**Problema resuelto**: Las URLs de imágenes ya no se duplican
- **Antes**: `http://192.168.1.101:8000/apihttp://192.168.1.101:8000/media/usuarios/imagen.jpg`
- **Ahora**: `http://192.168.1.101:8000/media/usuarios/imagen.jpg`

**Solución**: Los serializers ahora devuelven URLs relativas (`/media/usuarios/imagen.jpg`) que el frontend concatena correctamente con `VITE_API_BASE_URL`.

## 🚀 Deployment

### Para Producción
1. Configurar `DEBUG=False` en settings.py
2. Configurar `ALLOWED_HOSTS` apropiadamente
3. Usar servidor web como Nginx + Gunicorn
4. Configurar base de datos de producción
5. Configurar servidor de correo para códigos de verificación

### Variables de Entorno de Producción
```env
DEBUG=False
SECRET_KEY=tu_clave_secreta_super_segura
DB_HOST=tu_servidor_db
EMAIL_HOST=tu_servidor_email
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Angel Palacios** - *Desarrollador Principal* - [@AngelPalaciosN](https://github.com/AngelPalaciosN)

## 📞 Soporte

Si tienes alguna pregunta o problema:
- Crea un [Issue](https://github.com/AngelPalaciosN/ProXimidad/issues)
- Contacta al desarrollador

## 🔮 Próximas Características

- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa
- [ ] Sistema de calificaciones más avanzado
- [ ] Geolocalización de servicios
- [ ] Chat en tiempo real entre usuarios

---

*Desarrollado con ❤️ para conectar comunidades locales*
