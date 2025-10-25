# ============================================
# GUÍA DE SOLUCIÓN - ACCESO DESDE CELULAR
# ============================================

## 🔴 PROBLEMAS IDENTIFICADOS

1. **IP Incorrecta**: El código tenía IPs antiguas (192.168.0.x)
2. **Firewall Bloqueado**: Windows bloquea puertos por defecto
3. **HMR no configurado**: Hot Module Replacement sin la IP correcta
4. **CORS Backend**: Django puede estar rechazando conexiones

---

## ✅ SOLUCIONES APLICADAS

### 1. **IPs Actualizadas**
   - ✓ Frontend .env → `192.168.1.100`
   - ✓ env.js → `192.168.1.100`
   - ✓ vite.config.js → `192.168.1.100`

### 2. **Archivos Creados**
   - ✓ `abrir_firewall.ps1` - Script para abrir puertos
   - ✓ `verificar_conexion.ps1` - Script para diagnosticar

---

## 🚀 PASOS PARA ACTIVAR

### **PASO 1: Abrir Firewall (IMPORTANTE)**
```powershell
# Click derecho en PowerShell → "Ejecutar como Administrador"
.\abrir_firewall.ps1
```

### **PASO 2: Verificar Backend Django**
```powershell
cd backend
python manage.py runserver 0.0.0.0:8000
```

### **PASO 3: Iniciar Frontend**
```powershell
cd frontend
npm run dev
```

### **PASO 4: Desde tu Celular**
1. Conecta el celular a la MISMA red WiFi
2. Abre el navegador en el celular
3. Ve a: `http://192.168.1.100:5173`

---

## 🔍 SI NO FUNCIONA

### **Opción A: Verificar Conexión**
```powershell
.\verificar_conexion.ps1
```

### **Opción B: Verificar Backend**
```powershell
# Backend debe aceptar conexiones externas
cd backend
python manage.py runserver 0.0.0.0:8000
```

### **Opción C: Verificar Firewall Manual**
1. Abrir "Windows Defender Firewall"
2. "Configuración avanzada"
3. "Reglas de entrada"
4. Buscar "ProXimidad Frontend" y "ProXimidad Backend"
5. Deben estar habilitadas (✓)

---

## 🌐 CONFIGURACIÓN DE BACKEND

Verifica que `backend/core/settings.py` tenga:

```python
ALLOWED_HOSTS = ['*']  # O específicamente ['192.168.1.100', 'localhost']
CORS_ALLOW_ALL_ORIGINS = True
```

---

## 📱 DESDE EL CELULAR

**URL Frontend**: `http://192.168.1.100:5173`
**URL Backend**: `http://192.168.1.100:8000`

---

## ⚡ OPTIMIZACIONES APLICADAS

1. **HMR Mejorado**: Actualización en vivo más rápida
2. **Polling Mode**: Compatible con más dispositivos
3. **Host 0.0.0.0**: Acepta conexiones de cualquier IP
4. **CORS Abierto**: Sin restricciones durante desarrollo

---

## ❌ POSIBLES ERRORES

### Error: "Connection Refused"
- ✓ Firewall no configurado → Ejecuta `abrir_firewall.ps1`

### Error: "Network Error" 
- ✓ Backend no iniciado → Ejecuta Django en 0.0.0.0:8000

### Error: "CORS Policy"
- ✓ Backend settings.py → `CORS_ALLOW_ALL_ORIGINS = True`

### Error: Celular no carga
- ✓ Verifica que estén en la MISMA red WiFi
- ✓ Verifica IP con `ipconfig`

---

## 🔧 COMANDOS ÚTILES

```powershell
# Ver tu IP
ipconfig | Select-String "IPv4"

# Ver puertos abiertos
netstat -an | Select-String "5173|8000"

# Reiniciar servicios
# 1. Ctrl+C en ambas terminales
# 2. Reiniciar backend y frontend
```

---

## 📊 TAMAÑO DE ARCHIVOS

Los archivos más pesados en tu proyecto:
- `node_modules/` → Ignorado (no se carga en el navegador)
- `media/` → Optimizar imágenes a WebP
- Builds optimizados automáticamente por Vite

---

## 🎯 CHECKLIST FINAL

- [ ] Firewall configurado (ejecutar como admin)
- [ ] Backend corriendo en 0.0.0.0:8000
- [ ] Frontend corriendo en 0.0.0.0:5173
- [ ] Celular en la misma red WiFi
- [ ] IP verificada: 192.168.1.100
- [ ] Acceder desde celular: http://192.168.1.100:5173

