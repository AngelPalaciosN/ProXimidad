#!/bin/bash
# ============================================
# Script de Deploy del Backend ProXimidad V3
# ============================================
# Este script debe ejecutarse en la Raspberry Pi
# Uso: sudo bash deploy_backend.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
BACKEND_DIR="/home/proximidad/backend"
BACKUP_DIR="/home/proximidad/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
USER="proximidad"

echo -e "${CYAN}"
echo "============================================"
echo "   DEPLOY BACKEND PROXIMIDAD V3"
echo "============================================"
echo -e "${NC}"

# ============================================
# 1. CREAR BACKUP DEL BACKEND ACTUAL
# ============================================

echo -e "${YELLOW}📦 Creando backup del backend actual...${NC}"

mkdir -p "$BACKUP_DIR"

if [ -d "$BACKEND_DIR" ]; then
    tar -czf "$BACKUP_DIR/backend_backup_$TIMESTAMP.tar.gz" \
        -C "$(dirname $BACKEND_DIR)" \
        "$(basename $BACKEND_DIR)" \
        --exclude='*.pyc' \
        --exclude='__pycache__' \
        --exclude='*.log' \
        --exclude='media/*'
    
    echo -e "${GREEN}✅ Backup creado: backend_backup_$TIMESTAMP.tar.gz${NC}"
else
    echo -e "${YELLOW}⚠️  No existe backend previo, continuando...${NC}"
fi

# ============================================
# 2. DETENER SERVICIOS
# ============================================

echo -e "${YELLOW}⏹️  Deteniendo servicios...${NC}"

systemctl stop proximidad_app1 2>/dev/null || echo "App1 no estaba corriendo"
systemctl stop proximidad_app2 2>/dev/null || echo "App2 no estaba corriendo"
systemctl stop nginx

echo -e "${GREEN}✅ Servicios detenidos${NC}"

# ============================================
# 3. VERIFICAR CÓDIGO FUENTE V3
# ============================================

echo -e "${YELLOW}📁 Verificando código fuente V3...${NC}"

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio backend${NC}"
    echo -e "${YELLOW}Debes copiar el código V3 a $BACKEND_DIR${NC}"
    exit 1
fi

# Verificar que tiene la estructura de V3
if [ ! -d "$BACKEND_DIR/proximidad_app" ] || [ ! -d "$BACKEND_DIR/proximidad_app2" ]; then
    echo -e "${RED}❌ Error: Estructura de V3 incompleta${NC}"
    echo -e "${YELLOW}Faltan directorios proximidad_app o proximidad_app2${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Estructura V3 correcta${NC}"

# ============================================
# 4. INSTALAR/ACTUALIZAR DEPENDENCIAS
# ============================================

echo -e "${YELLOW}📥 Instalando dependencias de Python...${NC}"

cd "$BACKEND_DIR"

# Verificar que existe requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}❌ Error: No se encuentra requirements.txt${NC}"
    exit 1
fi

# Instalar/actualizar pip
pip3 install --upgrade pip

# Instalar dependencias
pip3 install -r requirements.txt

echo -e "${GREEN}✅ Dependencias instaladas${NC}"

# ============================================
# 5. EJECUTAR MIGRACIONES
# ============================================

echo -e "${YELLOW}🔄 Ejecutando migraciones de base de datos...${NC}"

# Aplicar migraciones
python3 manage.py migrate --noinput

echo -e "${GREEN}✅ Migraciones aplicadas${NC}"

# ============================================
# 6. RECOLECTAR ARCHIVOS ESTÁTICOS
# ============================================

echo -e "${YELLOW}📦 Recolectando archivos estáticos...${NC}"

python3 manage.py collectstatic --noinput

echo -e "${GREEN}✅ Archivos estáticos recolectados${NC}"

# ============================================
# 7. CONFIGURAR PERMISOS
# ============================================

echo -e "${YELLOW}🔐 Configurando permisos...${NC}"

# Cambiar propietario
chown -R $USER:$USER "$BACKEND_DIR"

# Permisos para media
chmod -R 755 "$BACKEND_DIR/media"
mkdir -p "$BACKEND_DIR/media/servicios/imagenes"
mkdir -p "$BACKEND_DIR/media/usuarios"
chown -R $USER:$USER "$BACKEND_DIR/media"

# Permisos para logs
mkdir -p /home/proximidad/logs
chown -R $USER:$USER /home/proximidad/logs
chmod -R 755 /home/proximidad/logs

echo -e "${GREEN}✅ Permisos configurados${NC}"

# ============================================
# 8. COPIAR ARCHIVOS DE CONFIGURACIÓN
# ============================================

echo -e "${YELLOW}⚙️  Verificando archivos de configuración...${NC}"

