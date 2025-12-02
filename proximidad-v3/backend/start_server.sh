#!/bin/bash

# Script maestro para arrancar servidor Proximidad
# Auto-configura No-IP + Todos los Servicios (DB + Backend + Frontend)
# Autor: Claude para Ángel

LOG_FILE="/home/proximidad/logs/startup_$(date +%Y%m%d_%H%M%S).log"
NOIP_DIR="/home/proximidad/noip"
NOIP_USERNAME="palaciosangeldavidn@gmail.com"
NOIP_PASSWORD="2338188_Ang"
NOIP_HOSTNAME="proximidad.serveirc.com"

# Crear directorio de logs si no existe
mkdir -p /home/proximidad/logs

# Función para log con timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Función para verificar comandos críticos
check_command() {
    if [ $? -eq 0 ]; then
        log "✅ $1"
    else
        log "❌ ERROR en $1"
        return 1
    fi
}

clear
log "======================================"
log "   INICIANDO SERVIDOR PROXIMIDAD"
log "======================================"

# ============================================
# 1. LIMPIAR CRON ANTIGUOS (DuckDNS y No-IP)
# ============================================
log ""
log "🧹 Limpiando cron jobs antiguos..."

# Backup del crontab actual
crontab -l > /tmp/crontab_backup_$(date +%Y%m%d_%H%M%S).txt 2>/dev/null

# Eliminar todas las líneas que contengan "duck", "duckdns" o "noip"
crontab -l 2>/dev/null | grep -v "duck" | grep -v "duckdns" | grep -v "noip" | crontab - 2>/dev/null
check_command "Cron antiguo limpiado"

# ============================================
# 2. INSTALAR No-IP CLIENTE SI NO EXISTE
# ============================================
log ""
log "📦 Verificando instalación de No-IP..."

# Verificar si noip-duc ya está instalado
if command -v noip-duc &> /dev/null; then
    log "✅ No-IP cliente ya está instalado"
    NOIP_INSTALLED=true
else
    log "📥 No-IP no está instalado. Instalando..."
    
    # Crear directorio
    mkdir -p "$NOIP_DIR"
    cd "$NOIP_DIR"
    
    # Descargar cliente No-IP
    log "   Descargando No-IP cliente..."
    wget -q https://dmej72pbeggoq.cloudfront.net/installers/noip-duc_3.0.0-beta.7.tar.gz
    
    if [ -f "noip-duc_3.0.0-beta.7.tar.gz" ]; then
        log "   Extrayendo archivos..."
        tar xzf noip-duc_3.0.0-beta.7.tar.gz
        cd noip-duc_3.0.0-beta.7
        
        log "   Instalando No-IP..."
        sudo ./install.sh -y >/dev/null 2>&1
        
        if command -v noip-duc &> /dev/null; then
            log "✅ No-IP instalado correctamente"
            NOIP_INSTALLED=true
        else
            log "⚠️  No-IP no se instaló correctamente, usando método alternativo"
            NOIP_INSTALLED=false
        fi
    else
        log "⚠️  No se pudo descargar No-IP, usando método alternativo"
        NOIP_INSTALLED=false
    fi
fi

# ============================================
# 3. CONFIGURAR No-IP (Cliente o Script)
# ============================================
log ""
log "🌐 Configurando No-IP..."

if [ "$NOIP_INSTALLED" = true ]; then
    # Método 1: Usar cliente oficial
    log "   Usando cliente oficial No-IP..."
    
    # Detener servicio anterior si existe
    sudo systemctl stop noip-duc 2>/dev/null
    
    # Configurar con credenciales
    sudo noip-duc --username "$NOIP_USERNAME" --password "$NOIP_PASSWORD" --hostnames "$NOIP_HOSTNAME" --daemonize >/dev/null 2>&1
    
    # Habilitar servicio
    sudo systemctl enable noip-duc >/dev/null 2>&1
    sudo systemctl start noip-duc
    
    if systemctl is-active --quiet noip-duc; then
        log "✅ Servicio No-IP activo"
    else
        log "⚠️  Servicio No-IP puede tener problemas, verificando..."
    fi
    
else
    # Método 2: Usar script con curl (fallback)
    log "   Usando método alternativo con curl..."
    
    mkdir -p "$NOIP_DIR"
    
    # Crear script de actualización
    cat > "$NOIP_DIR/noip_update.sh" << EOF
#!/bin/bash
curl -s "https://$NOIP_USERNAME:$NOIP_PASSWORD@dynupdate.no-ip.com/nic/update?hostname=$NOIP_HOSTNAME" > $NOIP_DIR/noip.log 2>&1
EOF
    
    chmod +x "$NOIP_DIR/noip_update.sh"
    
    # Ejecutar actualización inmediata
    "$NOIP_DIR/noip_update.sh"
    
    if [ -f "$NOIP_DIR/noip.log" ]; then
        RESPONSE=$(cat "$NOIP_DIR/noip.log")
        if [[ "$RESPONSE" == good* ]] || [[ "$RESPONSE" == nochg* ]]; then
            log "✅ No-IP actualizado correctamente"
        else
            log "⚠️  Respuesta de No-IP: $RESPONSE"
        fi
    fi
    
    # Agregar a cron (cada 5 minutos)
    log "⏰ Configurando cron job (cada 5 minutos)..."
    (crontab -l 2>/dev/null; echo "*/5 * * * * $NOIP_DIR/noip_update.sh >/dev/null 2>&1") | crontab -
    check_command "Cron job creado"
fi

# Obtener IP actual
IP_ACTUAL=$(curl -s ifconfig.me)
log "   IP pública actual: $IP_ACTUAL"

# ============================================
# 4. VERIFICAR Y REPARAR RED SI ES NECESARIO
# ============================================
log ""
log "🔍 Verificando conectividad..."

