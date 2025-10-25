# 🛡️ Prevención de Múltiples Entornos Virtuales

## ✅ Configuración Aplicada

Para evitar que vuelvas a tener problemas con múltiples entornos virtuales, se han implementado las siguientes medidas:

### 1. **Configuración de VS Code** (`.vscode/settings.json`)
   - ✅ Entorno virtual predeterminado: `backend/venv/Scripts/python.exe`
   - ✅ Activación automática del terminal
   - ✅ Variables de entorno configuradas

### 2. **Scripts de Activación Rápida**
   - ✅ `activar_venv.ps1` (PowerShell)
   - ✅ `activar_venv.bat` (CMD)
   
   **Uso desde la raíz del proyecto:**
   ```powershell
   .\activar_venv.ps1
   ```

### 3. **Archivo .gitignore**
   - ✅ Ignora entornos virtuales duplicados
   - ✅ Mantiene solo `backend/venv/`

### 4. **Documentación**
   - ✅ `VENV_SETUP.md` - Guía completa del entorno virtual
   - ✅ `backend/README.md` - Actualizado con instrucciones

## 🎯 Verificación Rápida

Para verificar que estás usando el entorno virtual correcto:

```powershell
python -c "import sys; print(sys.executable)"
```

**Salida esperada:**
```
C:\Users\SENA\Documents\GitHub\ProXimidad\proximidad-v2\backend\venv\Scripts\python.exe
```

## 🔄 Si necesitas reinstalar el entorno virtual

```powershell
# 1. Eliminar el actual
Remove-Item -Recurse -Force backend\venv

# 2. Crear uno nuevo
cd backend
python -m venv venv

# 3. Activar
.\venv\Scripts\Activate.ps1

# 4. Instalar dependencias
pip install -r requirements.txt
```

## 📋 Checklist de Buenas Prácticas

- [ ] Siempre usar los scripts de activación (`activar_venv.ps1`)
- [ ] Verificar el PATH de Python antes de instalar paquetes
- [ ] Instalar dependencias solo con el venv activado
- [ ] No crear entornos virtuales en otras ubicaciones
- [ ] Usar `pip list` para verificar paquetes instalados en el venv correcto

## ⚠️ Señales de que estás en el venv incorrecto

Si ves estos errores:
- `ModuleNotFoundError: No module named 'decouple'`
- `ModuleNotFoundError: No module named 'django'`
- Rutas como `C:\Program Files\Python310\python.exe`

**Solución:** Activar el entorno virtual correcto con `.\activar_venv.ps1`

## 🚀 Comandos Comunes

```powershell
# Activar entorno virtual (desde raíz)
.\activar_venv.ps1

# Ejecutar servidor Django
py manage.py runserver 192.168.0.100:8000

# Instalar nueva dependencia
pip install nombre-paquete
pip freeze > requirements.txt

# Ver paquetes instalados
pip list
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica la ruta de Python: `python -c "import sys; print(sys.executable)"`
2. Revisa que VS Code esté usando el intérprete correcto (barra inferior)
3. Reinicia VS Code después de cambios en configuración
4. Consulta `VENV_SETUP.md` para más detalles
