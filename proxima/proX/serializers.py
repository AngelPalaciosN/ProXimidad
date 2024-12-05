from rest_framework import serializers
from .models import Usuario, Categoria, Servicio, Favorito

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  

    def validate_correo_electronico(self, value):
        if Usuario.objects.filter(correo_electronico=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está en uso.")
        return value

    def validate_cedula(self, value):
        if Usuario.objects.filter(cedula=value).exists():
            raise serializers.ValidationError("Esta cédula ya está registrada.")
        return value

    def validate_telefono(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("El número de teléfono debe tener al menos 10 caracteres.")
        return value

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    nombre_categoria = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    descripcion_categoria = serializers.CharField(source='categoria.descripcion_categoria', read_only=True)
    nombre_proveedor = serializers.CharField(source='proveedor.nombre_completo', read_only=True)

    class Meta:
        model = Servicio
        fields = '__all__'

class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = '__all__'
