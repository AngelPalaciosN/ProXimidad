from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Usuario
from .serializer import UsuarioSerializer
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@csrf_exempt
def register(request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['codigo_verificacion'] = random.randint(100000, 999999)
        usuario = serializer.create(validated_data)

        # Create a Django user
        user = User.objects.create_user(username=usuario.correo_electronico, email=usuario.correo_electronico, password=usuario.cedula)
        user.first_name = usuario.nombre_completo
        user.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('correo_electronico')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is not None:
        try:
            usuario = Usuario.objects.get(correo_electronico=email)
            return Response({
                'user': {
                    'id': usuario.id,
                    'nombre_completo': usuario.nombre_completo,
                    'correo_electronico': usuario.correo_electronico,
                    'tipo_usuario': usuario.tipo_usuario,
                    'imagen': usuario.imagen.url if usuario.imagen else None
                },
                'access_token': 'dummy_token'
            }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
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
            return Response({
                'user': {
                    'id': usuario.id,
                    'nombre_completo': usuario.nombre_completo,
                    'correo_electronico': usuario.correo_electronico,
                    'tipo_usuario': usuario.tipo_usuario,
                    'imagen': usuario.imagen.url if usuario.imagen else None  # Include image URL
                },
                'access_token': 'dummy_token'  # Replace with a real token
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Código de verificación inválido'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
