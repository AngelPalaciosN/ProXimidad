from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Usuario
import random
import json
from django.http import JsonResponse

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

@api_view(['POST'])
def register(request):
    # Generate a random password for the user
    password = str(random.randint(100000, 999999))
    print(f'Generated password for user: {password}')
    
    # Create a username from the email if not provided
    if 'username' not in request.data and 'correo_electronico' in request.data:
        username = request.data['correo_electronico'].split('@')[0]
    else:
        username = request.data.get('username', f'user_{random.randint(1000, 9999)}')
    
    # Prepare data for Django User model
    user_data = {
        'username': username,
        'email': request.data.get('correo_electronico', ''),
        'password': password
    }
    
    # Create Django User
    user_serializer = UserSerializer(data=user_data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        
        # Create Usuario record
        try:
            usuario = Usuario(
                nombre_completo=request.data.get('nombre_completo', ''),
                correo_electronico=request.data.get('correo_electronico', ''),
                telefono=request.data.get('telefono', ''),
                direccion=request.data.get('direccion', ''),
                cedula=request.data.get('cedula', ''),
                codigo_verificacion=random.randint(100000, 999999),
                tipo_usuario=request.data.get('tipo_usuario', 'proveedor')
            )
            usuario.save()
            
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'password': password,
                'usuario_id': usuario.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # If Usuario creation fails, delete the User
            user.delete()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    email = request.data.get('correo_electronico')
    password = request.data.get('password')
    
    # Try to find user by username or email
    if not username and email:
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    # Authenticate user
    user = authenticate(username=username, password=password)
    
    if user:
        # Get associated Usuario record
        try:
            usuario = Usuario.objects.get(correo_electronico=user.email)
            
            # Return user data and token (in a real app, use JWT or similar)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'usuario_id': usuario.id,
                    'nombre_completo': usuario.nombre_completo,
                    'tipo_usuario': usuario.tipo_usuario
                },
                'access_token': 'dummy_token'  # In a real app, generate a proper token
            }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'error': 'Perfil de usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def generar_codigo(request):
    email = request.data.get('correo_electronico')
    
    if not email:
        return Response({'error': 'Correo electrónico requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        usuario = Usuario.objects.get(correo_electronico=email)
        
        # Generate new verification code
        codigo = random.randint(100000, 999999)
        usuario.codigo_verificacion = codigo
        usuario.save()
        
        # In a real app, send email with code
        print(f"Código de verificación para {email}: {codigo}")
        
        return Response({'message': 'Código de verificación enviado'}, status=status.HTTP_200_OK)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def verificar_codigo(request):
    email = request.data.get('correo_electronico')
    codigo = request.data.get('codigo_verificacion')
    
    if not email or not codigo:
        return Response({'error': 'Correo y código requeridos'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        usuario = Usuario.objects.get(correo_electronico=email)
        
        if str(usuario.codigo_verificacion) == str(codigo):
            # Get associated Django user
            try:
                user = User.objects.get(email=email)
                
                return Response({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'usuario_id': usuario.id,
                        'nombre_completo': usuario.nombre_completo,
                        'tipo_usuario': usuario.tipo_usuario
                    },
                    'access_token': 'dummy_token'  # In a real app, generate a proper token
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Código de verificación inválido'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
