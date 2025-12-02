# Arquitectura de APIs - ProXimidad V3

## 📋 Resumen

ProXimidad V3 implementa una arquitectura de **2 APIs separadas** para mantener una clara separación de responsabilidades entre las funcionalidades de **clientes** y **proveedores de servicios**.

## 🎯 Filosofía de Diseño

### ¿Por qué 2 APIs?

1. **Separación de responsabilidades**: Clientes y proveedores tienen flujos de trabajo diferentes
2. **Seguridad mejorada**: Endpoints específicos con validaciones apropiadas
3. **Mantenibilidad**: Código organizado por tipo de usuario
4. **Escalabilidad**: Fácil de extender funcionalidades específicas
5. **Performance**: Queries optimizadas para cada tipo de operación

---

## 🧩 Estructura de las APIs

```
backend/proximidad_app/
├── views.py              → API General (Compartida)
├── views_solicitudes.py  → API Solicitudes (Cliente-Proveedor)
├── views_proveedor.py    → API Proveedor (Exclusiva)
└── views_optimizadas.py  → API Optimizada V2
```

---

## 🔵 API 1: Cliente/General

**Archivo**: `views.py`  
**Prefijo**: `/api/`

### Descripción
API pública y compartida para:
- Autenticación de usuarios
- Búsqueda y listado de servicios
- Gestión de favoritos
- Comentarios y calificaciones
- Perfil de usuario

### Endpoints Principales

#### Autenticación
```http
POST /api/generar-codigo/
POST /api/verificar-codigo/
POST /api/crear-usuario/
POST /api/login/
```

#### Servicios (Visualización)
```http
GET  /api/servicios/
GET  /api/servicios/<id>/
GET  /api/servicios/buscar/
POST /api/servicios/crear/          # Solo proveedores
PUT  /api/servicios/<id>/actualizar/ # Solo proveedores
```

#### Comentarios
```http
GET  /api/comentarios/
POST /api/comentarios/crear/
```

#### Favoritos
```http
GET    /api/favoritos/<usuario_id>/
POST   /api/favoritos/
DELETE /api/favoritos/eliminar/<usuario_id>/<favorito_id>/
```

#### Usuarios
```http
GET /api/usuarios/<id>/
PUT /api/usuarios/<id>/actualizar/
```

---

## 🟢 API 2: Proveedor (Exclusiva)

**Archivo**: `views_proveedor.py`  
**Prefijo**: `/api/proveedor/`

### Descripción
API **exclusiva para proveedores** con funcionalidades específicas:
- Panel de control del proveedor
- Gestión avanzada de servicios
- Administración de solicitudes recibidas
- Estadísticas y métricas de rendimiento
- Calificaciones y reputación

### Endpoints Principales

#### Dashboard
```http
GET /api/proveedor/dashboard/?proveedor_id=<id>
```
**Respuesta:**
```json
{
  "success": true,
  "proveedor": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com"
  },
  "resumen": {
    "servicios_creados": 15,
    "servicios_activos": 12,
    "solicitudes_pendientes": 3,
    "solicitudes_en_proceso": 5,
    "servicios_exitosos": 28,
    "calificacion_general": 4.7,
    "total_calificaciones": 45
  }
}
```

#### Servicios del Proveedor
```http
GET /api/proveedor/mis-servicios/?proveedor_id=<id>
```
**Query params opcionales:**
- `activo=true|false` - Filtrar por estado
- `destacado=true|false` - Filtrar destacados
- `ordenar_por=views|fecha_creacion|precio_base`

**Respuesta:**
```json
{
  "success": true,
  "total": 15,
  "servicios": [
    {
      "id": 1,
      "nombre_servicio": "Reparación de laptops",
      "precio_base": 50.00,
      "activo": true,
      "total_solicitudes": 12,
      "solicitudes_completadas": 8,
      "solicitudes_en_proceso": 2,
      "calificacion_promedio": 4.5,
      "total_calificaciones": 10
    }
  ]
}
```

#### Solicitudes Recibidas
```http
GET /api/proveedor/solicitudes/?proveedor_id=<id>
```
**Query params opcionales:**
- `estado=pendiente|aceptado|en_proceso|completado|rechazado`
- `urgencia=baja|media|alta|urgente`
- `fecha_desde=YYYY-MM-DD`
- `fecha_hasta=YYYY-MM-DD`

**Respuesta:**
```json
{
  "success": true,
  "solicitudes": [ /* array de solicitudes */ ],
  "estadisticas": {
    "total": 45,
    "pendientes": 3,
    "aceptadas": 5,
    "en_proceso": 8,
    "completadas": 25,
    "rechazadas": 4
  }
}
```

