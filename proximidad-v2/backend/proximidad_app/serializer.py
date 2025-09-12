from rest_framework import serializers
from .models import Servicios, Usuario, Favoritos, Categoria, Comentarios


class CategoriaSerializer(serializers.ModelSerializer):
    """Serializer optimizado para categorías"""
    servicios_count = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = [
            'categoria_id', 'nombre_categoria', 'descripcion_categoria',
            'icono', 'color', 'orden', 'activo', 'servicios_count'
        ]
        read_only_fields = ['categoria_id']

    def get_servicios_count(self, obj):
        """Cuenta los servicios activos de la categoría"""
        return obj.servicios.filter(activo=True).count()


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer optimizado para usuarios"""
    imagen_url = serializers.SerializerMethodField()
    servicios_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre_completo', 'correo_electronico', 'telefono', 
            'direccion', 'cedula', 'tipo_usuario', 'imagen', 'imagen_url',
            'fecha_registro', 'activo', 'servicios_count', 'codigo_verificacion'
        ]
        read_only_fields = ['id', 'fecha_registro', 'imagen_url', 'servicios_count']
        extra_kwargs = {
            'codigo_verificacion': {'write_only': True, 'required': False},
            'imagen': {'write_only': True}
        }
    
    def get_imagen_url(self, obj):
        """Devolver la URL completa de la imagen"""
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None

    def get_servicios_count(self, obj):
        """Cuenta los servicios activos del usuario"""
        return obj.servicios_ofrecidos.filter(activo=True).count()
    
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


class UsuarioBasicSerializer(serializers.ModelSerializer):
    """Serializer básico para usuarios (para referencias en otros modelos)"""
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'nombre_completo', 'imagen_url', 'tipo_usuario']

    def get_imagen_url(self, obj):
        """Obtiene la URL completa de la imagen"""
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None


class ServiciosSerializer(serializers.ModelSerializer):
    """Serializer optimizado para servicios"""
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_completo', read_only=True)
    imagen_url = serializers.SerializerMethodField()
    comentarios_count = serializers.SerializerMethodField()
    promedio_calificacion = serializers.SerializerMethodField()
    proveedor_info = UsuarioBasicSerializer(source='proveedor', read_only=True)
    categoria_info = CategoriaSerializer(source='categoria', read_only=True)
    
    class Meta:
        model = Servicios
        fields = [
            'id', 'nombre_servicio', 'descripcion', 'precio_base', 
            'imagen_url', 'imagen', 'activo', 'destacado', 'views',
            'ubicacion', 'categoria', 'categoria_nombre', 'categoria_info',
            'proveedor', 'proveedor_nombre', 'proveedor_info',
            'fecha_creacion', 'fecha_actualizacion',
            'comentarios_count', 'promedio_calificacion'
        ]
        read_only_fields = [
            'id', 'fecha_creacion', 'fecha_actualizacion', 'imagen_url',
            'proveedor_info', 'categoria_info', 'comentarios_count', 'promedio_calificacion'
        ]
        extra_kwargs = {
            'imagen': {'write_only': True}
        }
    
    def get_imagen_url(self, obj):
        """Devolver la URL completa de la imagen del servicio"""
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        elif obj.imagen_url:
            return obj.imagen_url
        return None

    def get_comentarios_count(self, obj):
        """Cuenta los comentarios activos del servicio"""
        return obj.comentarios.filter(activo=True).count()

    def get_promedio_calificacion(self, obj):
        """Calcula el promedio de calificaciones"""
        comentarios = obj.comentarios.filter(activo=True, calificacion__isnull=False)
        if comentarios.exists():
            from django.db.models import Avg
            promedio = comentarios.aggregate(Avg('calificacion'))['calificacion__avg']
            return round(promedio, 1) if promedio else None
        return None

    def validate_precio_base(self, value):
        """Valida que el precio sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value


class ServiciosListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados de servicios"""
    imagen_url = serializers.SerializerMethodField()
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_completo', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)

    class Meta:
        model = Servicios
        fields = [
            'id', 'nombre_servicio', 'precio_base', 'imagen_url',
            'activo', 'destacado', 'views', 'ubicacion',
            'proveedor_nombre', 'categoria_nombre', 'fecha_creacion'
        ]

    def get_imagen_url(self, obj):
        """Obtiene la URL completa de la imagen"""
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        elif obj.imagen_url:
            return obj.imagen_url
        return None


class ComentariosSerializer(serializers.ModelSerializer):
    """Serializer optimizado para comentarios"""
    usuario_nombre = serializers.CharField(source='usuario_fk.nombre_completo', read_only=True)
    servicio_nombre = serializers.CharField(source='servicio_fk.nombre_servicio', read_only=True)
    usuario_info = UsuarioBasicSerializer(source='usuario_fk', read_only=True)
    
    class Meta:
        model = Comentarios
        fields = [
            'comentario_id', 'mensaje', 'calificacion', 'servicio_fk', 'servicio_nombre',
            'usuario_fk', 'usuario_nombre', 'usuario_info', 'fecha_creacion', 'activo'
        ]
        read_only_fields = ['comentario_id', 'fecha_creacion', 'usuario_info']

    def validate_calificacion(self, value):
        """Valida que la calificación esté en el rango correcto"""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5")
        return value


class FavoritosSerializer(serializers.ModelSerializer):
    """Serializer optimizado para favoritos"""
    usuario_nombre = serializers.CharField(source='usuario_id.nombre_completo', read_only=True)
    favorito_nombre = serializers.CharField(source='favorito_id.nombre_completo', read_only=True)
    usuario_info = UsuarioBasicSerializer(source='usuario_id', read_only=True)
    favorito_info = UsuarioBasicSerializer(source='favorito_id', read_only=True)
    
    class Meta:
        model = Favoritos
        fields = [
            'id', 'usuario_id', 'usuario_nombre', 'usuario_info',
            'favorito_id', 'favorito_nombre', 'favorito_info', 'fecha_agregado'
        ]
        read_only_fields = ['id', 'fecha_agregado', 'usuario_info', 'favorito_info']

    def validate(self, data):
        """Valida que un usuario no se pueda agregar a sí mismo como favorito"""
        if data['usuario_id'] == data['favorito_id']:
            raise serializers.ValidationError("Un usuario no puede agregarse a sí mismo como favorito")
        return data


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
