#!/bin/bash
# Script de verificación del sistema - ProXimidad Backend
# Verifica que todo esté configurado correctamente antes de desplegar

echo "🔍 Verificando configuración del sistema..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Obtener directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Verificando dependencias del sistema..."
echo ""

# Verificar Python
python3 --version > /dev/null 2>&1
check_status "Python 3 instalado"

# Verificar pip
pip3 --version > /dev/null 2>&1
check_status "pip3 instalado"

# Verificar MySQL/MariaDB
systemctl is-active --quiet mariadb
check_status "MariaDB está corriendo"

# Verificar Nginx
systemctl is-active --quiet nginx
check_status "Nginx está corriendo"

echo ""
echo "🐍 Verificando entorno virtual..."
echo ""

# Verificar entorno virtual
if [ -d "venv" ]; then
    check_status "Entorno virtual existe"
    
    # Activar y verificar paquetes
    source venv/bin/activate
    
    # Verificar Django
    python -c "import django" 2>/dev/null
    check_status "Django instalado"
    
    # Verificar Gunicorn
    python -c "import gunicorn" 2>/dev/null
    check_status "Gunicorn instalado"
    
    # Verificar mysqlclient
    python -c "import MySQLdb" 2>/dev/null
    check_status "mysqlclient instalado"
    
    # Verificar DRF
    python -c "import rest_framework" 2>/dev/null
    check_status "Django REST Framework instalado"
    
    deactivate
else
    check_warning "Entorno virtual no encontrado - debes crearlo con: python3 -m venv venv"
fi

echo ""
echo "📁 Verificando estructura de directorios..."
echo ""

# Verificar directorios críticos
[ -d "media" ] && check_status "Directorio media/" || check_warning "Directorio media/ no existe"
[ -d "media/servicios/imagenes" ] && check_status "Directorio media/servicios/imagenes/" || check_warning "Directorio media/servicios/imagenes/ no existe"
[ -d "media/usuarios" ] && check_status "Directorio media/usuarios/" || check_warning "Directorio media/usuarios/ no existe"
[ -d "staticfiles" ] && check_status "Directorio staticfiles/" || check_warning "Directorio staticfiles/ no existe (se creará con collectstatic)"

echo ""
echo "🔐 Verificando permisos..."
echo ""

# Verificar permisos de media
if [ -d "media" ]; then
    MEDIA_PERMS=$(stat -c %a media 2>/dev/null)
    if [ "$MEDIA_PERMS" = "775" ] || [ "$MEDIA_PERMS" = "755" ]; then
        check_status "Permisos de media/ correctos ($MEDIA_PERMS)"
    else
        check_warning "Permisos de media/ pueden necesitar ajuste (actual: $MEDIA_PERMS, recomendado: 775)"
    fi
fi

echo ""
echo "⚙️ Verificando configuración..."
echo ""

# Verificar archivo .env
[ -f ".env" ] && check_status "Archivo .env existe" || check_warning "Archivo .env no existe - copia .env.production como .env"

# Verificar archivos de configuración
[ -f "gunicorn_config.py" ] && check_status "gunicorn_config.py existe" || check_warning "gunicorn_config.py no encontrado"
[ -f "manage.py" ] && check_status "manage.py existe" || check_warning "manage.py no encontrado"

echo ""
echo "🗄️ Verificando base de datos..."
echo ""

# Verificar si la base de datos existe
mysql -u root -e "USE proxima;" 2>/dev/null
check_status "Base de datos 'proxima' existe"

# Verificar conexión desde Django
if [ -f ".env" ] && [ -d "venv" ]; then
    source venv/bin/activate
    python manage.py check --database default 2>/dev/null
    if [ $? -eq 0 ]; then
        check_status "Django puede conectar a la base de datos"
    else
        check_warning "Django no puede conectar a la base de datos - verifica .env"
    fi
    deactivate
fi

echo ""
echo "🎛️ Verificando servicios systemd..."
echo ""

# Verificar si el servicio existe
if [ -f "/etc/systemd/system/proximidad.service" ]; then
    check_status "Servicio proximidad.service instalado"
    
    systemctl is-enabled --quiet proximidad.service
    check_status "Servicio proximidad.service habilitado"
    
    systemctl is-active --quiet proximidad.service
    if [ $? -eq 0 ]; then
        check_status "Servicio proximidad.service está corriendo"
    else
        check_warning "Servicio proximidad.service no está corriendo"
    fi
else
    check_warning "Servicio proximidad.service no instalado - copia proximidad.service a /etc/systemd/system/"
fi

echo ""
echo "🌐 Verificando configuración de Nginx..."
echo ""

# Verificar configuración de Nginx
if [ -f "/etc/nginx/sites-available/proximidad" ]; then
    check_status "Configuración de Nginx instalada"
    
    [ -L "/etc/nginx/sites-enabled/proximidad" ] && check_status "Configuración de Nginx habilitada" || check_warning "Configuración de Nginx no está habilitada"
    
    nginx -t > /dev/null 2>&1
    check_status "Configuración de Nginx es válida"
else
    check_warning "Configuración de Nginx no encontrada"
fi

echo ""
echo "🧪 Verificando conectividad..."
echo ""

# Verificar si Gunicorn está escuchando
if netstat -tuln 2>/dev/null | grep -q ":8000"; then
    check_status "Gunicorn escuchando en puerto 8000"
else
    check_warning "Gunicorn no está escuchando en puerto 8000"
fi

# Verificar si Nginx está escuchando
if netstat -tuln 2>/dev/null | grep -q ":80"; then
    check_status "Nginx escuchando en puerto 80"
else
    check_warning "Nginx no está escuchando en puerto 80"
fi

echo ""
echo "================================"
echo "✨ Verificación completada!"
echo "================================"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Si faltan directorios, ejecuta: ./setup_media_permissions.sh"
echo "   2. Si falta .env, copia: cp .env.production .env (y edítalo)"
echo "   3. Ejecuta migraciones: python manage.py migrate"
echo "   4. Recolecta estáticos: python manage.py collectstatic"
echo "   5. Reinicia servicios: sudo systemctl restart proximidad nginx"
echo ""
