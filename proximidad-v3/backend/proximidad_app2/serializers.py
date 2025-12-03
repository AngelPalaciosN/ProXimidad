"""
Serializers para proximidad_app2 - API de Solicitudes y Proveedores
"""

from rest_framework import serializers
from .models import Solicitud
from proximidad_app.models import Servicios, Usuario


class SolicitudSerializer(serializers.ModelSerializer):
    """Serializer completo con información de relaciones"""
    servicio_nombre = serializers.CharField(source='servicio.nombre_servicio', read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre_completo', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_completo', read_only=True)
    cliente_email = serializers.CharField(source='cliente.correo_electronico', read_only=True)
    proveedor_email = serializers.CharField(source='proveedor.correo_electronico', read_only=True)
    dias_pendiente = serializers.IntegerField(read_only=True)
    
    # Información adicional del servicio
    servicio_info = serializers.SerializerMethodField()
    cliente_info = serializers.SerializerMethodField()
    proveedor_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Solicitud
        fields = '__all__'
    
    def get_servicio_info(self, obj):
        if obj.servicio:
            return {
                'id': obj.servicio.id,
                'nombre': obj.servicio.nombre_servicio,
                'precio_base': float(obj.servicio.precio_base),
                'categoria': obj.servicio.categoria.nombre_categoria if obj.servicio.categoria else None
            }
        return None
    
    def get_cliente_info(self, obj):
        if obj.cliente:
            return {
                'id': obj.cliente.id,
                'nombre': obj.cliente.nombre_completo,
                'correo': obj.cliente.correo_electronico,
                'telefono': obj.cliente.telefono
            }
        return None
    
    def get_proveedor_info(self, obj):
        if obj.proveedor:
            return {
                'id': obj.proveedor.id,
                'nombre': obj.proveedor.nombre_completo,
                'correo': obj.proveedor.correo_electronico,
                'telefono': obj.proveedor.telefono
            }
        return None


class SolicitudListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    servicio_nombre = serializers.CharField(source='servicio.nombre_servicio', read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre_completo', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_completo', read_only=True)
    dias_pendiente = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Solicitud
        fields = [
            'id', 'servicio', 'servicio_nombre', 'cliente', 'cliente_nombre',
            'proveedor', 'proveedor_nombre', 'estado', 'urgencia',
            'precio_acordado', 'fecha_solicitud', 'fecha_actualizacion',
            'dias_pendiente', 'respuesta_proveedor'
        ]


class SolicitudCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear solicitudes"""
    
    class Meta:
        model = Solicitud
        fields = [
            'servicio', 'cliente', 'descripcion_personalizada',
            'urgencia', 'fecha_preferida', 'presupuesto_maximo',
            'comentarios_adicionales'
        ]
    
    def validate(self, data):
        """Validaciones personalizadas"""
        # Verificar que el servicio existe y está activo
        servicio = data.get('servicio')
        if servicio and not servicio.activo:
            raise serializers.ValidationError({
                'servicio': 'Este servicio no está disponible actualmente'
            })
        
        # Verificar que el cliente existe
        cliente = data.get('cliente')
        if cliente and not cliente.activo:
            raise serializers.ValidationError({
                'cliente': 'Usuario no activo'
            })
        
        return data
    
    def create(self, validated_data):
        """Auto-asignar proveedor del servicio"""
        servicio = validated_data.get('servicio')
        if servicio and servicio.proveedor:
            validated_data['proveedor'] = servicio.proveedor
        
        return super().create(validated_data)
