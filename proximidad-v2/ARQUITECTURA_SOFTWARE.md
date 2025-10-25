# 📐 DOCUMENTO DE ARQUITECTURA DE SOFTWARE
## ProXimidad v2.0

---

## 📋 TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Visión General del Sistema](#visión-general-del-sistema)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Componentes Backend](#componentes-backend)
5. [Componentes Frontend](#componentes-frontend)
6. [Modelo de Datos](#modelo-de-datos)
7. [APIs y Endpoints](#apis-y-endpoints)
8. [Seguridad](#seguridad)
9. [Infraestructura y Despliegue](#infraestructura-y-despliegue)
10. [Patrones de Diseño](#patrones-de-diseño)
11. [Optimizaciones y Rendimiento](#optimizaciones-y-rendimiento)

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento
Este documento describe la arquitectura de software del sistema **ProXimidad v2.0**, una plataforma web para conectar proveedores de servicios con clientes potenciales en una zona geográfica específica.

### 1.2 Alcance
- **Nombre del Sistema**: ProXimidad
- **Versión**: 2.0.0
- **Fecha**: Octubre 2025
- **Estado**: Desarrollo Activo

### 1.3 Stakeholders
- **Desarrolladores**: Equipo de desarrollo
- **Usuarios Finales**: Proveedores de servicios y clientes
- **Administradores**: Personal de gestión de la plataforma

### 1.4 Referencias
- Django 5.0.6 Documentation
- React 18.3.1 Documentation
- REST Framework Documentation
- Material-UI Documentation

---

## 2. VISIÓN GENERAL DEL SISTEMA

### 2.1 Descripción del Sistema
ProXimidad es una plataforma marketplace que facilita la conexión entre:
- **Proveedores**: Profesionales que ofrecen servicios
- **Arrendadores**: Personas que ofrecen espacios o propiedades
- **Clientes**: Usuarios que buscan y contratan servicios

### 2.2 Objetivos del Sistema
1. **Conectividad Local**: Facilitar búsqueda de servicios cercanos
2. **Gestión de Servicios**: CRUD completo de servicios y perfiles
3. **Sistema de Favoritos**: Marcar usuarios y servicios preferidos
4. **Autenticación Segura**: Sistema de verificación por código
5. **Escalabilidad**: Arquitectura preparada para crecimiento

### 2.3 Características Principales
- ✅ Registro y autenticación de usuarios
- ✅ Publicación y búsqueda de servicios
- ✅ Sistema de categorías
- ✅ Gestión de favoritos (usuarios y servicios)
- ✅ Perfiles de usuario con imágenes y banners
- ✅ Sistema de comentarios y calificaciones
- ✅ Dashboard con estadísticas
- ✅ Búsqueda y filtrado avanzado
- ✅ Responsive design para móviles

---

## 3. ARQUITECTURA DEL SISTEMA

### 3.1 Estilo Arquitectónico
**Arquitectura Cliente-Servidor con API REST**

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React SPA (Single Page App)                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │   │
│  │  │ Components │  │   Context  │  │    Router    │  │   │
│  │  │   (UI)     │  │   (State)  │  │  (Navigation)│  │   │
│  │  └────────────┘  └────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS (REST API)
                           │ JSON
┌──────────────────────────▼──────────────────────────────────┐
│                      SERVIDOR                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Django REST Framework                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │   │
│  │  │   Views    │  │   Models   │  │ Serializers  │  │   │
│  │  │  (Logic)   │  │   (ORM)    │  │  (Data)      │  │   │
│  │  └────────────┘  └────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ MySQL Protocol
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    BASE DE DATOS                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  MySQL 8.0+                          │   │
│  │           (Laragon / Servidor dedicado)             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Patrón Arquitectónico Principal
**MVC (Model-View-Controller) + REST API**

- **Model**: Django ORM + MySQL
- **View**: React Components
- **Controller**: Django Views + React Hooks

### 3.3 Stack Tecnológico

#### **Backend**
```yaml
Framework: Django 5.0.6
API: Django REST Framework 3.x
Autenticación: SimpleJWT (JSON Web Tokens)
Base de Datos: MySQL 8.0+
ORM: Django ORM
Servidor Web Dev: Django Development Server
CORS: django-cors-headers
Validación: Django Validators
```

#### **Frontend**
```yaml
Framework: React 18.3.1
Bundler: Vite 6.2.2
Routing: React Router DOM 7.6.2
Estado Global: Context API
HTTP Client: Axios 1.7.7
UI Library: Material-UI 6.1.8 + Bootstrap 5.3.3
Animaciones: Framer Motion 12.7.4
Iconos: React Icons 5.4.0 + Lucide React
Alertas: SweetAlert2 11.6.13
Estilos: SASS 1.93.2
```

#### **Base de Datos**
```yaml
Motor: MySQL 8.0+
Entorno Dev: Laragon
Charset: utf8mb4
Collation: utf8mb4_unicode_ci
```

---

## 4. COMPONENTES BACKEND

### 4.1 Estructura de Directorios

```
backend/
├── core/                      # Configuración principal
│   ├── settings.py           # Configuración Django
│   ├── urls.py               # URLs principales
│   ├── wsgi.py              # WSGI entry point
│   └── asgi.py              # ASGI entry point
│
├── proximidad_app/           # Aplicación principal
│   ├── models.py            # Modelos de datos
│   ├── serializer.py        # Serializers REST
│   ├── views.py             # Vistas estándar
│   ├── views_optimizadas.py # Vistas optimizadas v2
│   ├── auth_views.py        # Vistas de autenticación
│   ├── urls.py              # URLs de la app
│   ├── admin.py             # Admin Django
│   │
│   ├── management/          # Comandos personalizados
│   │   └── commands/
│   │       └── crear_servicios_rapidos.py
│   │
│   └── migrations/          # Migraciones DB
│
├── media/                    # Archivos subidos
│   ├── usuarios/            # Fotos de perfil y banners
│   └── servicios/           # Imágenes de servicios
│
├── staticfiles/             # Archivos estáticos
├── manage.py                # CLI Django
├── requirements.txt         # Dependencias Python
└── .env                     # Variables de entorno
```

### 4.2 Modelos de Datos (Django ORM)

#### **4.2.1 Usuario**
```python
class Usuario(models.Model):
    id: BigAutoField (PK)
    nombre_completo: CharField(100)
    correo_electronico: CharField(100, unique)
    telefono: CharField(15)
    direccion: CharField(200)
    cedula: CharField(100, unique)
    codigo_verificacion: IntegerField
    tipo_usuario: CharField(50)  # 'proveedor' | 'arrendador'
    imagen: ImageField
    banner: ImageField
    fecha_registro: DateTimeField
    ultima_actualizacion: DateTimeField
    activo: BooleanField
    
    # Índices: correo, cedula, tipo_usuario, activo
```

#### **4.2.2 Servicios**
```python
class Servicios(models.Model):
    id: BigAutoField (PK)
    nombre_servicio: CharField(100)
    descripcion: TextField
    precio_base: DecimalField(10, 2)
    imagen: ImageField
    imagen_url: CharField(255)
    activo: BooleanField
    destacado: BooleanField
    views: PositiveIntegerField
    ubicacion: CharField(200)
    categoria: ForeignKey(Categoria)
    proveedor: ForeignKey(Usuario)
    fecha_creacion: DateTimeField
    fecha_actualizacion: DateTimeField
    
    # Índices: nombre, precio, activo+destacado, categoria, proveedor
```

#### **4.2.3 Categoria**
```python
class Categoria(models.Model):
    categoria_id: BigAutoField (PK)
    nombre_categoria: CharField(100)
    descripcion_categoria: TextField
    icono: CharField(50)
    color: CharField(7)
    orden: PositiveIntegerField
    activo: BooleanField
    
    # Índices: nombre, activo+orden
```

#### **4.2.4 Favoritos**
```python
class Favoritos(models.Model):
    id: BigAutoField (PK)
    usuario_id: ForeignKey(Usuario)
    favorito_usuario: ForeignKey(Usuario, null)
    favorito_servicio: ForeignKey(Servicios, null)
    tipo_favorito: CharField(10)  # 'usuario' | 'servicio'
    fecha_agregado: DateTimeField
    
    # Índices: usuario+tipo, favorito_usuario, favorito_servicio
```

#### **4.2.5 Comentarios**
```python
class Comentarios(models.Model):
    comentario_id: BigAutoField (PK)
    mensaje: TextField
    calificacion: PositiveSmallIntegerField(1-5)
    servicio_fk: ForeignKey(Servicios)
    usuario_fk: ForeignKey(Usuario)
    fecha_creacion: DateTimeField
    activo: BooleanField
    
    # Índices: servicio, usuario, fecha, calificacion
```

### 4.3 Serializers

#### **Estrategia de Serialización**
1. **Serializers Completos**: Para operaciones CRUD
2. **Serializers Básicos**: Para referencias anidadas
3. **Serializers Optimizados**: Con select_related y prefetch_related

```python
# Ejemplo: UsuarioSerializer
class UsuarioSerializer(serializers.ModelSerializer):
    imagen_url = SerializerMethodField()
    banner_url = SerializerMethodField()
    servicios_count = SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [...]
        read_only_fields = ['id', 'fecha_registro']
```

### 4.4 Vistas y Endpoints

#### **4.4.1 Vistas Estándar (views.py)**
- `usuarios_list()`: Lista todos los usuarios
- `servicios_list()`: Lista todos los servicios
- `crear_servicio()`: Crea nuevo servicio
- `actualizar_servicio()`: Actualiza servicio existente
- `eliminar_servicio()`: Elimina servicio
- `agregar_favorito()`: Añade favorito
- `obtener_favoritos()`: Lista favoritos del usuario
- `generar_codigo()`: Genera código de verificación
- `login_usuario()`: Autenticación

#### **4.4.2 Vistas Optimizadas v2 (views_optimizadas.py)**
- `ServiciosOptimizadosListView`: Vista basada en clase con paginación
- `servicios_por_categoria_optimizado()`: Filtrado eficiente por categoría
- `busqueda_avanzada_servicios()`: Búsqueda con múltiples filtros
- `servicios_recomendados()`: Algoritmo de recomendación
- `dashboard_estadisticas()`: Métricas del sistema

### 4.5 Autenticación y Seguridad

#### **Sistema de Autenticación**
```python
# Flujo de autenticación por código:
1. Usuario ingresa correo → generar_codigo()
2. Backend genera código aleatorio de 6 dígitos
3. Código se almacena en Usuario.codigo_verificacion
4. Usuario ingresa código → login_usuario()
5. Backend valida código y devuelve datos de usuario
6. Frontend almacena en localStorage

# JWT (opcional, configurado pero no usado actualmente)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=1440),
}
```

#### **Configuración CORS**
```python
CORS_ALLOW_ALL_ORIGINS = True  # Desarrollo
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
```

### 4.6 Gestión de Archivos Multimedia

#### **Estrategia de Almacenamiento**
```python
# Usuarios: media/usuarios/{uuid}.{ext}
def upload_to_usuarios(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('usuarios', filename)

# Servicios: media/servicios/{uuid}.{ext}
def upload_to_servicios(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('servicios', filename)

# Configuración
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
```

---

## 5. COMPONENTES FRONTEND

### 5.1 Estructura de Directorios

```
frontend/
├── public/                   # Assets estáticos
├── src/
│   ├── main.jsx             # Entry point
│   ├── App.jsx              # Componente raíz
│   ├── Auth.jsx             # Context de autenticación
│   │
│   ├── components/          # Componentes React
│   │   ├── Home.jsx        # Página principal
│   │   └── modules/
│   │       ├── Header.jsx           # Navbar
│   │       ├── Footer.jsx           # Footer
│   │       ├── Iniciar.jsx          # Login
│   │       ├── Registrar.jsx        # Registro
│   │       ├── validar.jsx          # Validación código
│   │       ├── Lista_usuarios.jsx   # Directorio usuarios
│   │       ├── ClientDashboard.jsx  # Servicios
│   │       ├── Editar_p.jsx         # Editar perfil
│   │       ├── BuscarS.jsx          # Búsqueda
│   │       ├── Sec1.jsx             # Sección hero
│   │       ├── Sec2.jsx             # Características
│   │       ├── Sec3.jsx             # CTA
│   │       ├── ServiceDetailModal.jsx    # Modal servicio
│   │       └── ServiceRequestModal.jsx   # Modal solicitud
│   │
│   ├── context/             # Context API
│   │   └── UserContext.jsx # Estado usuarios
│   │
│   ├── config/              # Configuración
│   │   └── env.js          # Variables entorno
│   │
│   └── scss/                # Estilos
│       ├── style.scss      # Estilos globales
│       ├── _variables.scss # Variables SASS
│       ├── _responsive.scss# Media queries
│       └── component-styles/
│           ├── Header.scss
│           ├── Footer.scss
│           ├── ClientDashboard.scss
│           ├── Registrar.scss
│           └── [...]
│
├── .env                     # Variables entorno
├── vite.config.js          # Configuración Vite
├── package.json            # Dependencias Node
└── eslint.config.js        # Configuración ESLint
```

### 5.2 Arquitectura de Componentes

#### **5.2.1 Jerarquía de Componentes**
```
App (Router + Providers)
├── AuthProvider (Context)
│   └── UserProvider (Context)
│       └── BrowserRouter
│           ├── Route: / → Home
│           │   ├── Header
│           │   ├── Sec1 (Hero)
│           │   ├── Sec2 (Features)
│           │   ├── Sec3 (CTA)
│           │   └── Footer
│           │
│           ├── Route: /Iniciar → IniciarSe
│           │   ├── Header
│           │   ├── Form Login
│           │   └── validar (Código)
│           │
│           ├── Route: /usuarios → Lista_usuarios
│           │   ├── Header
│           │   ├── Search + Filters
│           │   ├── Tabs (Todos/Favoritos/Proveedores)
│           │   ├── User Cards Grid
│           │   ├── Pagination
│           │   └── User Detail Modal
│           │
│           └── Route: /servicios → ClientDashboard
│               ├── Header
│               ├── Search + Filters
│               ├── Category Tabs
│               ├── Service Cards Grid
│               ├── ServiceDetailModal
│               └── ServiceRequestModal
```

### 5.3 Gestión de Estado

#### **5.3.1 Context API**

**AuthContext (Auth.jsx)**
```javascript
// Estado global de autenticación
{
  user: Usuario | null,
  loading: boolean,
  error: string | null,
  
  // Métodos
  loginWithPassword(credentials),
  loginWithCode(credentials),
  generateCode(email),
  register(userData),
  updateUser(userId, userData),
  logout()
}
```

**UserContext (UserContext.jsx)**
```javascript
// Estado global de usuarios
{
  usuarios: Usuario[],
  loading: boolean,
  error: string | null,
  
  // Métodos
  fetchUsuarios(excluirUsuario?)
}
```

#### **5.3.2 Estado Local**
- `useState` para formularios
- `useEffect` para ciclo de vida
- `useCallback` para memorización de funciones
- `useMemo` (potencial optimización)

### 5.4 Routing

```javascript
// App.jsx - Configuración de rutas
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/usuarios" element={<ListaUsuarios />} />
  <Route path="/servicios" element={<ClientDashboard />} />
  <Route path="/Iniciar" element={<IniciarSe />} />
</Routes>
```

### 5.5 Comunicación con Backend

#### **5.5.1 Configuración Axios**
```javascript
// config/env.js
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://10.1.104.36:8000/api',
  // ... otras configs
}

export const buildApiUrl = (endpoint) => {
  const baseUrl = config.API_BASE_URL.endsWith('/') 
    ? config.API_BASE_URL.slice(0, -1) 
    : config.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
```

#### **5.5.2 Peticiones HTTP**
```javascript
// Ejemplo: Fetch servicios
const response = await axios.get(buildApiUrl('/servicios/'));

// Ejemplo: Crear servicio
const response = await axios.post(buildApiUrl('/servicios/crear/'), formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Ejemplo: Agregar favorito
const response = await axios.post(buildApiUrl('/favoritos/'), {
  usuario_id: user.id,
  favorito_id: servicioId,
  tipo: 'servicio'
});
```

### 5.6 UI/UX Components

#### **Componentes de UI Reutilizables**
1. **Cards**: Usuario, Servicio
2. **Modals**: ServiceDetail, ServiceRequest, UserProfile
3. **Forms**: Login, Register, EditProfile, CreateService
4. **Navigation**: Header con menú dinámico según autenticación
5. **Filters**: Search, Category tabs, Sort
6. **Pagination**: Control de páginas
7. **Loading States**: Spinners, skeletons
8. **Alerts**: SweetAlert2 para notificaciones

#### **Librerías UI Utilizadas**
- **Material-UI**: Iconos, sistema de diseño
- **Bootstrap**: Grid system, componentes base
- **React Icons**: Iconografía adicional
- **Framer Motion**: Animaciones fluidas
- **SweetAlert2**: Modales y alertas elegantes

---

## 6. MODELO DE DATOS

### 6.1 Diagrama ER (Entidad-Relación)

```
┌──────────────────┐         ┌──────────────────┐
│    USUARIO       │         │    CATEGORIA     │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ categoria_id (PK)│
│ nombre_completo  │         │ nombre_categoria │
│ correo_email     │         │ descripcion      │
│ telefono         │         │ icono            │
│ direccion        │         │ color            │
│ cedula           │         │ orden            │
│ codigo_verif     │         │ activo           │
│ tipo_usuario     │         └────────┬─────────┘
│ imagen           │                  │
│ banner           │                  │ 1
│ fecha_registro   │                  │
│ activo           │                  │
└────────┬─────────┘                  │
         │                            │
         │ 1                          │
         │                            │
         │                     *      │
         │             ┌──────────────▼──────┐
         │             │    SERVICIOS        │
         │             ├─────────────────────┤
         │             │ id (PK)             │
         │             │ nombre_servicio     │
         │             │ descripcion         │
         │             │ precio_base         │
         │             │ imagen              │
         │             │ activo              │
         │             │ destacado           │
         │             │ views               │
         │             │ ubicacion           │
         │             │ categoria (FK)      │
         │             │ proveedor (FK)      │
         │             │ fecha_creacion      │
         │             └──────────┬──────────┘
         │                        │
         │ *                      │ 1
         │                        │
         │                        │ *
┌────────▼─────────┐     ┌────────▼──────────┐
│   FAVORITOS      │     │   COMENTARIOS     │
├──────────────────┤     ├───────────────────┤
│ id (PK)          │     │ comentario_id (PK)│
│ usuario_id (FK)  │     │ mensaje           │
│ favorito_usuario │     │ calificacion      │
│ favorito_servicio│     │ servicio_fk (FK)  │
│ tipo_favorito    │     │ usuario_fk (FK)   │
│ fecha_agregado   │     │ fecha_creacion    │
└──────────────────┘     │ activo            │
                         └───────────────────┘
```

### 6.2 Relaciones

#### **Usuario → Servicios**
- **Tipo**: One-to-Many
- **Cardinalidad**: Un usuario puede tener muchos servicios
- **FK**: `Servicios.proveedor` → `Usuario.id`

#### **Categoria → Servicios**
- **Tipo**: One-to-Many
- **Cardinalidad**: Una categoría puede tener muchos servicios
- **FK**: `Servicios.categoria` → `Categoria.categoria_id`

#### **Usuario → Favoritos**
- **Tipo**: One-to-Many
- **Cardinalidad**: Un usuario puede tener muchos favoritos
- **FK**: `Favoritos.usuario_id` → `Usuario.id`

#### **Usuario/Servicio → Favoritos**
- **Tipo**: Polimórfica (tipo_favorito)
- **FKs**: 
  - `Favoritos.favorito_usuario` → `Usuario.id`
  - `Favoritos.favorito_servicio` → `Servicios.id`

#### **Usuario + Servicio → Comentarios**
- **Tipo**: Many-to-Many (a través de Comentarios)
- **FKs**:
  - `Comentarios.usuario_fk` → `Usuario.id`
  - `Comentarios.servicio_fk` → `Servicios.id`

### 6.3 Índices de Base de Datos

```sql
-- Usuario
CREATE INDEX idx_usuario_correo ON usuario(correo_electronico);
CREATE INDEX idx_usuario_cedula ON usuario(cedula);
CREATE INDEX idx_usuario_tipo ON usuario(tipo_usuario);
CREATE INDEX idx_usuario_activo ON usuario(activo);

-- Servicios
CREATE INDEX idx_servicio_nombre ON servicios(nombre_servicio);
CREATE INDEX idx_servicio_activo_destacado ON servicios(activo, destacado);
CREATE INDEX idx_servicio_categoria ON servicios(categoria_id);
CREATE INDEX idx_servicio_proveedor ON servicios(proveedor_id);

-- Favoritos
CREATE INDEX idx_favorito_usuario_tipo ON favoritos(usuario_id, tipo_favorito);

-- Comentarios
CREATE INDEX idx_comentario_servicio ON comentarios(servicio_fk);
CREATE INDEX idx_comentario_calificacion ON comentarios(calificacion);
```

---

## 7. APIs Y ENDPOINTS

### 7.1 Convenciones REST

#### **Formato de Respuesta**
```json
// Success
{
  "data": { ... },
  "message": "Operación exitosa"
}

// Error
{
  "error": "Descripción del error"
}

// Lista
[
  { ... },
  { ... }
]
```

### 7.2 Endpoints Principales

#### **7.2.1 Autenticación**

```http
POST /api/generar-codigo/
Content-Type: application/json

Request:
{
  "correo_electronico": "usuario@example.com"
}

Response: 200 OK
{
  "message": "Código enviado exitosamente",
  "codigo": "633528"  // Solo en desarrollo
}
```

```http
POST /api/login/
Content-Type: application/json

Request:
{
  "correo_electronico": "usuario@example.com",
  "codigo_verificacion": "633528"
}

Response: 200 OK
{
  "usuario": {
    "id": 1,
    "nombre_completo": "Angel David Palacios",
    "correo_electronico": "palacios@gmail.com",
    "tipo_usuario": "proveedor",
    "imagen_url": "http://...",
    "banner_url": "http://...",
    ...
  },
  "message": "Inicio de sesión exitoso"
}
```

#### **7.2.2 Usuarios**

```http
GET /api/usuarios/
Query Params:
  - tipo_usuario: string (opcional)
  - excluir_usuario: int (opcional)
  - activo: boolean (opcional)

Response: 200 OK
[
  {
    "id": 1,
    "nombre_completo": "Angel David Palacios",
    "correo_electronico": "palacios@gmail.com",
    "tipo_usuario": "proveedor",
    "imagen_url": "http://10.1.104.36:8000/media/usuarios/...",
    "banner_url": "http://10.1.104.36:8000/media/usuarios/...",
    "servicios_count": 5,
    ...
  }
]
```

```http
POST /api/crear-usuario/
Content-Type: multipart/form-data

Request:
{
  "nombre_completo": "Usuario Nuevo",
  "correo_electronico": "nuevo@example.com",
  "telefono": "3001234567",
  "direccion": "Calle 123",
  "cedula": "1234567890",
  "tipo_usuario": "proveedor",
  "imagen": <file>,
  "banner": <file>
}

Response: 201 Created
{
  "usuario": { ... },
  "message": "Usuario creado exitosamente"
}
```

#### **7.2.3 Servicios**

```http
GET /api/servicios/
Query Params:
  - categoria: int (opcional)
  - proveedor: int (opcional)
  - destacado: boolean (opcional)
  - search: string (opcional)

Response: 200 OK
[
  {
    "id": 1,
    "nombre_servicio": "Desarrollo Web Personalizado Premium",
    "descripcion": "...",
    "precio_base": "1816460.00",
    "imagen": "http://10.1.104.36:8000/media/servicios/...",
    "categoria": {
      "categoria_id": 1,
      "nombre_categoria": "Tecnología",
      "icono": "💻",
      "color": "#007bff"
    },
    "proveedor": {
      "id": 1,
      "nombre_completo": "Angel David Palacios",
      "imagen_url": "..."
    },
    "views": 42,
    "destacado": true,
    ...
  }
]
```

```http
POST /api/servicios/crear/
Content-Type: multipart/form-data

Request:
{
  "nombre_servicio": "Nuevo Servicio",
  "descripcion": "Descripción del servicio",
  "precio_base": 150000,
  "categoria_id": 1,
  "proveedor_id": 1,
  "imagen": <file>
}

Response: 201 Created
{
  "servicio": { ... },
  "message": "Servicio creado exitosamente"
}
```

#### **7.2.4 Favoritos**

```http
GET /api/favoritos/{usuario_id}/
Query Params:
  - tipo: string ('usuario' | 'servicio')

Response: 200 OK
[
  {
    "id": 1,
    "favorito_id": 2,
    "favorito_nombre": "Manolito",
    "tipo": "usuario",
    "fecha_agregado": "2025-10-24T19:30:00Z"
  }
]
```

```http
POST /api/favoritos/
Content-Type: application/json

Request:
{
  "usuario_id": 1,
  "favorito_id": 2,
  "tipo": "usuario"  // o "servicio"
}

Response: 201 Created
{
  "message": "Favorito agregado exitosamente"
}
```

```http
DELETE /api/favoritos/eliminar/{usuario_id}/{favorito_id}/
Query Params:
  - tipo: string ('usuario' | 'servicio')

Response: 200 OK
{
  "message": "Favorito eliminado exitosamente"
}
```

#### **7.2.5 Categorías**

```http
GET /api/categorias/

Response: 200 OK
[
  {
    "categoria_id": 1,
    "nombre_categoria": "Tecnología",
    "descripcion_categoria": "Servicios tecnológicos",
    "icono": "💻",
    "color": "#007bff",
    "orden": 1,
    "activo": true,
    "servicios_count": 15
  }
]
```

#### **7.2.6 Comentarios**

```http
GET /api/comentarios/
Query Params:
  - servicio: int (opcional)

Response: 200 OK
[
  {
    "comentario_id": 1,
    "mensaje": "Excelente servicio",
    "calificacion": 5,
    "usuario": {
      "id": 2,
      "nombre_completo": "Cliente Feliz"
    },
    "servicio": 1,
    "fecha_creacion": "2025-10-20T10:00:00Z"
  }
]
```

### 7.3 Endpoints Optimizados v2

```http
GET /api/v2/servicios/
Query Params:
  - page: int
  - page_size: int
  - categoria: int
  - ordenar: string

Response: 200 OK
{
  "count": 100,
  "next": "http://...",
  "previous": null,
  "results": [...]
}
```

```http
GET /api/v2/servicios/recomendados/
GET /api/v2/servicios/recomendados/{usuario_id}/

Response: 200 OK
[
  {
    "id": 1,
    "nombre_servicio": "...",
    "score": 0.95  // Score de recomendación
  }
]
```

```http
GET /api/v2/dashboard/

Response: 200 OK
{
  "total_usuarios": 150,
  "total_servicios": 320,
  "total_proveedores": 75,
  "total_arrendadores": 75,
  "servicios_destacados": 12,
  "categorias_activas": 6,
  "comentarios_totales": 450,
  "servicios_recientes": [...],
  "usuarios_recientes": [...]
}
```

---

## 8. SEGURIDAD

### 8.1 Autenticación

#### **Método Actual: Código de Verificación**
```python
# 1. Generación de código
codigo = random.randint(100000, 999999)
usuario.codigo_verificacion = codigo
usuario.save()

# 2. Validación
if usuario.codigo_verificacion == codigo_ingresado:
    # Login exitoso
    return usuario_data
```

#### **JWT (Configurado, no implementado)**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=1440),
    'SIGNING_KEY': SECRET_KEY,
}
```

### 8.2 Validaciones

#### **Backend**
```python
# Validación de correo único
def validate_correo_electronico(self, value):
    if Usuario.objects.filter(correo_electronico=value).exists():
        raise ValidationError("Correo ya registrado")
    return value

# Validación de cédula única
def validate_cedula(self, value):
    if Usuario.objects.filter(cedula=value).exists():
        raise ValidationError("Cédula ya registrada")
    return value
```

#### **Frontend**
```javascript
// Validación de formularios
const validateForm = () => {
  if (!email || !email.includes('@')) {
    setError('Correo inválido');
    return false;
  }
  if (!cedula || cedula.length < 6) {
    setError('Cédula inválida');
    return false;
  }
  return true;
};
```

### 8.3 CORS

```python
# Desarrollo
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Producción (recomendado)
CORS_ALLOWED_ORIGINS = [
    'https://tudominio.com',
    'https://www.tudominio.com',
]
```

### 8.4 CSRF Protection

```python
# Django CSRF habilitado
MIDDLEWARE = [
    ...
    'django.middleware.csrf.CsrfViewMiddleware',
    ...
]
```

### 8.5 Sanitización de Datos

```python
# Validadores de archivo
imagen = models.ImageField(
    validators=[FileExtensionValidator(
        allowed_extensions=['jpg', 'jpeg', 'png', 'webp']
    )]
)
```

### 8.6 Headers de Seguridad

```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = False  # True en producción
```

---

## 9. INFRAESTRUCTURA Y DESPLIEGUE

### 9.1 Entorno de Desarrollo

```yaml
Sistema Operativo: Windows 11
Servidor Local: Laragon
Base de Datos: MySQL 8.0 (Laragon)
Python: 3.10+
Node.js: 18+
Gestión Python: venv
Gestión Node: npm

# IPs de Desarrollo
Backend: http://10.1.104.36:8000
Frontend: http://10.1.104.36:5173
```

### 9.2 Variables de Entorno

#### **Backend (.env)**
```env
# Django
SECRET_KEY=django-insecure-...
DEBUG=True
ALLOWED_HOSTS=*

# Database
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=proxima
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://10.1.104.36:5173
CORS_ALLOW_ALL_ORIGINS=True

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Media
MEDIA_URL=/media/
FILE_UPLOAD_MAX_SIZE=5242880

# Logging
LOG_LEVEL=INFO
LOG_TO_FILE=False
```

#### **Frontend (.env)**
```env
# API
VITE_API_BASE_URL=http://10.1.104.36:8000/api
VITE_BACKEND_URL=http://10.1.104.36:8000

# Server
SERVER_HOST=0.0.0.0
FRONTEND_PORT=5173

# App
VITE_APP_TITLE=ProXimidad
VITE_APP_DESCRIPTION=Encuentra servicios cerca de ti

# UI
VITE_PAGINATION_SIZE=10
VITE_SEARCH_DEBOUNCE_MS=300

# Files
VITE_IMAGE_MAX_SIZE=5242880
VITE_SUPPORTED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### 9.3 Scripts de Despliegue

#### **Backend**
```bash
# Activar entorno virtual
.\activar_venv.ps1

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Crear servicios de prueba
python manage.py crear_servicios_rapidos

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

#### **Frontend**
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

### 9.4 Dockerización (Propuesta)

```dockerfile
# Backend Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: proxima
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_HOST: db
    volumes:
      - ./backend:/app
      - media_data:/app/media

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      VITE_API_BASE_URL: http://backend:8000/api

volumes:
  mysql_data:
  media_data:
```

### 9.5 CI/CD (Propuesta)

```yaml
# .github/workflows/deploy.yml
name: Deploy ProXimidad

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          python manage.py test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        run: |
          # SSH commands para deployment
          echo "Deploying..."
```

---

## 10. PATRONES DE DISEÑO

### 10.1 Patrones Arquitectónicos

#### **10.1.1 MVC (Model-View-Controller)**
```
Model:      Django ORM Models (Usuario, Servicios, etc.)
View:       React Components (JSX)
Controller: Django Views + React Hooks
```

#### **10.1.2 REST API**
- Separación clara cliente-servidor
- Stateless
- Recursos identificados por URLs
- Operaciones mediante HTTP verbs

#### **10.1.3 Layered Architecture**
```
┌────────────────────────────┐
│   Presentation Layer       │ ← React Components
├────────────────────────────┤
│   Business Logic Layer     │ ← Django Views
├────────────────────────────┤
│   Data Access Layer        │ ← Django ORM
├────────────────────────────┤
│   Database Layer           │ ← MySQL
└────────────────────────────┘
```

### 10.2 Patrones de Diseño Backend

#### **10.2.1 Repository Pattern**
```python
# Django ORM actúa como Repository
usuarios = Usuario.objects.filter(activo=True)
servicios = Servicios.objects.select_related('categoria', 'proveedor')
```

#### **10.2.2 Serializer Pattern**
```python
# Transformación de datos modelo → JSON
class UsuarioSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    
    def get_imagen_url(self, obj):
        if obj.imagen:
            return request.build_absolute_uri(obj.imagen.url)
        return None
```

#### **10.2.3 Decorator Pattern**
```python
@api_view(['GET'])
def servicios_list(request):
    # Lógica del endpoint
    pass
```

#### **10.2.4 Facade Pattern**
```python
# views_optimizadas.py actúa como facade
class ServiciosOptimizadosListView(ListAPIView):
    # Simplifica operaciones complejas
    queryset = Servicios.objects.select_related(...)
    serializer_class = ServicioDetailSerializer
```

### 10.3 Patrones de Diseño Frontend

#### **10.3.1 Context Pattern**
```jsx
// Estado global compartido
<AuthProvider>
  <UserProvider>
    {children}
  </UserProvider>
</AuthProvider>
```

#### **10.3.2 Higher-Order Component (HOC)**
```jsx
// Header adapta renderizado según autenticación
const Header = () => {
  const { user } = useAuth();
  return user ? <AuthenticatedNav /> : <GuestNav />;
};
```

#### **10.3.3 Container/Presentational Pattern**
```jsx
// Container: Lista_usuarios (lógica)
const Lista_usuarios = () => {
  const { usuarios, loading } = useUserContext();
  return <UserCards usuarios={usuarios} />;
};

// Presentational: UserCards (UI)
const UserCards = ({ usuarios }) => (
  usuarios.map(user => <UserCard key={user.id} user={user} />)
);
```

#### **10.3.4 Custom Hooks Pattern**
```jsx
// useAuth(), useUserContext()
const { user, login, logout } = useAuth();
const { usuarios, fetchUsuarios } = useUserContext();
```

#### **10.3.5 Render Props Pattern**
```jsx
// ServiceDetailModal
{selectedService && (
  <Modal>
    <ServiceDetails service={selectedService} />
  </Modal>
)}
```

### 10.4 Patrones de Comunicación

#### **10.4.1 Observer Pattern**
```javascript
// Context notifica cambios a suscriptores
useEffect(() => {
  if (user) {
    fetchUsuarios(user.id);
  }
}, [user]); // Observer de cambios en user
```

#### **10.4.2 Publish-Subscribe Pattern**
```javascript
// Custom events entre componentes
window.dispatchEvent(new CustomEvent('openUserProfile', {
  detail: { userId: 1 }
}));

window.addEventListener('openUserProfile', handleNavigation);
```

---

## 11. OPTIMIZACIONES Y RENDIMIENTO

### 11.1 Optimizaciones Backend

#### **11.1.1 Database Query Optimization**
```python
# select_related para ForeignKey (1 query)
servicios = Servicios.objects.select_related('categoria', 'proveedor')

# prefetch_related para Many-to-Many (2 queries)
usuarios = Usuario.objects.prefetch_related('servicios_ofrecidos')

# Índices de base de datos
class Meta:
    indexes = [
        models.Index(fields=['activo', 'destacado']),
        models.Index(fields=['categoria', 'activo']),
    ]
```

#### **11.1.2 Pagination**
```python
from rest_framework.pagination import PageNumberPagination

class ServiciosOptimizadosListView(ListAPIView):
    pagination_class = PageNumberPagination
    page_size = 10
```

#### **11.1.3 Caching**
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 300,
        'OPTIONS': {'MAX_ENTRIES': 1000}
    }
}
```

#### **11.1.4 Lazy Loading de Imágenes**
```python
# Serializer solo devuelve URL, no carga archivo
def get_imagen_url(self, obj):
    if obj.imagen:
        return obj.imagen.url
    return None
```

### 11.2 Optimizaciones Frontend

#### **11.2.1 Code Splitting**
```javascript
// Vite automático con import()
const ClientDashboard = React.lazy(() => import('./ClientDashboard'));
```

#### **11.2.2 Lazy Loading de Componentes**
```jsx
// Pagination evita cargar todos los items
const currentItems = filteredUsuarios.slice(
  indexOfFirstItem, 
  indexOfLastItem
);
```

#### **11.2.3 Memoization**
```javascript
// useCallback para funciones
const fetchUsuarios = useCallback(async () => {
  // ...
}, [dependencies]);

// useMemo para valores computados (potencial)
const filteredServices = useMemo(() => 
  services.filter(s => s.activo),
  [services]
);
```

#### **11.2.4 Debouncing**
```javascript
// Búsqueda con debounce
const SEARCH_DEBOUNCE_MS = 300;

useEffect(() => {
  const timer = setTimeout(() => {
    performSearch(searchTerm);
  }, SEARCH_DEBOUNCE_MS);
  
  return () => clearTimeout(timer);
}, [searchTerm]);
```

#### **11.2.5 Asset Optimization**
```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom'],
        'ui': ['@mui/material', 'bootstrap']
      }
    }
  }
}
```

### 11.3 Performance Metrics

#### **Target Metrics**
```yaml
Backend:
  Response Time: < 200ms (promedio)
  Throughput: > 100 req/s
  Database Query Time: < 50ms

Frontend:
  First Contentful Paint: < 1.5s
  Time to Interactive: < 3.5s
  Largest Contentful Paint: < 2.5s
  Bundle Size: < 500KB (gzipped)
```

### 11.4 Monitoring (Propuesta)

```python
# Backend: django-debug-toolbar
INSTALLED_APPS += ['debug_toolbar']

# Frontend: Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 12. PRUEBAS

### 12.1 Estrategia de Pruebas

```
┌─────────────────────────────────────┐
│       Pirámide de Pruebas           │
├─────────────────────────────────────┤
│        E2E Tests (5%)               │ ← Cypress
├─────────────────────────────────────┤
│    Integration Tests (15%)          │ ← Django Tests
├─────────────────────────────────────┤
│      Unit Tests (80%)               │ ← Jest + Django
└─────────────────────────────────────┘
```

### 12.2 Pruebas Backend (Propuesta)

```python
# tests/test_models.py
from django.test import TestCase
from proximidad_app.models import Usuario

class UsuarioModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create(
            nombre_completo="Test User",
            correo_electronico="test@example.com",
            cedula="1234567890"
        )
    
    def test_usuario_creation(self):
        self.assertEqual(self.usuario.nombre_completo, "Test User")
        self.assertTrue(self.usuario.activo)
    
    def test_unique_email(self):
        with self.assertRaises(IntegrityError):
            Usuario.objects.create(
                nombre_completo="Another User",
                correo_electronico="test@example.com"
            )
```

### 12.3 Pruebas Frontend (Propuesta)

```javascript
// __tests__/Header.test.jsx
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { AuthProvider } from './Auth';

test('renders login button when not authenticated', () => {
  render(
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
  expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
});
```

---

## 13. DOCUMENTACIÓN TÉCNICA

### 13.1 Documentación de Código

```python
# Backend: Docstrings
def usuarios_list(request):
    """
    Lista todos los usuarios con filtros opcionales.
    
    Args:
        request: HttpRequest con query params opcionales
            - tipo_usuario: str (proveedor|arrendador)
            - excluir_usuario: int
            - activo: bool
    
    Returns:
        Response: JSON array de usuarios serializados
    """
    pass
```

```javascript
// Frontend: JSDoc
/**
 * Agrega un usuario a favoritos
 * @param {number} usuarioId - ID del usuario a agregar
 * @param {Event} event - Evento del click
 * @returns {Promise<void>}
 */
const handleAddToFavorites = async (usuarioId, event) => {
  // ...
};
```

### 13.2 README

```markdown
# ProXimidad v2.0

Plataforma marketplace para conectar proveedores de servicios con clientes.

## Tecnologías
- Backend: Django 5.0.6 + DRF
- Frontend: React 18.3.1 + Vite
- DB: MySQL 8.0

## Instalación
Ver INSTALACION.md

## Uso
Ver USO.md

## Contribución
Ver CONTRIBUTING.md

## Licencia
MIT
```

---

## 14. ROADMAP Y MEJORAS FUTURAS

### 14.1 Corto Plazo (1-3 meses)

```yaml
Funcionalidades:
  - Sistema de mensajería en tiempo real (WebSocket)
  - Notificaciones push
  - Geolocalización con mapas
  - Calendario de disponibilidad
  - Sistema de pagos integrado

Técnico:
  - Implementar JWT completamente
  - Tests unitarios y de integración
  - CI/CD pipeline
  - Monitoreo y logging avanzado
  - Rate limiting
```

### 14.2 Mediano Plazo (3-6 meses)

```yaml
Funcionalidades:
  - App móvil (React Native)
  - Sistema de reseñas mejorado
  - Chat en vivo
  - Recomendaciones con ML
  - Dashboard de analytics

Técnico:
  - Migración a PostgreSQL
  - Redis para caché
  - CDN para media
  - Elasticsearch para búsqueda
  - GraphQL API
```

### 14.3 Largo Plazo (6-12 meses)

```yaml
Funcionalidades:
  - Marketplace multiregión
  - Sistema de suscripciones
  - API pública para terceros
  - Integraciones (Stripe, PayPal, etc.)
  - Panel de administración avanzado

Técnico:
  - Microservicios
  - Kubernetes
  - Multi-tenancy
  - Internacionalización
  - PWA completa
```

---

## 15. GLOSARIO

```yaml
API: Application Programming Interface
CORS: Cross-Origin Resource Sharing
CRUD: Create, Read, Update, Delete
JWT: JSON Web Token
ORM: Object-Relational Mapping
REST: Representational State Transfer
SPA: Single Page Application
UUID: Universally Unique Identifier
FK: Foreign Key
PK: Primary Key
```

---

## 16. APÉNDICES

### 16.1 Comandos Útiles

```bash
# Backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py crear_servicios_rapidos
python manage.py shell

# Frontend
npm run dev
npm run build
npm run lint
npm run preview

# Git
git status
git add .
git commit -m "mensaje"
git push origin main
```

### 16.2 Recursos

```yaml
Django Docs: https://docs.djangoproject.com/
React Docs: https://react.dev/
DRF Docs: https://www.django-rest-framework.org/
Vite Docs: https://vitejs.dev/
Material-UI: https://mui.com/
```

---

## 📝 CONTROL DE VERSIONES

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-10-24 | GitHub Copilot | Documento inicial |

---

## ✅ APROBACIONES

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Arquitecto de Software | - | - | - |
| Líder Técnico | - | - | - |
| Product Owner | - | - | - |

---

**FIN DEL DOCUMENTO**

---

*Este documento es un borrador de referencia técnica. Debe ser revisado, validado y mejorado por el equipo de desarrollo.*
