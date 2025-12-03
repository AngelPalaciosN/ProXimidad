#!/bin/bash
# ============================================
# Script de Rollback ProXimidad V3 → V2
# ============================================
# Uso: sudo bash rollback_to_v2.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
BACKUP_DIR="/home/proximidad/backups"
BACKEND_DIR="/home/proximidad/backend"
FRONTEND_DIR="/var/www/proximidad/frontend_build"

echo -e "${CYAN}"
echo "============================================"
echo "   ROLLBACK A PROXIMIDAD V2"
echo "============================================"
echo -e "${NC}"

# Verificar que se quiere continuar
echo -e "${YELLOW}⚠️  ADVERTENCIA: Este script revertirá a la versión V2${NC}"
echo -e "${YELLOW}   Se restaurarán los últimos backups disponibles${NC}"
echo ""
read -p "¿Estás seguro? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Rollback cancelado${NC}"
    exit 1
fi

# ============================================
# 1. DETENER SERVICIOS V3
# ============================================

echo -e "${YELLOW}⏹️  Deteniendo servicios V3...${NC}"

systemctl stop proximidad_app1 2>/dev/null || echo "App1 no estaba corriendo"
systemctl stop proximidad_app2 2>/dev/null || echo "App2 no estaba corriendo"
systemctl stop nginx

echo -e "${GREEN}✅ Servicios V3 detenidos${NC}"

# ============================================
# 2. BUSCAR BACKUPS MÁS RECIENTES
# ============================================

echo -e "${YELLOW}🔍 Buscando backups...${NC}"

# Buscar último backup de backend
BACKEND_BACKUP=$(ls -t $BACKUP_DIR/backend_backup_*.tar.gz 2>/dev/null | head -1)
if [ -z "$BACKEND_BACKUP" ]; then
    echo -e "${RED}❌ No se encontró backup de backend${NC}"
    exit 1
fi
echo -e "   Backend: ${GREEN}$(basename $BACKEND_BACKUP)${NC}"

# Buscar último backup de frontend
FRONTEND_BACKUP=$(ls -t $BACKUP_DIR/frontend_backup_*.tar.gz 2>/dev/null | head -1)
if [ -z "$FRONTEND_BACKUP" ]; then
    echo -e "${RED}❌ No se encontró backup de frontend${NC}"
    exit 1
fi
echo -e "   Frontend: ${GREEN}$(basename $FRONTEND_BACKUP)${NC}"

# ============================================
# 3. RESTAURAR BACKEND
# ============================================

echo -e "${YELLOW}📦 Restaurando backend...${NC}"

# Hacer backup de V3 antes de sobrescribir
if [ -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}   Guardando V3 actual...${NC}"
    tar -czf "$BACKUP_DIR/backend_v3_before_rollback_$(date +%Y%m%d_%H%M%S).tar.gz" \
        -C "$(dirname $BACKEND_DIR)" \
        "$(basename $BACKEND_DIR)"
fi