#### Responder Solicitud
```http
PUT /api/proveedor/solicitudes/<id>/responder/
```
**Body:**
```json
{
  "proveedor_id": 1,
  "estado": "aceptado",
  "respuesta_proveedor": "Acepto realizar el trabajo. Empiezo mañana.",
  "precio_acordado": 75.50
}
```

**Validación de transiciones:**
- `pendiente` → `aceptado` | `rechazado`
- `aceptado` → `en_proceso` | `rechazado`
- `en_proceso` → `completado`
- Estados finales no se pueden cambiar

#### Estadísticas del Proveedor
```http
GET /api/proveedor/estadisticas/?proveedor_id=<id>&periodo=<periodo>
```
**Periodos disponibles:**
- `ultimos_7_dias`
- `ultimos_30_dias`
- `ultimo_mes`
- `todo` (default)

**Respuesta:**
```json
{
  "success": true,
  "periodo": "ultimos_30_dias",
  "servicios": {
    "total_servicios": 15,
    "servicios_activos": 12,
    "servicios_destacados": 3,
    "servicios_creados_periodo": 2,
    "total_views": 450
  },
  "solicitudes": {
    "total_solicitudes": 45,
    "solicitudes_periodo": 18,
    "pendientes": 3,
    "completadas": 25,
    "tasa_aceptacion": 85.5,
    "tasa_completado": 92.3
  },
  "calificaciones": {
    "calificacion_promedio": 4.67,
    "total_calificaciones": 45,
    "distribucion": {
      "5_estrellas": 30,
      "4_estrellas": 10,
      "3_estrellas": 3,
      "2_estrellas": 1,
      "1_estrella": 1
    }
  },
  "ingresos": {
    "total_completadas": 25,
    "ingresos_estimados": 1875.50
  }
}
```

#### Calificación Promedio
```http
GET /api/proveedor/calificacion/?proveedor_id=<id>
```
**Respuesta:**
```json
{
  "success": true,
  "calificacion_promedio": 4.67,
  "total_calificaciones": 45,
  "distribucion": [
    { "estrellas": 5, "cantidad": 30, "porcentaje": 66.7 },
    { "estrellas": 4, "cantidad": 10, "porcentaje": 22.2 },
    { "estrellas": 3, "cantidad": 3, "porcentaje": 6.7 },
    { "estrellas": 2, "cantidad": 1, "porcentaje": 2.2 },
    { "estrellas": 1, "cantidad": 1, "porcentaje": 2.2 }
  ],
  "comentarios_recientes": [
    {
      "usuario": "María García",
      "servicio": "Reparación de laptops",
      "calificacion": 5,
      "mensaje": "Excelente trabajo, muy profesional",
      "fecha": "2025-11-28"
    }
  ]
}
```

---

## 🟡 API 3: Solicitudes (Compartida)

**Archivo**: `views_solicitudes.py`  
**Prefijo**: `/api/solicitudes/`

### Descripción
API especializada en el flujo de solicitudes de servicios. Es utilizada tanto por clientes como proveedores.

### Endpoints

#### Cliente
```http
POST   /api/solicitudes/crear/
GET    /api/solicitudes/cliente/<cliente_id>/
GET    /api/solicitudes/<id>/
DELETE /api/solicitudes/<id>/cancelar/
```

#### Proveedor (legacy, migrar a API proveedor)
```http
GET    /api/solicitudes/proveedor/<proveedor_id>/
PUT    /api/solicitudes/<id>/actualizar/
GET    /api/solicitudes/estadisticas/<usuario_id>/
```

#### Emails Automáticos
La API envía emails automáticos en cada cambio de estado:
- ✅ **solicitud_creada**: Cliente y proveedor reciben confirmación
- ✅ **aceptada**: Cliente recibe confirmación de aceptación con precio acordado
- ❌ **rechazada**: Cliente recibe motivo del rechazo
- 🎉 **completada**: Cliente recibe invitación a calificar el servicio

---

## 🔐 Seguridad y Validaciones

### API Proveedor
Todas las operaciones en `/api/proveedor/` validan:
1. **proveedor_id** es requerido
2. Usuario existe y es tipo `proveedor`
3. El proveedor solo puede operar sobre sus propios recursos
4. Transiciones de estado válidas en solicitudes

### API Cliente
Operaciones en `/api/solicitudes/crear/` validan:
1. **cliente_id** es requerido
2. Usuario existe
3. Servicio existe y está activo
4. Solo cliente puede cancelar su propia solicitud

---

## 📊 Comparación de Endpoints

