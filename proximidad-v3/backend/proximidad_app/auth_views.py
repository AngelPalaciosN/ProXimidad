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
    from django.core.mail import send_mail
    from django.conf import settings
    import traceback
    
    print("\n" + "="*60)
    print("🔔 SOLICITUD DE CODIGO DE VERIFICACION")
    print("="*60)
    
    email = request.data.get('correo_electronico')
    print(f"📧 Email solicitado: {email}")

    if not email:
        print("❌ Error: No se proporcionó email")
        return Response({'error': 'Correo electrónico requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        usuario = Usuario.objects.get(correo_electronico=email)
        print(f"✅ Usuario encontrado: {usuario.nombre_completo} (ID: {usuario.id})")

        # Generate new verification code
        codigo = random.randint(100000, 999999)
        usuario.codigo_verificacion = codigo
        usuario.save()
        print(f"🔐 Código generado: {codigo}")

        # Enviar correo electrónico con el código
        try:
            print("\n📤 Intentando enviar correo...")
            print(f"   Host: {settings.EMAIL_HOST}")
            print(f"   Puerto: {settings.EMAIL_PORT}")
            print(f"   De: {settings.EMAIL_HOST_USER}")
            print(f"   Para: {email}")
            
            asunto = 'Tu codigo de verificacion - ProXimidad'
            mensaje = f'''
Hola {usuario.nombre_completo},

Tu codigo de verificacion es:

    {codigo}

Este codigo es valido por 10 minutos.

Si no solicitaste este codigo, ignora este mensaje.

---
Equipo de ProXimidad
proximidad.serveirc.com
            '''
            
            resultado = send_mail(
                asunto,
                mensaje,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            
            print(f"✅ Correo enviado exitosamente (resultado: {resultado})")
            print("="*60 + "\n")
            
            return Response({
                'message': 'Código de verificación enviado a tu correo electrónico'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"\n❌ ERROR AL ENVIAR CORREO:")
            print(f"   Tipo: {type(e).__name__}")
            print(f"   Mensaje: {str(e)}")
            print(f"\n📋 Traceback completo:")
            traceback.print_exc()
            print(f"\n📧 CODIGO DE RESPALDO: {codigo}")
            print("="*60 + "\n")
            
            return Response({
                'message': f'Error enviando correo: {str(e)}. Código: {codigo}',
                'codigo_respaldo': codigo
            }, status=status.HTTP_200_OK)
            
    except Usuario.DoesNotExist:
        print(f"❌ Error: Usuario no encontrado con email {email}")
        print("="*60 + "\n")
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
