#!/bin/bash
# ============================================
# Script de Verificación ProXimidad V3
# ============================================
# Verifica que todos los componentes están funcionando correctamente
# Uso: bash verify_v3_deployment.sh

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

echo -e "${CYAN}"
echo "============================================"
echo "   VERIFICACIÓN PROXIMIDAD V3"
echo "============================================"
echo -e "${NC}"

check_passed() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "${GREEN}✅ $1${NC}"
}

check_failed() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo -e "${RED}❌ $1${NC}"
}

check_warning() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ============================================
# 1. VERIFICAR ESTRUCTURA DE ARCHIVOS
# ============================================

echo -e "\n${CYAN}📁 Verificando estructura de archivos...${NC}\n"

if [ -d "/home/proximidad/backend" ]; then
    check_passed "Directorio backend existe"
else
    check_failed "Directorio backend NO existe"
fi

if [ -d "/home/proximidad/backend/proximidad_app" ]; then
    check_passed "proximidad_app existe"
else
    check_failed "proximidad_app NO existe"
fi

if [ -d "/home/proximidad/backend/proximidad_app2" ]; then
    check_passed "proximidad_app2 existe"
else
    check_failed "proximidad_app2 NO existe"
fi

if [ -f "/home/proximidad/backend/manage.py" ]; then
    check_passed "manage.py existe"
else
    check_failed "manage.py NO existe"
fi

if [ -d "/var/www/proximidad/frontend_build" ]; then
    check_passed "Directorio frontend existe"
else
    check_failed "Directorio frontend NO existe"
fi

if [ -f "/var/www/proximidad/frontend_build/index.html" ]; then
    check_passed "index.html existe"
else
    check_failed "index.html NO existe"
fi

# ============================================
# 2. VERIFICAR SERVICIOS SYSTEMD
# ============================================

echo -e "\n${CYAN}⚙️  Verificando servicios systemd...${NC}\n"

if systemctl is-active --quiet mariadb; then
    check_passed "MariaDB está activo"
else
    check_failed "MariaDB NO está activo"
fi

if systemctl is-active --quiet proximidad_app1; then
    check_passed "proximidad_app1 está activo"
else
    check_failed "proximidad_app1 NO está activo"
fi

if systemctl is-active --quiet proximidad_app2; then
    check_passed "proximidad_app2 está activo"
else
    check_failed "proximidad_app2 NO está activo"
fi

if systemctl is-active --quiet nginx; then
    check_passed "Nginx está activo"
else
    check_failed "Nginx NO está activo"
fi

# Verificar auto-inicio
if systemctl is-enabled --quiet proximidad_app1; then
    check_passed "proximidad_app1 habilitado para auto-inicio"
else
    check_warning "proximidad_app1 NO habilitado para auto-inicio"
fi

if systemctl is-enabled --quiet proximidad_app2; then
    check_passed "proximidad_app2 habilitado para auto-inicio"
else
    check_warning "proximidad_app2 NO habilitado para auto-inicio"
fi

# ============================================
# 3. VERIFICAR PUERTOS
# ============================================

echo -e "\n${CYAN}🔌 Verificando puertos...${NC}\n"

if netstat -tuln | grep -q ":80 "; then
    check_passed "Puerto 80 (Nginx) está escuchando"
else
    check_failed "Puerto 80 NO está escuchando"
fi

if netstat -tuln | grep -q ":8000 "; then
    check_passed "Puerto 8000 (App1) está escuchando"
else
    check_failed "Puerto 8000 NO está escuchando"
fi

if netstat -tuln | grep -q ":8001 "; then
    check_passed "Puerto 8001 (App2) está escuchando"
else
    check_failed "Puerto 8001 NO está escuchando"
fi

if netstat -tuln | grep -q ":3306 "; then
    check_passed "Puerto 3306 (MariaDB) está escuchando"
else
    check_failed "Puerto 3306 NO está escuchando"
fi

# ============================================
# 4. VERIFICAR CONFIGURACIÓN NGINX
# ============================================

echo -e "\n${CYAN}🌐 Verificando configuración Nginx...${NC}\n"

if [ -f "/etc/nginx/sites-available/proximidad_v3.conf" ]; then
    check_passed "Archivo de configuración existe"
else
    check_failed "Archivo de configuración NO existe"
fi

if [ -L "/etc/nginx/sites-enabled/proximidad_v3.conf" ]; then
    check_passed "Symlink en sites-enabled existe"
else
    check_warning "Symlink en sites-enabled NO existe"
fi

if nginx -t &>/dev/null; then
    check_passed "Configuración de Nginx es válida"
else
    check_failed "Configuración de Nginx tiene errores"
fi

# ============================================
# 5. VERIFICAR CONECTIVIDAD API
# ============================================

echo -e "\n${CYAN}🔗 Verificando APIs...${NC}\n"

# API Servicios (App1)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/servicios/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    check_passed "API Servicios responde (200)"
else
    check_failed "API Servicios no responde correctamente ($HTTP_CODE)"
fi

# API Categorías (App1)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/categorias/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    check_passed "API Categorías responde (200)"
else
    check_warning "API Categorías: $HTTP_CODE"
fi

# API Contacto (App2) - Espera 405 porque no permite GET
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/contacto/" 2>/dev/null)
if [ "$HTTP_CODE" = "405" ] || [ "$HTTP_CODE" = "200" ]; then
    check_passed "API Contacto responde ($HTTP_CODE)"