| Funcionalidad | API General | API Proveedor |
|--------------|-------------|---------------|
| Ver servicios públicos | ✅ `/servicios/` | ❌ |
| Ver MIS servicios | ❌ | ✅ `/proveedor/mis-servicios/` |
| Ver solicitudes recibidas | ❌ | ✅ `/proveedor/solicitudes/` |
| Responder solicitud | ❌ | ✅ `/proveedor/solicitudes/<id>/responder/` |
| Calificación promedio | ❌ | ✅ `/proveedor/calificacion/` |
| Dashboard completo | ❌ | ✅ `/proveedor/dashboard/` |
| Crear servicio | ✅ `/servicios/crear/` | ❌ (usa API general) |
| Buscar servicios | ✅ `/servicios/buscar/` | ❌ |

---

## 🎨 Uso en Frontend

### Cliente (ClientDashboard.jsx)
```javascript
// Buscar servicios
const response = await axios.get(`${API_BASE_URL}/servicios/buscar/`)

// Crear solicitud
await axios.post(`${API_BASE_URL}/solicitudes/crear/`, solicitudData)

// Ver mis solicitudes
const response = await axios.get(`${API_BASE_URL}/solicitudes/cliente/${user.id}/`)

// Calificar servicio completado
await axios.post(`${API_BASE_URL}/comentarios/crear/`, comentarioData)
```

### Proveedor (Sec1Provider.jsx)
```javascript
// Dashboard completo (recomendado)
const response = await axios.get(`${API_BASE_URL}/proveedor/dashboard/?proveedor_id=${proveedorId}`)

// Mis servicios con estadísticas
const response = await axios.get(`${API_BASE_URL}/proveedor/mis-servicios/?proveedor_id=${proveedorId}`)

// Solicitudes recibidas
const response = await axios.get(`${API_BASE_URL}/proveedor/solicitudes/?proveedor_id=${proveedorId}`)

// Calificación promedio
const response = await axios.get(`${API_BASE_URL}/proveedor/calificacion/?proveedor_id=${proveedorId}`)

// Responder solicitud
await axios.put(`${API_BASE_URL}/proveedor/solicitudes/${solicitudId}/responder/`, {
  proveedor_id: proveedorId,
  estado: 'aceptado',
  respuesta_proveedor: mensaje,
  precio_acordado: precio
})
```

---

## 🚀 Ventajas de esta Arquitectura

### 1. **Claridad de Código**
- Cada archivo tiene un propósito específico
- Fácil encontrar y modificar funcionalidades

### 2. **Performance**
- Queries optimizadas para cada tipo de usuario
- Menos datos innecesarios en respuestas
- Agregaciones calculadas en backend

### 3. **Seguridad**
- Validaciones específicas por tipo de usuario
- Endpoints separados reducen superficie de ataque
- Fácil implementar autenticación JWT por API

### 4. **Mantenibilidad**
- Cambios en panel proveedor no afectan cliente
- Tests unitarios más simples y específicos
- Menor acoplamiento entre componentes

### 5. **Escalabilidad**
- Fácil agregar nuevos endpoints sin afectar código existente
- Posibilidad de microservicios en el futuro
- Cache independiente por API

---

## 📝 Próximos Pasos (V4)

1. **Autenticación JWT**: Implementar tokens para ambas APIs
2. **Rate Limiting**: Limitar requests por usuario/IP
3. **WebSockets**: Notificaciones en tiempo real para proveedores
4. **Paginación**: Implementar en listados largos
5. **GraphQL**: Considerar para queries complejas del dashboard
6. **Sistema de Pagos**: Integrar MercadoPago con endpoints específicos

---

## 📚 Referencias

- **Models**: `proximidad_app/models.py`
- **Serializers**: `proximidad_app/serializer.py`
- **URLs**: `proximidad_app/urls.py`
- **Frontend Cliente**: `frontend/src/components/modules/ClientDashboard.jsx`
- **Frontend Proveedor**: `frontend/src/components/modules/Sec1Provider.jsx`

---

## 🆘 Troubleshooting

### Error: "proveedor_id es requerido"
**Solución**: Todos los endpoints de `/api/proveedor/` requieren el query param `?proveedor_id=<id>`

### Error: "No tienes permiso para responder esta solicitud"
**Solución**: Verificar que el `proveedor_id` en el body coincida con el proveedor de la solicitud

### Calificación promedio no se actualiza
**Solución**: Asegurarse de llamar `cargarCalificacionPromedio()` después de que un cliente califique un servicio

### Solicitudes no aparecen en panel proveedor
**Solución**: Verificar que el servicio tenga `proveedor_id` correcto y que la solicitud esté asociada al servicio

---

**Última actualización**: Diciembre 2, 2025  
**Versión**: ProXimidad V3.0  
**Autor**: AngelPalaciosN