if ! ping -c 2 8.8.8.8 >/dev/null 2>&1; then
    log "⚠️  Sin conectividad, intentando reparar..."
    
    sudo nmcli connection down "Angel" 2>/dev/null
    sleep 2
    sudo nmcli connection up "Angel" 2>/dev/null
    sleep 3
    
    if ping -c 2 8.8.8.8 >/dev/null 2>&1; then
        log "✅ Conectividad restaurada"
    else
        log "❌ ERROR: No se pudo restaurar conectividad"
        log "   Verifica manualmente la conexión Wi-Fi"
    fi
else
    log "✅ Conectividad OK"
fi

# ============================================
# 5. INICIAR MYSQL/MARIADB
# ============================================
log ""
log "🗄️  Iniciando MySQL/MariaDB..."

sudo systemctl start mariadb
sleep 2

if systemctl is-active --quiet mariadb; then
    log "✅ MariaDB activo"
else
    log "⚠️  MariaDB no inició correctamente"
fi

# ============================================
# 6. INICIAR BACKEND (GUNICORN)
# ============================================
log ""
log "🐍 Iniciando Backend Django (Gunicorn)..."

sudo systemctl start proximidad.service
sleep 3

if systemctl is-active --quiet proximidad.service; then
    log "✅ Backend (Gunicorn) activo"
    
    # Verificar puerto 8000
    if sudo netstat -tlnp 2>/dev/null | grep -q ":8000"; then
        log "✅ Puerto 8000 escuchando"
    else
        log "⚠️  Puerto 8000 no está escuchando"
    fi
else
    log "❌ ERROR: Backend no inició"
    log "   Ver logs: sudo journalctl -u proximidad.service -n 50"
fi

# ============================================
# 7. INICIAR NGINX (PROXY + FRONTEND)
# ============================================
log ""
log "🚀 Iniciando Nginx..."

sudo systemctl start nginx
sleep 2

if systemctl is-active --quiet nginx; then
    log "✅ Nginx activo"
    
    # Verificar puerto 80
    if sudo netstat -tlnp 2>/dev/null | grep -q ":80"; then
        log "✅ Puerto 80 escuchando"
    else
        log "⚠️  Puerto 80 no está escuchando"
    fi
else
    log "❌ ERROR: Nginx no inició"
    log "   Ejecuta: sudo systemctl status nginx"
    exit 1
fi

# ============================================
# 8. HABILITAR SERVICIOS PARA AUTO-INICIO
# ============================================
log ""
log "⚙️  Habilitando servicios para auto-inicio..."

sudo systemctl enable mariadb >/dev/null 2>&1
check_command "MariaDB habilitado para auto-inicio"

sudo systemctl enable proximidad.service >/dev/null 2>&1
check_command "Backend (Gunicorn) habilitado para auto-inicio"

sudo systemctl enable nginx >/dev/null 2>&1
check_command "Nginx habilitado para auto-inicio"

# ============================================
# 9. RESUMEN FINAL
# ============================================
log ""
log "======================================"
log "   ✅ SERVIDOR PROXIMIDAD LISTO"
log "======================================"
log ""
log "📍 Acceso local:"
log "   Frontend: http://192.168.1.50"
log "   Admin:    http://192.168.1.50/admin/"
log "   API:      http://192.168.1.50/api/"
log ""
log "🌍 Acceso externo:"
log "   Frontend: http://$NOIP_HOSTNAME"
log "   Admin:    http://$NOIP_HOSTNAME/admin/"
log "   API:      http://$NOIP_HOSTNAME/api/"
log "   IP:       $IP_ACTUAL"
log ""
log "📊 Servicios activos:"
systemctl is-active --quiet mariadb && log "   ✅ MariaDB (Base de datos)" || log "   ❌ MariaDB"
systemctl is-active --quiet proximidad.service && log "   ✅ Backend Django (Gunicorn)" || log "   ❌ Backend"
systemctl is-active --quiet nginx && log "   ✅ Nginx (Proxy + Frontend)" || log "   ❌ Nginx"
if [ "$NOIP_INSTALLED" = true ]; then
    systemctl is-active --quiet noip-duc && log "   ✅ No-IP DUC" || log "   ⚠️  No-IP DUC"
else
    log "   ✅ No-IP (script actualización)"
fi
log ""
log "⏰ No-IP actualizándose automáticamente cada 5 min"
log "📝 Log guardado en: $LOG_FILE"
log ""
log "🔧 Comandos útiles:"
log "   Ver logs backend:  sudo journalctl -u proximidad.service -f"
log "   Ver logs nginx:    sudo tail -f /var/log/nginx/proximidad_error.log"
log "   Reiniciar backend: sudo systemctl restart proximidad.service"
log "   Reiniciar nginx:   sudo systemctl restart nginx"
log "======================================"
log ""

# Verificar acceso externo
log "🔍 Verificando acceso externo..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$NOIP_HOSTNAME --connect-timeout 10)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    log "✅ Sitio accesible desde internet (HTTP $HTTP_CODE)"
else
    log "⚠️  Sitio NO accesible desde internet (HTTP $HTTP_CODE)"
    log "   Verifica port forwarding en el router:"
    log "   - Puerto 80 → 192.168.1.50:80"
    log "   - Puerto 443 → 192.168.1.50:443 (para HTTPS)"
fi

# Verificar API desde local
log ""
log "🧪 Verificando API local..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/ --connect-timeout 5)
if [ "$API_RESPONSE" = "200" ]; then
    log "✅ API respondiendo correctamente"
else
    log "⚠️  API no responde correctamente (HTTP $API_RESPONSE)"
fi

log ""
log "🎉 ¡Sistema completamente operativo!"
log ""
echo "Presiona Enter para cerrar..."
read
