# 🚨 SOLUCIÓN RÁPIDA - ACCESO DESDE CELULAR

## ❌ PROBLEMA
No carga en el celular, solo funciona con localhost/Laragon

---

## ✅ CAUSA IDENTIFICADA

1. **IP Incorrecta**: Código con IPs antiguas (192.168.0.x)
2. **Firewall Windows**: Bloqueando puertos 5173 y 8000
3. **Backend no escucha**: Solo en localhost, no en red
4. **HMR sin configurar**: Hot reload sin la IP correcta

---

## 🛠️ SOLUCIÓN EN 3 PASOS

### **PASO 1: ABRIR FIREWALL** ⚡ (MÁS IMPORTANTE)

```powershell
# Click derecho en PowerShell → "Ejecutar como Administrador"
cd C:\Users\SENA\Documents\GitHub\ProXimidad\proximidad-v2
.\abrir_firewall.ps1
```

✅ Esto abre los puertos 5173 (Frontend) y 8000 (Backend)

---

### **PASO 2: INICIAR PROYECTO**

**Opción A - Automático (Recomendado):**
```powershell
.\iniciar_proyecto.ps1
```

**Opción B - Manual:**
```powershell
# Terminal 1 - Backend
cd backend
python manage.py runserver 0.0.0.0:8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

### **PASO 3: ACCEDER DESDE CELULAR**

1. **Conecta el celular a la MISMA red WiFi** 📱
2. Abre el navegador en el celular
3. Ve a: **`http://192.168.1.100:5173`**

---

## 🔍 SI NO FUNCIONA

### **Diagnóstico:**
```powershell
.\verificar_conexion.ps1
```

Este script te dirá exactamente qué está fallando.

---

## 📋 ARCHIVOS MODIFICADOS

✅ **Actualizados con tu IP correcta (192.168.1.100):**
- `frontend/.env`
- `frontend/src/config/env.js`
- `frontend/vite.config.js`
- `backend/.env`

✅ **Creados:**
- `abrir_firewall.ps1` - Configura Firewall
- `verificar_conexion.ps1` - Diagnóstico
- `iniciar_proyecto.ps1` - Inicio automático
- `optimizar_imagenes.ps1` - Análisis de peso
- `SOLUCION_CELULAR.md` - Guía completa
- `SOLUCION_RAPIDA.md` - Este archivo

---

## ⚠️ IMPORTANTE

### **Si cambias de red WiFi:**
Tu IP puede cambiar. Ejecuta:
```powershell
ipconfig | Select-String "IPv4"
```

Si es diferente a `192.168.1.100`, actualiza:
- `frontend/.env` → VITE_API_BASE_URL
- `frontend/vite.config.js` → hmr.host

---

## 🎯 CHECKLIST

- [ ] ✅ Firewall abierto (ejecutar como ADMIN)
- [ ] ✅ Backend corriendo en 0.0.0.0:8000
- [ ] ✅ Frontend corriendo en 0.0.0.0:5173
- [ ] ✅ Celular en MISMA red WiFi
- [ ] ✅ Acceder a: http://192.168.1.100:5173

---

## 🔥 COMANDOS RÁPIDOS

```powershell
# Ver tu IP actual
ipconfig | Select-String "IPv4"

# Ver puertos abiertos
netstat -an | Select-String "5173|8000"

# Detener todo
Get-Process -Name *node*,*python* | Stop-Process -Force

# Iniciar proyecto
.\iniciar_proyecto.ps1
```

---

## 💡 OPTIMIZACIÓN

### **¿Qué pesa más?**

✅ **NO afectan la carga:**
- `node_modules/` → No se envía al navegador
- `backend/` → Código del servidor

❌ **SÍ afectan la carga:**
- `backend/media/usuarios/` → Imágenes grandes
- Peticiones API lentas

### **Para optimizar:**
```powershell
.\optimizar_imagenes.ps1
```

---

## 📱 URLs FINALES

**Desde tu PC:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

**Desde tu Celular:**
- Frontend: http://192.168.1.100:5173
- Backend: http://192.168.1.100:8000

---

## 🆘 ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "Connection Refused" | Ejecuta `abrir_firewall.ps1` como ADMIN |
| "Network Error" | Backend no iniciado en 0.0.0.0:8000 |
| "CORS Policy" | Ya configurado en backend/.env |
| No carga página | Verifica MISMA red WiFi |
| IP diferente | Ejecuta `ipconfig` y actualiza .env |

---

## 📞 AYUDA ADICIONAL

Si después de seguir TODOS los pasos sigue sin funcionar:

1. Ejecuta: `.\verificar_conexion.ps1`
2. Revisa el output completo
3. Verifica que ambos servicios (backend/frontend) estén corriendo
4. Comprueba que el celular esté en la MISMA red WiFi

---

**¿TODO FUNCIONÓ?** 🎉
¡Perfecto! Ahora puedes desarrollar y probar desde tu celular en tiempo real.

