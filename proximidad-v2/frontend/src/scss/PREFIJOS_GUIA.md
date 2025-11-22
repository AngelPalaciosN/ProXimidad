# 🎯 GUÍA DE PREFIJOS PARA COMPONENTES SCSS

## 📋 Sistema de Namespacing

Para diferenciar componentes entre proyectos, usamos prefijos en las clases CSS.

---

## 🏷️ REGLAS DE PREFIJOS

### **Proyecto Actual (Frontend 1)**
- **Prefijo:** Sin prefijo o `.px-` (ProXimidad)
- **Ejemplo:** `.header`, `.footer`, `.sec1`, `.sec2`

### **Proyectos Futuros (Frontend 2, 3, etc.)**
- **Frontend 2:** `.f2-header`, `.f2-footer`, `.f2-sec1`
- **Frontend 3:** `.f3-header`, `.f3-footer`, `.f3-sec1`

---

## 📂 ESTRUCTURA DE MIGRACIÓN

### **Carpetas:**
```
scss/
├── components/          ← Nuevos componentes migrados
│   ├── _header.scss
│   ├── _footer.scss
│   └── _sec1.scss
└── component-styles/    ← Componentes antiguos (temporal)
    ├── Header.scss
    ├── Footer.scss
    └── Sec1.scss
```

### **Convención de Nombres:**
- **Carpeta antigua:** `Header.scss` (PascalCase, mayúscula)
- **Carpeta nueva:** `_header.scss` (snake_case con `_` inicial)

---

## ✅ CHECKLIST DE MIGRACIÓN

Cuando migres un componente, asegúrate de:

1. ✅ **NO incluir `@use` o `@import`** en componentes individuales
2. ✅ **Copiar estilos del archivo viejo** (mantener clases originales)
3. ✅ **Agregar comentario:** `// Las variables y mixins se heredan desde style.scss`
4. ✅ **Actualizar `style.scss`:**
   ```scss
   // Comentar el viejo
   // @import 'component-styles/Header.scss';
   
   // Importar el nuevo
   @import 'components/header';
   ```
5. ✅ **Probar con `npm run dev`**
6. ✅ **Validar visualmente** que los estilos se vean igual

---

## 🚨 ERRORES COMUNES

### ❌ **NO HAGAS ESTO:**
```scss
// components/_header.scss
@use '../variables' as *;  // ❌ NO - Causa conflictos
@use '../responsive' as *; // ❌ NO - Causa conflictos

.header__container {       // ❌ NO - Cambia la estructura HTML
  // ...
}
```

### ✅ **HAZ ESTO:**
```scss
// components/_header.scss
// Las variables y mixins se heredan desde style.scss (punto de entrada)

.header {  // ✅ SÍ - Mantén las clases originales del HTML
  .navbar {
    // ...
  }
}
```

---

## 📝 ESTADO ACTUAL DE MIGRACIÓN

| Componente | Estado | Archivo Viejo | Archivo Nuevo |
|------------|--------|---------------|---------------|
| Header     | ✅ Migrado | `component-styles/Header.scss` | `components/_header.scss` |
| Footer     | ✅ Migrado | `component-styles/Footer.scss` | `components/_footer.scss` |
| Sec1       | ✅ Migrado | `component-styles/Sec1.scss` | `components/_sec1.scss` |
| Sec2       | ✅ Migrado | `component-styles/Sec2.scss` | `components/_sec2.scss` |
| Sec3       | ✅ Migrado | `component-styles/Sec3.scss` | `components/_sec3.scss` |
| Registrar  | ✅ Migrado | `component-styles/Registrar.scss` | `components/_registrar.scss` |
| ClientDashboard | ✅ Migrado | `component-styles/ClientDashboard.scss` | `components/_client-dashboard.scss` |
| Listaust   | ✅ Migrado | `component-styles/Listaust.scss` | `components/_listaust.scss` |
| Modals     | ✅ Migrado | `component-styles/_modals.scss` | `components/_modals.scss` |

**🎉 Migración Completa: 9/9 componentes migrados exitosamente**

---

## 🎨 EJEMPLO COMPLETO: Header

### **Antes (Viejo - component-styles/Header.scss):**
```scss
@use '../variables' as *;
@use '../responsive' as *;

.header {
  background-color: $primary-color;
  .navbar { /* ... */ }
}
```

### **Después (Nuevo - components/_header.scss):**
```scss
// Las variables y mixins se heredan desde style.scss (punto de entrada)

.header {
  background-color: $primary-color;
  .navbar { /* ... */ }
}
```

### **style.scss:**
```scss
// 1. Abstracts (Variables, Mixins)
@import 'variables';
@import 'responsive';
@import 'abstracts/mixins';

// 2. Bootstrap
@import "bootstrap/scss/bootstrap";

// 3. Base
@import 'base/reset';
@import 'base/typography';
@import 'base/utilities';

// 4. Components
@import 'components/header';  // ✅ Nuevo

// Antiguos (temporales)
// @import 'component-styles/Header.scss';  // ❌ Comentado
@import 'component-styles/Footer.scss';
```

---

## 🔥 PUNTO CRÍTICO

**⚠️ SOLO `style.scss` debe tener `@import`/`@use` de variables y mixins.**

**Los componentes individuales heredan todo automáticamente.**

---

Actualizado: 21 de noviembre de 2025
