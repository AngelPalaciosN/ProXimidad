from rest_framework import serializers
from .models import Servicios,Usuario,Favoritos

class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Usuario
        fields = '__all__'

class FavoritosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favoritos
        fields = ['usuario', 'favorito']
