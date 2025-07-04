from rest_framework import serializers
from .models import Servicios, Usuario, Favoritos, Categoria, Comentarios

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['categoria_id', 'nombre_categoria', 'descripcion_categoria']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre_completo', 'correo_electronico', 'telefono', 
            'direccion', 'cedula', 'tipo_usuario', 'imagen', 'codigo_verificacion'
        ]
        extra_kwargs = {
            'codigo_verificacion': {'write_only': True, 'required': False}
        }
    
    def validate_correo_electronico(self, value):
        """Validar formato de correo electrónico"""
        if Usuario.objects.filter(correo_electronico=value).exists():
            if not self.instance or self.instance.correo_electronico != value:
                raise serializers.ValidationError("Ya existe un usuario con este correo electrónico.")
        return value
    
    def validate_cedula(self, value):
        """Validar que la cédula sea única"""
        if Usuario.objects.filter(cedula=value).exists():
            if not self.instance or self.instance.cedula != value:
                raise serializers.ValidationError("Ya existe un usuario con esta cédula.")
        return value

class ServiciosSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_completo', read_only=True)
    
    class Meta:
        model = Servicios
        fields = [
            'id', 'nombre_servicio', 'descripcion', 'precio_base', 
            'imagen_url', 'categoria', 'categoria_nombre', 
            'proveedor', 'proveedor_nombre'
        ]

class ComentariosSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario_fk.nombre_completo', read_only=True)
    servicio_nombre = serializers.CharField(source='servicio_fk.nombre_servicio', read_only=True)
    
    class Meta:
        model = Comentarios
        fields = [
            'comentario_id', 'mensaje', 'servicio_fk', 'servicio_nombre',
            'usuario_fk', 'usuario_nombre'
        ]

class FavoritosSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario_id.nombre_completo', read_only=True)
    favorito_nombre = serializers.CharField(source='favorito_id.nombre_completo', read_only=True)
    
    class Meta:
        model = Favoritos
        fields = [
            'id', 'usuario_id', 'usuario_nombre',
            'favorito_id', 'favorito_nombre'
        ]

# Serializers para autenticación
class LoginSerializer(serializers.Serializer):
    correo_electronico = serializers.EmailField()
    codigo_verificacion = serializers.CharField(max_length=6, required=False)

class RegistroSerializer(serializers.ModelSerializer):
    """Serializer específico para el registro de usuarios"""
    
    class Meta:
        model = Usuario
        fields = [
            'nombre_completo', 'correo_electronico', 'telefono', 
            'direccion', 'cedula', 'tipo_usuario', 'imagen'
        ]
        extra_kwargs = {
            'correo_electronico': {'required': True},
            'cedula': {'required': True},
            'nombre_completo': {'required': True},
            'telefono': {'required': True},
            'direccion': {'required': True},
            'tipo_usuario': {'required': True}
        }
