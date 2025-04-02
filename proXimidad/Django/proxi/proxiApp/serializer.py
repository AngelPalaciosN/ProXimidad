from rest_framework import serializers
from .models import Servicios,Usuario,Favoritos

class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class FavoritosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favoritos
        fields = ['usuario', 'favorito']