# Limpiar directorio
rm -rf "${BACKEND_DIR:?}"/*

# Restaurar backup
tar -xzf "$BACKEND_BACKUP" -C "$(dirname $BACKEND_DIR)"

echo -e "${GREEN}✅ Backend restaurado${NC}"

# ============================================
# 4. RESTAURAR FRONTEND
# ============================================

echo -e "${YELLOW}📦 Restaurando frontend...${NC}"

# Hacer backup de V3 antes de sobrescribir
if [ -d "$FRONTEND_DIR" ]; then
    echo -e "${YELLOW}   Guardando V3 actual...${NC}"
    tar -czf "$BACKUP_DIR/frontend_v3_before_rollback_$(date +%Y%m%d_%H%M%S).tar.gz" \
        -C "$(dirname $FRONTEND_DIR)" \
        "$(basename $FRONTEND_DIR)"
fi

# Limpiar directorio
rm -rf "${FRONTEND_DIR:?}"/*

# Restaurar backup
tar -xzf "$FRONTEND_BACKUP" -C "$(dirname $FRONTEND_DIR)"

echo -e "${GREEN}✅ Frontend restaurado${NC}"

# ============================================
# 5. RESTAURAR CONFIGURACIÓN NGINX V2
# ============================================

echo -e "${YELLOW}⚙️  Restaurando configuración Nginx V2...${NC}"

# Desactivar config V3
if [ -L "/etc/nginx/sites-enabled/proximidad_v3" ]; then
    rm /etc/nginx/sites-enabled/proximidad_v3
fi

# Activar config V2
if [ -f "/etc/nginx/sites-available/proximidad" ]; then
    ln -sf /etc/nginx/sites-available/proximidad /etc/nginx/sites-enabled/
    echo -e "${GREEN}✅ Config V2 activada${NC}"
else
    echo -e "${RED}❌ No se encuentra config V2 de nginx${NC}"
    echo -e "${YELLOW}   Deberás configurarla manualmente${NC}"
fi

# Test config
nginx -t

# ============================================
# 6. RESTAURAR SERVICIOS V2
# ============================================

echo -e "${YELLOW}⚙️  Configurando servicios V2...${NC}"

# Deshabilitar servicios V3
systemctl disable proximidad_app1 2>/dev/null || true
systemctl disable proximidad_app2 2>/dev/null || true

# Habilitar servicio V2 (si existe)
if [ -f "/etc/systemd/system/proximidad.service" ]; then
    systemctl enable proximidad.service
    echo -e "${GREEN}✅ Servicio V2 habilitado${NC}"
else
    echo -e "${YELLOW}⚠️  No se encuentra proximidad.service (V2)${NC}"
    echo -e "${YELLOW}   Deberás iniciar Gunicorn manualmente${NC}"
fi

systemctl daemon-reload

# ============================================
# 7. INICIAR SERVICIOS V2
# ============================================

echo -e "${YELLOW}🚀 Iniciando servicios V2...${NC}"

# Iniciar MariaDB
systemctl start mariadb
sleep 2

# Iniciar Gunicorn V2
if [ -f "/etc/systemd/system/proximidad.service" ]; then
    systemctl start proximidad.service
    sleep 3
    
    if systemctl is-active --quiet proximidad.service; then
        echo -e "${GREEN}✅ Gunicorn V2 iniciado${NC}"
    else
        echo -e "${RED}❌ Error al iniciar Gunicorn V2${NC}"
        echo -e "${YELLOW}   Ver logs: sudo journalctl -u proximidad -n 50${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Iniciando Gunicorn manualmente...${NC}"
    cd "$BACKEND_DIR"
    nohup gunicorn --bind 127.0.0.1:8000 --workers 3 core.wsgi:application > /home/proximidad/logs/gunicorn.log 2>&1 &
    sleep 3
    
    if netstat -tuln | grep -q ":8000 "; then
        echo -e "${GREEN}✅ Gunicorn iniciado manualmente (puerto 8000)${NC}"
    else
        echo -e "${RED}❌ Error al iniciar Gunicorn${NC}"
    fi
fi

# Iniciar Nginx
systemctl start nginx
sleep 2

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx iniciado${NC}"
else
    echo -e "${RED}❌ Error al iniciar Nginx${NC}"
fi

# ============================================
# 8. VERIFICAR ROLLBACK
# ============================================

echo -e "${YELLOW}🔍 Verificando rollback...${NC}"

sleep 3

# Test API
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/servicios/" | grep -q "200"; then
    echo -e "${GREEN}✅ API responde correctamente${NC}"
else
    echo -e "${RED}❌ API no responde${NC}"
fi

# Test Frontend
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/" | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend accesible${NC}"
else
    echo -e "${RED}❌ Frontend no accesible${NC}"
fi

# ============================================
# RESUMEN FINAL
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   ✅ ROLLBACK COMPLETADO${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📊 Estado del sistema:${NC}"
echo ""
echo -e "   Backend restaurado desde:"
echo -e "   ${YELLOW}$(basename $BACKEND_BACKUP)${NC}"
echo ""
echo -e "   Frontend restaurado desde:"
echo -e "   ${YELLOW}$(basename $FRONTEND_BACKUP)${NC}"
echo ""
echo -e "${CYAN}📝 Archivos de V3 guardados en:${NC}"
echo -e "   ${YELLOW}$BACKUP_DIR/backend_v3_before_rollback_*${NC}"
echo -e "   ${YELLOW}$BACKUP_DIR/frontend_v3_before_rollback_*${NC}"
echo ""
echo -e "${CYAN}🔧 Servicios V2:${NC}"
systemctl status proximidad.service --no-pager -l | head -3 || echo "   Gunicorn manual"
echo ""
systemctl status nginx --no-pager -l | head -3
echo ""
echo -e "${CYAN}🌐 URLs de acceso:${NC}"
echo -e "   ${YELLOW}http://localhost${NC}"
echo -e "   ${YELLOW}http://192.168.1.50${NC}"
echo -e "   ${YELLOW}http://proximidad.serveirc.com${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
