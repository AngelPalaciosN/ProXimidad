#!/bin/bash
# ============================================
# Script de Inicio del Servidor ProXimidad V3
# ============================================
# Ubicación: /home/proximidad/Desktop/start_server_v3.sh
# Uso: sudo bash /home/proximidad/Desktop/start_server_v3.sh

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================
# CONFIGURACIÓN
# ============================================

LOG_DIR="/home/proximidad/logs"
LOG_FILE="$LOG_DIR/startup_$(date +%Y%m%d_%H%M%S).log"
BACKEND_DIR="/home/proximidad/backend"
USER="proximidad"

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

# ============================================
# FUNCIONES AUXILIARES
# ============================================

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

check_service() {
    local service=$1
    if systemctl is-active --quiet "$service"; then
        log "✅ $service está activo"
        return 0
    else
        log_error "❌ $service NO está activo"
        return 1
    fi
}

# ============================================
# BANNER
# ============================================

clear
echo -e "${CYAN}"
echo "============================================"
echo "   INICIO DEL SERVIDOR PROXIMIDAD V3"
echo "============================================"
echo -e "${NC}"
log "Iniciando proceso de arranque..."

# ============================================
# 1. VERIFICAR CONECTIVIDAD
# ============================================

log_info "📡 Verificando conectividad de red..."

if ping -c 1 google.com &> /dev/null; then
    log "✅ Conectividad a Internet OK"
else
    log_warning "⚠️  No hay conectividad a Internet (continuando de todas formas)"
fi

# ============================================
# 2. CONFIGURAR NO-IP (DNS DINÁMICO)
# ============================================

log_info "🌐 Configurando No-IP DNS..."

NOIP_DIR="/home/proximidad/noip"
NOIP_EXEC="$NOIP_DIR/noip-duc"

if [ -f "$NOIP_EXEC" ]; then
    # Detener instancia previa
    pkill -f noip-duc 2>/dev/null || true
    
    # Iniciar No-IP
    cd "$NOIP_DIR"
    "$NOIP_EXEC" &
    
    sleep 3
    
    if pgrep -f noip-duc > /dev/null; then
        log "✅ No-IP DNS iniciado (proximidad.serveirc.com)"
    else
        log_warning "⚠️  No-IP no se pudo iniciar"
    fi
else
    log_warning "⚠️  No-IP no está instalado en $NOIP_DIR"
fi

# ============================================
# 3. INICIAR MARIADB
# ============================================

log_info "🗄️  Iniciando MariaDB..."

systemctl start mariadb
sleep 3

if check_service "mariadb"; then
    # Verificar que la base de datos responde
    if mysql -u root -e "SELECT 1;" &>/dev/null; then
        log "✅ MariaDB responde correctamente"
    else
        log_error "❌ MariaDB no responde"
        exit 1
    fi
else
    log_error "❌ No se pudo iniciar MariaDB"
    exit 1
fi

# ============================================
# 4. INICIAR GUNICORN APP 1 (Puerto 8000)
# ============================================

log_info "🚀 Iniciando Django App 1 (API Pública - Puerto 8000)..."

systemctl start proximidad_app1
sleep 5

if check_service "proximidad_app1"; then
    # Verificar que el puerto está escuchando
    if netstat -tuln | grep -q ":8000 "; then
        log "✅ App 1 escuchando en puerto 8000"
    else
        log_error "❌ App 1 no está escuchando en puerto 8000"
    fi
else
    log_error "❌ No se pudo iniciar proximidad_app1"
    exit 1
fi

# ============================================
# 5. INICIAR GUNICORN APP 2 (Puerto 8001)
# ============================================

log_info "🚀 Iniciando Django App 2 (API Privada - Puerto 8001)..."

systemctl start proximidad_app2
sleep 5

if check_service "proximidad_app2"; then
    # Verificar que el puerto está escuchando
    if netstat -tuln | grep -q ":8001 "; then
        log "✅ App 2 escuchando en puerto 8001"
    else
        log_error "❌ App 2 no está escuchando en puerto 8001"
    fi
else
    log_error "❌ No se pudo iniciar proximidad_app2"
    exit 1
fi

# ============================================
# 6. INICIAR NGINX
# ============================================

log_info "🌐 Iniciando Nginx..."

systemctl start nginx
sleep 3

if check_service "nginx"; then
    # Verificar que está escuchando en puerto 80
    if netstat -tuln | grep -q ":80 "; then
        log "✅ Nginx escuchando en puerto 80"
    else
        log_error "❌ Nginx no está escuchando en puerto 80"
    fi
else
    log_error "❌ No se pudo iniciar Nginx"
    exit 1
fi

# ============================================
# 7. HABILITAR SERVICIOS PARA AUTO-INICIO
# ============================================

log_info "⚙️  Habilitando servicios para auto-inicio..."

systemctl enable mariadb 2>/dev/null || log_warning "⚠️  No se pudo habilitar mariadb"
systemctl enable proximidad_app1 2>/dev/null || log_warning "⚠️  No se pudo habilitar proximidad_app1"
systemctl enable proximidad_app2 2>/dev/null || log_warning "⚠️  No se pudo habilitar proximidad_app2"
systemctl enable nginx 2>/dev/null || log_warning "⚠️  No se pudo habilitar nginx"

log "✅ Servicios habilitados para auto-inicio"

# ============================================
# 8. VERIFICAR ACCESO EXTERNO
# ============================================

log_info "🔍 Verificando acceso al servidor..."

# Obtener IP local
LOCAL_IP=$(hostname -I | awk '{print $1}')
log_info "IP Local: $LOCAL_IP"

# Verificar acceso local
if curl -s -o /dev/null -w "%{http_code}" "http://localhost/health" | grep -q "200"; then
    log "✅ Acceso local OK (localhost)"
else
    log_warning "⚠️  No se puede acceder localmente"
fi

# Verificar acceso por IP local
if curl -s -o /dev/null -w "%{http_code}" "http://$LOCAL_IP/health" | grep -q "200"; then
    log "✅ Acceso por IP local OK ($LOCAL_IP)"
else
    log_warning "⚠️  No se puede acceder por IP local"
fi

# ============================================
# 9. RESUMEN FINAL
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   ✅ SERVIDOR INICIADO EXITOSAMENTE${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
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
echo -e "${CYAN}📝 Logs disponibles en:${NC}"
echo -e "   Startup:  ${YELLOW}$LOG_FILE${NC}"
echo -e "   App 1:    ${YELLOW}/home/proximidad/logs/app1_error.log${NC}"
echo -e "   App 2:    ${YELLOW}/home/proximidad/logs/app2_error.log${NC}"
echo -e "   Nginx:    ${YELLOW}/var/log/nginx/proximidad_error.log${NC}"
echo ""
echo -e "${CYAN}🔧 Comandos útiles:${NC}"
echo -e "   Ver logs App 1:  ${YELLOW}sudo journalctl -u proximidad_app1 -f${NC}"
echo -e "   Ver logs App 2:  ${YELLOW}sudo journalctl -u proximidad_app2 -f${NC}"
echo -e "   Reiniciar todo:  ${YELLOW}sudo bash /home/proximidad/Desktop/restart_all.sh${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"

log "✅ Proceso de arranque completado"
