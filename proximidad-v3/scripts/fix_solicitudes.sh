#!/bin/bash

# Script rápido para aplicar fix de solicitudes en Raspberry Pi
# Uso: bash fix_solicitudes.sh [IP] [USUARIO]

IP="${1:-192.168.1.100}"
USUARIO="${2:-proximidad}"
DESTINO="$USUARIO@$IP"

echo "🚀 Fix Solicitudes - Actualización Rápida"
echo "=========================================="
echo "Destino: $DESTINO"
echo ""

# Verificar conectividad
echo "🔍 Verificando conectividad..."
if ! ping -c 2 "$IP" &> /dev/null; then
    echo "❌ No se puede conectar con $IP"
    exit 1
fi
echo "✅ Conectividad OK"
echo ""

# Backup
echo "💾 Creando backup..."
ssh "$DESTINO" "mkdir -p ~/backups && tar -czf ~/backups/backup_\$(date +%Y%m%d_%H%M%S).tar.gz ~/backend/proximidad_app2/views_solicitudes.py ~/frontend/src/components/modules/ServiceRequestModal.jsx 2>/dev/null || echo 'OK'"
echo ""

# Transferir archivos
echo "📤 Transfiriendo archivos..."
scp ../backend/proximidad_app2/views_solicitudes.py "$DESTINO:~/backend/proximidad_app2/"
scp ../frontend/src/components/modules/ServiceRequestModal.jsx "$DESTINO:~/frontend/src/components/modules/"
echo "✅ Archivos transferidos"
echo ""

# Compilar y reiniciar
echo "🔨 Compilando frontend..."
ssh "$DESTINO" "cd ~/frontend && npm run build"
echo ""

echo "🔄 Reiniciando servicios..."
ssh "$DESTINO" "sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx"
echo ""

echo "=========================================="
echo "✅ Actualización completada!"
echo ""
echo "Verifica con:"
echo "  ssh $DESTINO 'sudo journalctl -u proximidad_app2.service -f'"
echo ""
