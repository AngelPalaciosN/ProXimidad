# 📊 ANÁLISIS COMPLETO DE ARQUITECTURA - PROYECTO PROXIMIDAD V2  

Después de un análisis exhaustivo, se presenta el detalle de la arquitectura implementada en el proyecto **Proximidad**:  

---

## 🏗️ ARQUITECTURA GENERAL DEL SISTEMA  
- **Patrón Arquitectónico Principal:** Cliente-Servidor con API REST  
- **Frontend:** SPA (Single Page Application) con React  
- **Backend:** API REST con Django REST Framework  
- **Comunicación:** HTTP/HTTPS con JSON  
- **Base de Datos:** MySQL (relacional)  

---

## 🔧 BACKEND - DJANGO REST FRAMEWORK  

### 1. Patrón MVC (Model-View-Controller)  
**Models (Modelos de Datos):**  
- Usuario: Gestión de usuarios (proveedor / cliente)  
- Servicios: Catálogo de servicios ofrecidos  
- Categorías: Clasificación de servicios  
- Comentarios: Sistema de reseñas  
- Favoritos: Lista de favoritos por usuario  

**Views (Controladores / API Views):**  
- `views.py`: Vistas principales con decoradores `@api_view`  
- `views_optimizadas.py`: Vistas avanzadas con paginación y filtros  
- `auth_views.py`: Autenticación y autorización  

**Serializers (Transformación de datos):**  
- `UsuarioSerializer`, `ServiciosSerializer`, etc.  
- Conversión de datos **Python ↔ JSON**  

---

### 2. Estructura de Directorios (Modular)  

```bash
backend/
├── core/ # Configuración principal
│ ├── settings.py # Configuración de Django
│ ├── urls.py # Rutas principales
│ └── wsgi.py / asgi.py # Configuración de servidor
├── proximidad_app/ # Aplicación principal
│ ├── models.py # Modelos de datos
│ ├── views.py # API Views
│ ├── serializer.py # Serializadores REST
│ ├── urls.py # Rutas de la app
│ └── migrations/ # Migraciones de BD
└── media/ # Archivos estáticos
```

---

### 3. Patrones de Diseño Implementados  
- **Repository Pattern (ORM Django):**  
  ```python
  usuarios = Usuario.objects.filter(activo=True)
  servicios = Servicios.objects.select_related('proveedor')

**Serializer Pattern (DRF):**

python
class ServiciosSerializer(serializers.ModelSerializer):
    proveedor_info = UsuarioBasicSerializer(source='proveedor', read_only=True)
    categoria_info = CategoriaSerializer(source='categoria', read_only=True)

**Decorator Pattern:**

python

@api_view(['GET', 'POST']) @permission_classes([AllowAny]) def servicios_list(request): # Lógica de la vista

###4. Características Técnicas Framework: Django 5.0.6 + DRF 3.16.0

Base de Datos: MySQL (mysqlclient 2.2.7)

Autenticación: JWT con djangorestframework_simplejwt

CORS: django-cors-headers

Filtros: django-filter

Archivos: Pillow (manejo de imágenes)

Configuración: python-decouple (variables de entorno)


## ⚛️ FRONTEND - REACT CON VITE

**1. Patrón de Componentes React**
scss

```bash
App.jsx
├── Home.jsx (Layout principal)
│   ├── Header.jsx (Navegación)
│   ├── Sec1.jsx (Hero section)
│   ├── Sec2.jsx (Servicios destacados)
│   ├── Sec3.jsx (Características)
│   └── Footer.jsx
├── ClientDashboard.jsx (Dashboard cliente)
├── ServiceDetailModal.jsx (Modal de servicios)
└── Lista_usuarios.jsx (Proveedores)
```
**2. Patrones de Estado (Context API)**
   
```bash
AuthContext (Auth.jsx)
 ├── user
 ├── loading
 ├── loginWithPassword()
 ├── register()
 └── logout()

UserContext (UserContext.jsx)
 ├── usuarios
 ├── loading
 └── fetchUsuarios()
```

**3. Arquitectura de Hooks Personalizados**

```javascript
const { user, loading, loginWithPassword } = useAuth();
const { usuarios, fetchUsuarios } = useUserContext();
```

**4. Patrones de Comunicación**
HTTP Client Pattern con Axios

```javascript
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
const response = await axios.get(`${baseUrl}/servicios/`)
Environment Configuration Pattern
```

```javascript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_TITLE: import.meta.env.VITE_APP_TITLE
}
```

## 5. Características Técnicas
Framework: React 18.3.1

Build Tool: Vite 6.2.2

UI: Bootstrap 5.3.3 + React Bootstrap

Routing: React Router DOM 7.6.2

HTTP: Axios 1.7.7

Animaciones: Framer Motion 12.7.4

Alerts: SweetAlert2 11.6.13

Styling: SASS + Bootstrap

## 🗄️ BASE DE DATOS - ARQUITECTURA RELACIONAL

**Esquema Simplificado**
Usuario (1) ←→ (N) Servicios

Categoría (1) ←→ (N) Servicios

Usuario (1) ←→ (N) Comentarios

Usuario (N) ←→ (N) Favoritos ←→ (N) Servicios

**Características**
Motor: MySQL

Índices: Optimización de consultas

Constraints: Claves foráneas

Almacenamiento: Archivos en sistema de ficheros

## 🔄 PATRONES DE INTEGRACIÓN
API-First Architecture: Backend expone API REST, frontend consume vía HTTP.

Configuration Management Pattern: Variables de entorno en .env.

Development vs Production Pattern:

Dev: Vite Dev Server + Django Runserver

Prod: Build estático + WSGI/ASGI

## 📋 RESUMEN DE ARQUITECTURA
Capa	Tecnología	Responsabilidad	Patrón
Frontend	React + Vite	UI/UX, Estado, Navegación	Component-Based + Context
API	Django REST	Lógica de negocio, validación	MVC + REST
Datos	MySQL	Persistencia, integridad	Relacional Normalizada
Assets	File System	Archivos multimedia	Upload + URL Serving

## 🔧 Patrones de Diseño Identificados
MVC (Backend)

Component Architecture (Frontend)

Repository Pattern (Django ORM)

Serializer Pattern (DRF)

Context Pattern (React State)

Configuration Pattern (Env Vars)

API Gateway Pattern (Endpoints centralizados)

## ✅ Beneficios
Escalabilidad: Componentes independientes

Mantenibilidad: Separación clara de capas

Testabilidad: Cada capa testeable

Flexibilidad: Cambios aislados por capa

Reutilización: APIs y componentes reutilizables


Esta es una arquitectura moderna, robusta y bien estructurada, que sigue las mejores prácticas de desarrollo web full-stack. 🚀