else
    check_warning "API Contacto: $HTTP_CODE"
fi

# Test directo a backends
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/api/servicios/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    check_passed "Acceso directo a App1:8000"
else
    check_warning "App1:8000 no responde directamente"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8001/api/contacto/" 2>/dev/null)
if [ "$HTTP_CODE" = "405" ] || [ "$HTTP_CODE" = "200" ]; then
    check_passed "Acceso directo a App2:8001"
else
    check_warning "App2:8001 no responde directamente"
fi

# ============================================
# 6. VERIFICAR FRONTEND
# ============================================

echo -e "\n${CYAN}🎨 Verificando frontend...${NC}\n"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    check_passed "Frontend accesible (200)"
else
    check_failed "Frontend no accesible ($HTTP_CODE)"
fi

# Verificar archivos estáticos
if [ -d "/var/www/proximidad/frontend_build/assets" ]; then
    ASSET_COUNT=$(find /var/www/proximidad/frontend_build/assets -type f | wc -l)
    check_passed "Assets encontrados ($ASSET_COUNT archivos)"
else
    check_warning "Carpeta assets no encontrada"
fi

# ============================================
# 7. VERIFICAR ARCHIVOS ESTÁTICOS Y MEDIA
# ============================================

echo -e "\n${CYAN}📦 Verificando archivos estáticos...${NC}\n"

if [ -d "/home/proximidad/backend/staticfiles" ]; then
    check_passed "Directorio staticfiles existe"
else
    check_warning "Directorio staticfiles NO existe"
fi

if [ -d "/home/proximidad/backend/media" ]; then
    check_passed "Directorio media existe"
else
    check_warning "Directorio media NO existe"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/static/admin/css/base.css" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    check_passed "Archivos estáticos accesibles"
else
    check_warning "Archivos estáticos no accesibles"
fi

# ============================================
# 8. VERIFICAR BASE DE DATOS
# ============================================

echo -e "\n${CYAN}🗄️  Verificando base de datos...${NC}\n"

if mysql -u root -e "SELECT 1;" &>/dev/null; then
    check_passed "Conexión a MariaDB OK"
else
    check_failed "No se puede conectar a MariaDB"
fi

# ============================================
# 9. VERIFICAR LOGS
# ============================================

echo -e "\n${CYAN}📝 Verificando logs...${NC}\n"

if [ -d "/home/proximidad/logs" ]; then
    check_passed "Directorio de logs existe"
else
    check_warning "Directorio de logs NO existe"
fi

# Verificar errores recientes en logs
if [ -f "/home/proximidad/logs/app1_error.log" ]; then
    ERROR_COUNT=$(grep -c "ERROR" /home/proximidad/logs/app1_error.log 2>/dev/null || echo 0)
    if [ "$ERROR_COUNT" -eq 0 ]; then
        check_passed "App1: Sin errores en logs"
    else
        check_warning "App1: $ERROR_COUNT errores en logs"
    fi
else
    check_warning "Log de App1 no encontrado"
fi

if [ -f "/home/proximidad/logs/app2_error.log" ]; then
    ERROR_COUNT=$(grep -c "ERROR" /home/proximidad/logs/app2_error.log 2>/dev/null || echo 0)
    if [ "$ERROR_COUNT" -eq 0 ]; then
        check_passed "App2: Sin errores en logs"
    else
        check_warning "App2: $ERROR_COUNT errores en logs"
    fi
else
    check_warning "Log de App2 no encontrado"
fi

# ============================================
# 10. VERIFICAR PERMISOS
# ============================================

echo -e "\n${CYAN}🔐 Verificando permisos...${NC}\n"

if [ -r "/home/proximidad/backend/manage.py" ]; then
    check_passed "Permisos de lectura en backend OK"
else
    check_failed "Problemas de permisos en backend"
fi

if [ -w "/home/proximidad/backend/media" ]; then
    check_passed "Permisos de escritura en media OK"
else
    check_warning "Problemas de permisos en media"
fi

# ============================================
# 11. VERIFICAR CONECTIVIDAD EXTERNA
# ============================================

echo -e "\n${CYAN}🌍 Verificando conectividad externa...${NC}\n"

if ping -c 1 google.com &>/dev/null; then
    check_passed "Conectividad a Internet OK"
else
    check_warning "Sin conectividad a Internet"
fi

# Verificar No-IP
if pgrep -f noip-duc &>/dev/null; then
    check_passed "No-IP DNS está corriendo"
else
    check_warning "No-IP DNS no está corriendo"
fi

# ============================================
# RESUMEN FINAL
# ============================================

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}   RESUMEN DE VERIFICACIÓN${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "Total de verificaciones: ${YELLOW}$TOTAL_CHECKS${NC}"
echo -e "Pasadas:                 ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Fallidas:                ${RED}$FAILED_CHECKS${NC}"
echo ""

# Calcular porcentaje
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

if [ "$PERCENTAGE" -ge 90 ]; then
    echo -e "${GREEN}✅ Sistema funcionando correctamente ($PERCENTAGE%)${NC}"
    exit 0
elif [ "$PERCENTAGE" -ge 70 ]; then
    echo -e "${YELLOW}⚠️  Sistema funcionando con advertencias ($PERCENTAGE%)${NC}"
    exit 0
else
    echo -e "${RED}❌ Sistema tiene problemas críticos ($PERCENTAGE%)${NC}"
    exit 1
fi
