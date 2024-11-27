from rest_framework import serializers
from .models import Usuario
from django.core.exceptions import ValidationError

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

