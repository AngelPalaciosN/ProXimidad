#!/bin/bash
# ============================================
# Script de Reinicio Rápido ProXimidad V3
# ============================================
# Reinicia todos los servicios de forma ordenada
# Uso: sudo bash restart_all.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "============================================"
echo "   REINICIO DE SERVICIOS PROXIMIDAD V3"
echo "============================================"
echo -e "${NC}"

# ============================================
# 1. DETENER SERVICIOS
# ============================================

echo -e "\n${YELLOW}⏹️  Deteniendo servicios...${NC}\n"

# Detener Nginx primero (deja de recibir requests)
echo -e "   Deteniendo Nginx..."
systemctl stop nginx
sleep 1

# Detener Apps Django
echo -e "   Deteniendo App 1..."
systemctl stop proximidad_app1
sleep 1

echo -e "   Deteniendo App 2..."
systemctl stop proximidad_app2
sleep 1

echo -e "${GREEN}✅ Servicios detenidos${NC}"

# ============================================
# 2. VERIFICAR QUE LOS PUERTOS ESTÁN LIBRES
# ============================================

echo -e "\n${YELLOW}🔍 Verificando puertos...${NC}\n"

# Esperar a que los puertos se liberen
MAX_WAIT=10
COUNTER=0

while [ $COUNTER -lt $MAX_WAIT ]; do
    if netstat -tuln | grep -q ":8000 \|:8001 "; then
        echo -e "   Esperando a que se liberen los puertos... ($COUNTER/$MAX_WAIT)"
        sleep 1
        COUNTER=$((COUNTER + 1))
    else
        break
    fi
done

if netstat -tuln | grep -q ":8000 \|:8001 "; then
    echo -e "${RED}⚠️  Los puertos aún están ocupados, matando procesos...${NC}"
    pkill -9 gunicorn || true
    sleep 2
fi

echo -e "${GREEN}✅ Puertos liberados${NC}"

# ============================================
# 3. VERIFICAR BASE DE DATOS
# ============================================

echo -e "\n${YELLOW}🗄️  Verificando base de datos...${NC}\n"

if systemctl is-active --quiet mariadb; then
    echo -e "${GREEN}✅ MariaDB está activo${NC}"
else
    echo -e "${YELLOW}⚠️  Iniciando MariaDB...${NC}"
    systemctl start mariadb
    sleep 3
    
    if systemctl is-active --quiet mariadb; then
        echo -e "${GREEN}✅ MariaDB iniciado${NC}"
    else
        echo -e "${RED}❌ Error al iniciar MariaDB${NC}"
        exit 1
    fi
fi

# Test de conexión
if mysql -u root -e "SELECT 1;" &>/dev/null; then
    echo -e "${GREEN}✅ Conexión a BD OK${NC}"
else
    echo -e "${RED}❌ No se puede conectar a la BD${NC}"
    exit 1
fi

# ============================================
# 4. INICIAR APPS DJANGO
# ============================================

echo -e "\n${YELLOW}🚀 Iniciando aplicaciones Django...${NC}\n"

# Iniciar App 1
echo -e "   Iniciando App 1 (puerto 8000)..."
systemctl start proximidad_app1
sleep 3

if systemctl is-active --quiet proximidad_app1; then
    if netstat -tuln | grep -q ":8000 "; then
        echo -e "${GREEN}✅ App 1 iniciada y escuchando en puerto 8000${NC}"
    else
        echo -e "${RED}❌ App 1 iniciada pero no escucha en puerto 8000${NC}"
        echo -e "${YELLOW}   Ver logs: sudo journalctl -u proximidad_app1 -n 50${NC}"
    fi
else
    echo -e "${RED}❌ Error al iniciar App 1${NC}"
    echo -e "${YELLOW}   Ver logs: sudo journalctl -u proximidad_app1 -n 50${NC}"
    exit 1
fi

# Iniciar App 2
echo -e "   Iniciando App 2 (puerto 8001)..."
systemctl start proximidad_app2
sleep 3

if systemctl is-active --quiet proximidad_app2; then
    if netstat -tuln | grep -q ":8001 "; then
        echo -e "${GREEN}✅ App 2 iniciada y escuchando en puerto 8001${NC}"
    else
        echo -e "${RED}❌ App 2 iniciada pero no escucha en puerto 8001${NC}"
        echo -e "${YELLOW}   Ver logs: sudo journalctl -u proximidad_app2 -n 50${NC}"
    fi
else
    echo -e "${RED}❌ Error al iniciar App 2${NC}"
    echo -e "${YELLOW}   Ver logs: sudo journalctl -u proximidad_app2 -n 50${NC}"
    exit 1
fi

# ============================================
# 5. INICIAR NGINX
# ============================================

echo -e "\n${YELLOW}🌐 Iniciando Nginx...${NC}\n"

# Test de configuración
nginx -t 2>&1 | grep -q "successful"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Configuración de Nginx tiene errores${NC}"
    nginx -t
    exit 1
fi

# Iniciar Nginx
systemctl start nginx
sleep 2

if systemctl is-active --quiet nginx; then
    if netstat -tuln | grep -q ":80 "; then
        echo -e "${GREEN}✅ Nginx iniciado y escuchando en puerto 80${NC}"
    else
        echo -e "${RED}❌ Nginx iniciado pero no escucha en puerto 80${NC}"
    fi
else
    echo -e "${RED}❌ Error al iniciar Nginx${NC}"
    exit 1
fi

# ============================================
# 6. VERIFICAR CONECTIVIDAD
# ============================================

echo -e "\n${YELLOW}🔍 Verificando conectividad...${NC}\n"

sleep 3

# Test API Servicios
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/servicios/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ API Servicios responde (200)${NC}"
else
    echo -e "${YELLOW}⚠️  API Servicios: $HTTP_CODE${NC}"
fi

# Test API Contacto
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/api/contacto/" 2>/dev/null)
if [ "$HTTP_CODE" = "405" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ API Contacto responde ($HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  API Contacto: $HTTP_CODE${NC}"
fi

# Test Frontend
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend accesible (200)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: $HTTP_CODE${NC}"
fi

# ============================================
# 7. RESUMEN FINAL
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   ✅ REINICIO COMPLETADO${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Obtener IP
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo -e "${CYAN}📊 Estado de servicios:${NC}"
echo ""
systemctl status mariadb --no-pager -l | head -3
echo ""
systemctl status proximidad_app1 --no-pager -l | head -3
echo ""
systemctl status proximidad_app2 --no-pager -l | head -3
echo ""
systemctl status nginx --no-pager -l | head -3
echo ""

echo -e "${CYAN}🌐 URLs de acceso:${NC}"
echo -e "   Local:    ${YELLOW}http://localhost${NC}"
echo -e "   Red LAN:  ${YELLOW}http://$LOCAL_IP${NC}"
echo -e "   Externo:  ${YELLOW}http://proximidad.serveirc.com${NC}"
echo ""

echo -e "${CYAN}📝 Comandos útiles:${NC}"
echo -e "   Ver logs:      ${YELLOW}sudo journalctl -u proximidad_app1 -f${NC}"
echo -e "   Estado:        ${YELLOW}sudo systemctl status proximidad_app1 proximidad_app2${NC}"
echo -e "   Verificación:  ${YELLOW}bash verify_v3_deployment.sh${NC}"
echo ""

echo -e "${GREEN}============================================${NC}"
