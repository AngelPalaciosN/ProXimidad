# Configuración del Entorno Virtual

## ⚠️ IMPORTANTE: Solo usar UN entorno virtual

Este proyecto usa **ÚNICAMENTE** el entorno virtual ubicado en:
```
backend/venv/
```

## 🚀 Cómo activar el entorno virtual

### Opción 1: Scripts de activación automática (Recomendado)

**En PowerShell:**
```powershell
.\activar_venv.ps1
```

**En CMD:**
```cmd
activar_venv.bat
```

### Opción 2: Activación manual

**PowerShell:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

**CMD:**
```cmd
cd backend
venv\Scripts\activate.bat
```

## 📦 Instalar dependencias

Una vez activado el entorno virtual:
```bash
pip install -r requirements.txt
```

## 🔧 VS Code ya está configurado

El archivo `.vscode/settings.json` está configurado para usar automáticamente el entorno virtual correcto:
- `backend/venv/Scripts/python.exe`

## ❌ NO crear otros entornos virtuales

Si necesitas reinstalar el entorno virtual:

1. **Eliminar el actual:**
   ```powershell
   Remove-Item -Recurse -Force backend\venv
   ```

2. **Crear uno nuevo:**
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

## 🎯 Verificar que estás usando el venv correcto

Ejecuta:
```powershell
python -c "import sys; print(sys.executable)"
```

Debería mostrar:
```
C:\Users\SENA\Documents\GitHub\ProXimidad\proximidad-v2\backend\venv\Scripts\python.exe
```
