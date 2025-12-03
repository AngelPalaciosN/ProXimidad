#!/bin/bash
# ============================================
# Script de Deploy del Frontend ProXimidad V3
# ============================================
# Este script debe ejecutarse en la Raspberry Pi
# Uso: sudo bash deploy_frontend.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
FRONTEND_DIR="/var/www/proximidad/frontend_build"
BACKUP_DIR="/home/proximidad/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SOURCE_TARBALL="dist.tar.gz"

echo -e "${CYAN}"
echo "============================================"
echo "   DEPLOY FRONTEND PROXIMIDAD V3"
echo "============================================"
echo -e "${NC}"

# ============================================
# 1. VERIFICAR ARCHIVO DE BUILD
# ============================================

echo -e "${YELLOW}📦 Verificando archivo de build...${NC}"

if [ ! -f "$SOURCE_TARBALL" ]; then
    echo -e "${RED}❌ Error: No se encuentra $SOURCE_TARBALL${NC}"
    echo -e "${YELLOW}Debes copiar el archivo dist.tar.gz a este directorio${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivo de build encontrado${NC}"

# ============================================
# 2. CREAR BACKUP DEL FRONTEND ACTUAL
# ============================================

echo -e "${YELLOW}📦 Creando backup del frontend actual...${NC}"

mkdir -p "$BACKUP_DIR"

if [ -d "$FRONTEND_DIR" ]; then
    tar -czf "$BACKUP_DIR/frontend_backup_$TIMESTAMP.tar.gz" \
        -C "$(dirname $FRONTEND_DIR)" \
        "$(basename $FRONTEND_DIR)"
    
    echo -e "${GREEN}✅ Backup creado: frontend_backup_$TIMESTAMP.tar.gz${NC}"
else
    echo -e "${YELLOW}⚠️  No existe frontend previo, continuando...${NC}"
fi

# ============================================
# 3. DETENER NGINX
# ============================================

echo -e "${YELLOW}⏹️  Deteniendo Nginx...${NC}"

systemctl stop nginx

echo -e "${GREEN}✅ Nginx detenido${NC}"

# ============================================
# 4. LIMPIAR DIRECTORIO ACTUAL
# ============================================

echo -e "${YELLOW}🧹 Limpiando directorio de frontend...${NC}"

# Crear directorio si no existe
mkdir -p "$FRONTEND_DIR"

# Limpiar contenido
rm -rf "${FRONTEND_DIR:?}"/*

echo -e "${GREEN}✅ Directorio limpiado${NC}"

# ============================================
# 5. EXTRAER NUEVO BUILD
# ============================================

echo -e "${YELLOW}📦 Extrayendo nuevo build...${NC}"

tar -xzf "$SOURCE_TARBALL" -C "$FRONTEND_DIR"

# Verificar que se extrajo correctamente
if [ ! -f "$FRONTEND_DIR/index.html" ]; then
    echo -e "${RED}❌ Error: No se encontró index.html después de extraer${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    tar -xzf "$BACKUP_DIR/frontend_backup_$TIMESTAMP.tar.gz" -C "$(dirname $FRONTEND_DIR)"
    exit 1
fi

echo -e "${GREEN}✅ Build extraído correctamente${NC}"

# ============================================
# 6. CONFIGURAR PERMISOS
# ============================================

echo -e "${YELLOW}🔐 Configurando permisos...${NC}"

# Cambiar propietario a www-data (usuario de nginx)
chown -R www-data:www-data "$FRONTEND_DIR"

# Permisos de lectura para todos los archivos
find "$FRONTEND_DIR" -type f -exec chmod 644 {} \;

# Permisos de ejecución para directorios
find "$FRONTEND_DIR" -type d -exec chmod 755 {} \;

echo -e "${GREEN}✅ Permisos configurados${NC}"

# ============================================
# 7. VERIFICAR ARCHIVOS
# ============================================

echo -e "${YELLOW}🔍 Verificando archivos del build...${NC}"

# Contar archivos
FILE_COUNT=$(find "$FRONTEND_DIR" -type f | wc -l)
echo -e "   Archivos extraídos: ${YELLOW}$FILE_COUNT${NC}"

# Verificar index.html
if [ -f "$FRONTEND_DIR/index.html" ]; then
    SIZE=$(stat -f%z "$FRONTEND_DIR/index.html" 2>/dev/null || stat -c%s "$FRONTEND_DIR/index.html")
    echo -e "   index.html: ${GREEN}✅ ($SIZE bytes)${NC}"
else
    echo -e "   index.html: ${RED}❌ NO ENCONTRADO${NC}"
    exit 1
fi

# Verificar carpeta assets
if [ -d "$FRONTEND_DIR/assets" ]; then
    ASSETS_COUNT=$(find "$FRONTEND_DIR/assets" -type f | wc -l)
    echo -e "   assets/: ${GREEN}✅ ($ASSETS_COUNT archivos)${NC}"
else
    echo -e "   assets/: ${YELLOW}⚠️  NO ENCONTRADA${NC}"
fi

echo -e "${GREEN}✅ Verificación completa${NC}"

# ============================================
# 8. INICIAR NGINX
# ============================================

echo -e "${YELLOW}🚀 Iniciando Nginx...${NC}"

# Test de configuración
nginx -t
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en configuración de Nginx${NC}"
    exit 1
fi

# Iniciar nginx
systemctl start nginx

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx iniciado correctamente${NC}"
else
    echo -e "${RED}❌ Error al iniciar Nginx${NC}"
    exit 1
fi

# ============================================
# 9. VERIFICAR ACCESO
# ============================================

echo -e "${YELLOW}🔍 Verificando acceso al frontend...${NC}"

sleep 3

# Test HTTP local
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/" | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend accesible localmente${NC}"
else
    echo -e "${RED}❌ Frontend no accesible${NC}"
fi

# Obtener IP
LOCAL_IP=$(hostname -I | awk '{print $1}')

# ============================================
# RESUMEN FINAL
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   ✅ DEPLOY COMPLETADO EXITOSAMENTE${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📊 Información del deploy:${NC}"
echo -e "   Backup:     ${YELLOW}$BACKUP_DIR/frontend_backup_$TIMESTAMP.tar.gz${NC}"
echo -e "   Frontend:   ${YELLOW}$FRONTEND_DIR${NC}"
echo -e "   Archivos:   ${YELLOW}$FILE_COUNT${NC}"
echo ""
echo -e "${CYAN}🌐 URLs de acceso:${NC}"
echo -e "   Local:      ${YELLOW}http://localhost${NC}"
echo -e "   Red LAN:    ${YELLOW}http://$LOCAL_IP${NC}"
echo -e "   Externo:    ${YELLOW}http://proximidad.serveirc.com${NC}"
echo ""
echo -e "${CYAN}📝 Comandos útiles:${NC}"
echo -e "   Ver logs:   ${YELLOW}sudo tail -f /var/log/nginx/proximidad_access.log${NC}"
echo -e "   Reiniciar:  ${YELLOW}sudo systemctl restart nginx${NC}"
echo -e "   Rollback:   ${YELLOW}sudo tar -xzf $BACKUP_DIR/frontend_backup_$TIMESTAMP.tar.gz -C /var/www/proximidad${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
