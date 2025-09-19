# Migración de ProXimidad v1 a v2

## Fecha de migración: 15 de septiembre de 2025

### Resumen
Se completó la migración de la versión original (proXimidad) a la versión v2 (proximidad-v2). La v2 ahora es la versión oficial y funcional del proyecto.

### Cambios realizados

#### 1. Dependencias migradas
Se actualizó el archivo `requirements.txt` de v2 con las siguientes dependencias faltantes de v1:

- `distlib==0.3.8`
- `django-hosts==6.0`
- `filelock==3.15.4`
- `platformdirs==4.2.2`
- `setuptools==78.1.0`
- `virtualenv==20.26.3`

#### 2. Estado de las versiones

##### ProXimidad v2 (ACTIVA)
- **Ubicación**: `proximidad-v2/`
- **Estado**: ✅ Funcional y actualizada
- **Backend**: Django 5.0.6 con todas las dependencias necesarias
- **Frontend**: Configurado con Vite
- **Base de datos**: MySQL configurada

##### ProXimidad v1 (ARCHIVADA)
- **Ubicación**: `proXimidad/`
- **Estado**: 📦 Archivada - NO usar para desarrollo
- **Propósito**: Referencia histórica únicamente

##### ProXimidad Learning (REFERENCIA)
- **Ubicación**: `Proximidad-learning/`
- **Estado**: 📚 Material de aprendizaje/prototipo

### Instrucciones para desarrolladores

#### Para trabajar en el proyecto:
1. Usar únicamente la carpeta `proximidad-v2/`
2. Backend: `proximidad-v2/backend/`
3. Frontend: `proximidad-v2/frontend/`

#### Instalación de dependencias:
```bash
cd proximidad-v2/backend
pip install -r requirements.txt
```

#### Base de datos:
- El archivo SQL está en `proximidad-v2/database/proxima.sql`
- Configuración en `proximidad-v2/backend/core/settings.py`

### Notas importantes
- ⚠️ **NO modificar** los archivos en `proXimidad/` (v1)
- ✅ **USAR SOLAMENTE** `proximidad-v2/` para desarrollo
- 🔄 La v2 tiene el backend "perfecto" como se solicitó
- 📦 La v1 queda como archivo histórico

### Estructura final del proyecto
```
ProXimidad/
├── proximidad-v2/          ← VERSIÓN ACTIVA
│   ├── backend/
│   └── frontend/
├── proXimidad/             ← ARCHIVADA
├── Proximidad-learning/    ← REFERENCIA
└── MIGRATION.md           ← Este archivo
```