# Verificar systemd services
if [ -f "/etc/systemd/system/proximidad_app1.service" ]; then
    echo -e "${GREEN}✅ proximidad_app1.service configurado${NC}"
else
    echo -e "${RED}❌ Falta proximidad_app1.service${NC}"
    echo -e "${YELLOW}Copia el archivo desde deployment/systemd/${NC}"
fi

if [ -f "/etc/systemd/system/proximidad_app2.service" ]; then
    echo -e "${GREEN}✅ proximidad_app2.service configurado${NC}"
else
    echo -e "${RED}❌ Falta proximidad_app2.service${NC}"
    echo -e "${YELLOW}Copia el archivo desde deployment/systemd/${NC}"
fi

# Verificar nginx config
if [ -f "/etc/nginx/sites-available/proximidad_v3" ]; then
    echo -e "${GREEN}✅ Nginx config disponible${NC}"
    
    # Crear symlink si no existe
    if [ ! -L "/etc/nginx/sites-enabled/proximidad_v3" ]; then
        ln -s /etc/nginx/sites-available/proximidad_v3 /etc/nginx/sites-enabled/
        echo -e "${GREEN}✅ Symlink de nginx creado${NC}"
    fi
    
    # Desactivar config antigua si existe
    if [ -L "/etc/nginx/sites-enabled/proximidad" ]; then
        rm /etc/nginx/sites-enabled/proximidad
        echo -e "${YELLOW}⚠️  Config V2 desactivada${NC}"
    fi
else
    echo -e "${RED}❌ Falta configuración de nginx${NC}"
    echo -e "${YELLOW}Copia el archivo desde deployment/nginx/${NC}"
fi

# Recargar systemd
systemctl daemon-reload

echo -e "${GREEN}✅ Configuraciones verificadas${NC}"

# ============================================
# 9. VERIFICAR BASE DE DATOS
# ============================================

echo -e "${YELLOW}🗄️  Verificando base de datos...${NC}"

# Test de conexión
if python3 manage.py check --database default; then
    echo -e "${GREEN}✅ Conexión a base de datos OK${NC}"
else
    echo -e "${RED}❌ Error de conexión a base de datos${NC}"
    exit 1
fi

# ============================================
# 10. INICIAR SERVICIOS
# ============================================

echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"

# Iniciar App 1
systemctl start proximidad_app1
sleep 3
if systemctl is-active --quiet proximidad_app1; then
    echo -e "${GREEN}✅ App 1 iniciada (puerto 8000)${NC}"
else
    echo -e "${RED}❌ Error al iniciar App 1${NC}"
    journalctl -u proximidad_app1 -n 20
    exit 1
fi

# Iniciar App 2
systemctl start proximidad_app2
sleep 3
if systemctl is-active --quiet proximidad_app2; then
    echo -e "${GREEN}✅ App 2 iniciada (puerto 8001)${NC}"
else
    echo -e "${RED}❌ Error al iniciar App 2${NC}"
    journalctl -u proximidad_app2 -n 20
    exit 1
fi

# Test Nginx config
nginx -t
if [ $? -eq 0 ]; then
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx iniciado${NC}"
else
    echo -e "${RED}❌ Error en configuración de Nginx${NC}"
    exit 1
fi

# ============================================
# 11. VERIFICAR DESPLIEGUE
# ============================================

echo -e "${YELLOW}🔍 Verificando despliegue...${NC}"

sleep 5

# Test endpoints
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/servicios/" | grep -q "200"; then
    echo -e "${GREEN}✅ API Servicios responde${NC}"
else
    echo -e "${RED}❌ API Servicios no responde${NC}"
fi

if curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/contacto/" | grep -q "405\|200"; then
    echo -e "${GREEN}✅ API Contacto responde${NC}"
else
    echo -e "${RED}❌ API Contacto no responde${NC}"
fi

# ============================================
# RESUMEN FINAL
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   ✅ DEPLOY COMPLETADO EXITOSAMENTE${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📊 Información del deploy:${NC}"
echo -e "   Backup:    ${YELLOW}$BACKUP_DIR/backend_backup_$TIMESTAMP.tar.gz${NC}"
echo -e "   Backend:   ${YELLOW}$BACKEND_DIR${NC}"
echo -e "   App 1:     ${YELLOW}http://localhost:8000${NC}"
echo -e "   App 2:     ${YELLOW}http://localhost:8001${NC}"
echo ""
echo -e "${CYAN}📝 Comandos útiles:${NC}"
echo -e "   Logs App 1:   ${YELLOW}sudo journalctl -u proximidad_app1 -f${NC}"
echo -e "   Logs App 2:   ${YELLOW}sudo journalctl -u proximidad_app2 -f${NC}"
echo -e "   Reiniciar:    ${YELLOW}sudo systemctl restart proximidad_app1 proximidad_app2${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
