from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Servicios, Usuario, Favoritos, Categoria, Comentarios, ServicioImagenes
from .serializer import ServiciosSerializer, UsuarioSerializer, FavoritosSerializer, CategoriaSerializer, ComentariosSerializer
import random
from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['GET'])
def servicios_list(request):
    """Lista todos los servicios con información del proveedor y filtros"""
    try:
        # Obtener parámetros de filtro
        categoria_id = request.GET.get('categoria', None)
        proveedor_id = request.GET.get('proveedor', None)
        precio_min = request.GET.get('precio_min', None)
        precio_max = request.GET.get('precio_max', None)
        busqueda = request.GET.get('busqueda', None)
        activo = request.GET.get('activo', 'true').lower() == 'true'
        
        # Filtrar servicios
        servicios = Servicios.objects.select_related('proveedor', 'categoria').filter(activo=activo)
        
        if categoria_id:
            servicios = servicios.filter(categoria_id=categoria_id)
            
        if proveedor_id:
            servicios = servicios.filter(proveedor_id=proveedor_id)
            
        if precio_min:
            servicios = servicios.filter(precio_base__gte=precio_min)
            
        if precio_max:
            servicios = servicios.filter(precio_base__lte=precio_max)
            
        if busqueda:
            servicios = servicios.filter(
                Q(nombre_servicio__icontains=busqueda) |
                Q(descripcion__icontains=busqueda) |
                Q(proveedor__nombre_completo__icontains=busqueda)
            )
        
        # Ordenar por fecha de creación (más recientes primero)
        servicios = servicios.order_by('-fecha_creacion')
        
        serializer = ServiciosSerializer(servicios, many=True, context={'request': request})
        
        return Response({
            'count': servicios.count(),
            'servicios': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener servicios: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def usuarios_list(request):
    """Lista todos los usuarios con filtros opcionales"""
    try:
        tipo_usuario = request.GET.get('tipo_usuario', None)
        excluir_usuario = request.GET.get('excluir_usuario', None)  # ✅ Nuevo parámetro
        # ✅ MODIFICADO: Por defecto mostrar todos los usuarios (activos e inactivos)
        activo = request.GET.get('activo', None)
        
        usuarios = Usuario.objects.all()
        
        # ✅ VALIDACIÓN: Filtrar por activo solo si se especifica
        if activo is not None:
            activo_bool = activo.lower() == 'true'
            usuarios = usuarios.filter(activo=activo_bool)
        
        # ✅ VALIDACIÓN: Excluir usuario específico (para que no aparezca en su propia lista)
        if excluir_usuario:
            try:
                excluir_id = int(excluir_usuario)
                usuarios = usuarios.exclude(id=excluir_id)
                print(f"🔍 Excluyendo usuario ID: {excluir_id}")
            except (ValueError, TypeError):
                pass  # Si no es un ID válido, ignore el filtro
        
        if tipo_usuario:
            usuarios = usuarios.filter(tipo_usuario=tipo_usuario)
            
        serializer = UsuarioSerializer(usuarios, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al obtener usuarios: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def categorias_list(request):
    """Lista todas las categorías"""
    try:
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al obtener categorías: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def comentarios_list(request):
    """Lista todos los comentarios"""
    try:
        comentarios = Comentarios.objects.select_related('usuario_fk', 'servicio_fk').all()
        serializer = ComentariosSerializer(comentarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al obtener comentarios: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def agregar_favorito(request):
    """Añade un usuario o servicio a favoritos"""
    try:
        # Debug: Imprimir lo que recibe
        print(f"🔍 POST favoritos - request.data: {request.data}")
        print(f"🔍 POST favoritos - request.method: {request.method}")
        print(f"🔍 POST favoritos - content_type: {request.content_type}")
        
        usuario_id = request.data.get('usuario_id')
        favorito_id = request.data.get('favorito_id')
        tipo_favorito = request.data.get('tipo', 'usuario')  # Por defecto usuario
        
        if not usuario_id or not favorito_id:
            return Response({'error': 'usuario_id y favorito_id son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        if tipo_favorito not in ['usuario', 'servicio']:
            return Response({'error': 'tipo debe ser "usuario" o "servicio"'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el usuario existe
        if not Usuario.objects.filter(id=usuario_id).exists():
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar que el favorito existe según el tipo
        if tipo_favorito == 'usuario':
            if not Usuario.objects.filter(id=favorito_id).exists():
                return Response({'error': 'Usuario favorito no encontrado'}, status=status.HTTP_404_NOT_FOUND)
                
            # Verificar que no se marque a sí mismo
            if int(usuario_id) == int(favorito_id):
                return Response({'error': 'No puedes marcarte a ti mismo como favorito'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Verificar si ya existe
            if Favoritos.objects.filter(usuario_id=usuario_id, favorito_usuario=favorito_id, tipo_favorito='usuario').exists():
                return Response({'error': 'Este usuario ya está en favoritos'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Crear favorito de usuario
            usuario_obj = Usuario.objects.get(id=usuario_id)
            favorito_usuario_obj = Usuario.objects.get(id=favorito_id)
            
            favorito = Favoritos.objects.create(
                usuario_id=usuario_obj,
                favorito_usuario=favorito_usuario_obj,
                tipo_favorito='usuario'
            )
        else:
            if not Servicios.objects.filter(id=favorito_id).exists():
                return Response({'error': 'Servicio favorito no encontrado'}, status=status.HTTP_404_NOT_FOUND)
                
            # Verificar si ya existe
            if Favoritos.objects.filter(usuario_id=usuario_id, favorito_servicio=favorito_id, tipo_favorito='servicio').exists():
                return Response({'error': 'Este servicio ya está en favoritos'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Crear favorito de servicio
            usuario_obj = Usuario.objects.get(id=usuario_id)
            servicio_obj = Servicios.objects.get(id=favorito_id)
            
            favorito = Favoritos.objects.create(
                usuario_id=usuario_obj,
                favorito_servicio=servicio_obj,
                tipo_favorito='servicio'
            )
        
        return Response({
            'message': f'{tipo_favorito.capitalize()} añadido a favoritos exitosamente',
            'favorito_id': favorito.id,
            'tipo': tipo_favorito
        }, status=status.HTTP_201_CREATED)
        
    except IntegrityError:
        return Response({'error': 'Este usuario ya está en favoritos'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error al agregar favorito: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_favoritos(request, usuario_id):
    """Obtiene la lista de favoritos de un usuario (usuarios y servicios)"""
    try:
        # Verificar que el usuario existe
        if not Usuario.objects.filter(id=usuario_id).exists():
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener tipo de favoritos solicitado
        tipo_favorito = request.GET.get('tipo', 'usuario')  # Por defecto usuarios
        
        # Obtener favoritos del usuario según el tipo
        favoritos = Favoritos.objects.filter(
            usuario_id=usuario_id, 
            tipo_favorito=tipo_favorito
        ).select_related('favorito_usuario', 'favorito_servicio')
        
        # Serializar los datos y filtrar el usuario actual
        favoritos_data = []
        for favorito in favoritos:
            if favorito.tipo_favorito == 'usuario' and favorito.favorito_usuario:
                # ✅ VALIDACIÓN: No incluir el propio usuario en favoritos
                if favorito.favorito_usuario.id != int(usuario_id):
                    favoritos_data.append({
                        'id': favorito.id,
                        'tipo': 'usuario',
                        'usuario_id': favorito.usuario_id.id,
                        'favorito_id': favorito.favorito_usuario.id,
                        'favorito_nombre': favorito.favorito_usuario.nombre_completo,
                        'favorito_email': favorito.favorito_usuario.correo_electronico,
                        'favorito_tipo': favorito.favorito_usuario.tipo_usuario,
                        'favorito_imagen_url': favorito.favorito_usuario.imagen_url,
                        'fecha_agregado': favorito.fecha_agregado
                    })
            elif favorito.tipo_favorito == 'servicio' and favorito.favorito_servicio:
                favoritos_data.append({
                    'id': favorito.id,
                    'tipo': 'servicio',
                    'usuario_id': favorito.usuario_id.id,
                    'favorito_id': favorito.favorito_servicio.id,
                    'favorito_nombre': favorito.favorito_servicio.nombre_servicio,
                    'favorito_descripcion': favorito.favorito_servicio.descripcion,
                    'favorito_precio': str(favorito.favorito_servicio.precio_base),
                    'favorito_imagen_url': favorito.favorito_servicio.imagen.url if favorito.favorito_servicio.imagen else None,
                    'fecha_agregado': favorito.fecha_agregado
                })
        
        # Para compatibilidad con frontend existente, devolver solo array si no se especifica formato
        formato = request.GET.get('formato', 'simple')
        
        if formato == 'detallado':
            return Response({
                'tipo_favoritos': tipo_favorito,
                'total': len(favoritos_data),
                'favoritos': favoritos_data
            }, status=status.HTTP_200_OK)
        else:
            # Formato simple - solo el array (compatibilidad con frontend)
            return Response(favoritos_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener favoritos: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def eliminar_favorito(request, usuario_id, favorito_id):
    """Elimina un usuario o servicio de favoritos"""
    try:
        # Obtener tipo de favorito desde query params
        tipo_favorito = request.GET.get('tipo', 'usuario')
        
        if tipo_favorito not in ['usuario', 'servicio']:
            return Response({'error': 'tipo debe ser "usuario" o "servicio"'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar el favorito según el tipo
        if tipo_favorito == 'usuario':
            favorito = get_object_or_404(
                Favoritos, 
                usuario_id=usuario_id, 
                favorito_usuario=favorito_id,
                tipo_favorito='usuario'
            )
        else:
            favorito = get_object_or_404(
                Favoritos, 
                usuario_id=usuario_id, 
                favorito_servicio=favorito_id,
                tipo_favorito='servicio'
            )
        
        favorito.delete()
        return Response({
            'message': f'{tipo_favorito.capitalize()} eliminado de favoritos correctamente'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al eliminar favorito: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_usuario(request):
    """Crea un nuevo usuario con validaciones mejoradas"""
    print("\n" + "="*60)
    print("🆕 SOLICITUD DE REGISTRO DE USUARIO")
    print("="*60)
    
    try:
        # Validar que no exista un usuario con el mismo correo o cédula
        correo = request.data.get('correo_electronico')
        cedula = request.data.get('cedula')
        nombre = request.data.get('nombre_completo')
        tipo = request.data.get('tipo_usuario')
        
        print(f"📧 Email: {correo}")
        print(f"🆔 Cédula: {cedula}")
        print(f"👤 Nombre: {nombre}")
        print(f"🏷️ Tipo: {tipo}")
        
        # Verificar email existente
        email_exists = Usuario.objects.filter(correo_electronico=correo).exists()
        print(f"\n🔍 Verificando email existente: {email_exists}")
        
        if email_exists:
            usuarios_con_email = Usuario.objects.filter(correo_electronico=correo)
            print(f"❌ Email ya existe:")
            for u in usuarios_con_email:
                print(f"   - ID: {u.id}, Nombre: {u.nombre_completo}, Activo: {u.activo}")
            print("="*60 + "\n")
            return Response({'error': 'Ya existe un usuario con este correo electrónico'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar cédula existente
        cedula_exists = Usuario.objects.filter(cedula=cedula).exists()
        print(f"🔍 Verificando cédula existente: {cedula_exists}")
        
        if cedula_exists:
            usuarios_con_cedula = Usuario.objects.filter(cedula=cedula)
            print(f"❌ Cédula ya existe:")
            for u in usuarios_con_cedula:
                print(f"   - ID: {u.id}, Nombre: {u.nombre_completo}, Email: {u.correo_electronico}")
            print("="*60 + "\n")
            return Response({'error': 'Ya existe un usuario con esta cédula'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        print("\n✅ Email y cédula disponibles")
        print("💾 Creando usuario...")
        
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            print(f"✅ Usuario guardado en DB - ID: {usuario.id}")
            
            # Generar código de verificación
            usuario.codigo_verificacion = random.randint(100000, 999999)
            usuario.save()
            print(f"🔐 Código generado: {usuario.codigo_verificacion}")
            
            # Verificar que se guardó
            verificar = Usuario.objects.filter(id=usuario.id).exists()
            print(f"🔍 Verificación en DB: {verificar}")
            
            # No devolver el código de verificación en la respuesta por seguridad
            response_data = UsuarioSerializer(usuario, context={'request': request}).data
            response_data.pop('codigo_verificacion', None)
            
            print(f"✅ Usuario creado exitosamente - ID: {usuario.id}")
            print("="*60 + "\n")
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print(f"❌ Error de validación:")
            print(f"   {serializer.errors}")
            print("="*60 + "\n")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        import traceback
        print(f"\n❌ ERROR CRÍTICO:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        print(f"\n📋 Traceback:")
        traceback.print_exc()
        print("="*60 + "\n")
        logger.error(f"Error al crear usuario: {str(e)}")
        return Response({'error': f'Error interno del servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def generar_codigo(request):
    """Genera un código de verificación para un usuario"""
    try:
        email = request.data.get('correo_electronico')
        if not email:
            return Response({'error': 'Email es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        usuario = Usuario.objects.get(correo_electronico=email)
        codigo = random.randint(100000, 999999)
        usuario.codigo_verificacion = codigo
        usuario.save()
        
        # Para desarrollo: mostrar código en consola
        print(f"\n{'='*60}")
        print(f"🔐 CÓDIGO DE VERIFICACIÓN GENERADO")
        print(f"📧 Usuario: {email}")
        print(f"🔐 Código: {codigo}")
        print(f"⏰ Usa este código para iniciar sesión")
        print(f"{'='*60}\n")
        
        # También usar logger para que aparezca en los logs
        logger.info(f"Código de verificación generado para {email}: {codigo}")
        
        # Enviar correo electrónico con el código
        from django.core.mail import send_mail
        from django.conf import settings
        import traceback
        
        try:
            print("📤 Intentando enviar correo...")
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
            
        except Exception as e:
            print(f"\n❌ ERROR AL ENVIAR CORREO:")
            print(f"   Tipo: {type(e).__name__}")
            print(f"   Mensaje: {str(e)}")
            print(f"\n📋 Traceback completo:")
            traceback.print_exc()
            print(f"\n📧 CODIGO DE RESPALDO: {codigo}")
            print("="*60 + "\n")
        
        return Response({'message': 'Código de verificación enviado'}, status=status.HTTP_200_OK)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error al generar código: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verificar_codigo(request):
    """Verifica el código y hace login - EXACTO COMO EL BACKEND VIEJO"""
    try:
        email = request.data.get('correo_electronico')
        codigo = request.data.get('codigo_verificacion')

        if not email or not codigo:
            return Response({'error': 'Correo y código requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = Usuario.objects.get(correo_electronico=email)

        if str(usuario.codigo_verificacion) == str(codigo):
            # Generar respuesta exacta como el backend viejo
            serializer = UsuarioSerializer(usuario, context={'request': request})
            response_data = serializer.data
            # No exponer el código en la respuesta
            response_data.pop('codigo_verificacion', None)
            
            return Response({
                'user': {
                    'id': usuario.id,
                    'nombre_completo': usuario.nombre_completo,
                    'correo_electronico': usuario.correo_electronico,
                    'tipo_usuario': usuario.tipo_usuario,
                    'imagen': usuario.imagen.url if usuario.imagen else None
                },
                'usuario': response_data,  # Para compatibilidad adicional
                'access_token': 'dummy_token'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Código de verificación inválido'}, status=status.HTTP_401_UNAUTHORIZED)
            
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error en verificación de código: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def buscar_servicios(request):
    """Busca servicios por nombre, categoría o proveedor"""
    try:
        query = request.GET.get('q', '')
        categoria_id = request.GET.get('categoria', None)
        precio_min = request.GET.get('precio_min', None)
        precio_max = request.GET.get('precio_max', None)
        
        servicios = Servicios.objects.filter(activo=True)
        
        if query:
            servicios = servicios.filter(
                nombre_servicio__icontains=query
            ) | servicios.filter(
                descripcion__icontains=query
            ) | servicios.filter(
                proveedor__nombre_completo__icontains=query
            )
        
        if categoria_id:
            servicios = servicios.filter(categoria_id=categoria_id)
        
        if precio_min:
            servicios = servicios.filter(precio_base__gte=precio_min)
        
        if precio_max:
            servicios = servicios.filter(precio_base__lte=precio_max)
        
        servicios = servicios.select_related('proveedor', 'categoria')
        serializer = ServiciosSerializer(servicios, many=True, context={'request': request})
        
        return Response({
            'count': servicios.count(),
            'servicios': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error en búsqueda de servicios: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def usuario_detail(request, usuario_id):
    """Obtiene los detalles de un usuario específico"""
    try:
        usuario = get_object_or_404(Usuario, id=usuario_id)
        serializer = UsuarioSerializer(usuario, context={'request': request})
        
        # Si es un proveedor, incluir sus servicios
        if usuario.tipo_usuario == 'proveedor':
            servicios = Servicios.objects.filter(proveedor=usuario)
            servicios_data = ServiciosSerializer(servicios, many=True, context={'request': request}).data
            
            response_data = serializer.data
            response_data['servicios'] = servicios_data
            response_data['total_servicios'] = servicios.count()
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener detalles del usuario: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def actualizar_usuario(request, usuario_id):
    """Actualiza la información de un usuario"""
    try:
        usuario = get_object_or_404(Usuario, id=usuario_id)
        
        # Validar que no exista otro usuario con el mismo correo o cédula
        correo = request.data.get('correo_electronico', usuario.correo_electronico)
        cedula = request.data.get('cedula', usuario.cedula)
        
        if correo != usuario.correo_electronico and Usuario.objects.filter(correo_electronico=correo).exists():
            return Response({'error': 'Ya existe un usuario con este correo electrónico'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if cedula != usuario.cedula and Usuario.objects.filter(cedula=cedula).exists():
            return Response({'error': 'Ya existe un usuario con esta cédula'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Usuario actualizado exitosamente',
                'usuario': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error al actualizar usuario: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def login_usuario(request):
    """Autenticación que REQUIERE código de verificación OBLIGATORIO"""
    try:
        correo = request.data.get('correo_electronico')
        codigo = request.data.get('codigo_verificacion')
        
        if not correo:
            return Response({'error': 'El correo electrónico es requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if not codigo:
            return Response({'error': 'El código de verificación es requerido. Use /api/generar-codigo/ primero'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario = Usuario.objects.get(correo_electronico=correo)
            
            # VALIDACIÓN OBLIGATORIA DEL CÓDIGO
            if str(usuario.codigo_verificacion) != str(codigo):
                return Response({'error': 'Código de verificación inválido'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            # Limpiar el serializer para respuesta
            serializer = UsuarioSerializer(usuario, context={'request': request})
            response_data = serializer.data
            # No exponer el código de verificación
            response_data.pop('codigo_verificacion', None)
            
            return Response({
                'message': 'Login exitoso',
                'usuario': response_data,
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
            return Response({'error': 'Usuario no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def estadisticas_dashboard(request):
    """Obtiene estadísticas generales para el dashboard"""
    try:
        stats = {
            'total_usuarios': Usuario.objects.count(),
            'total_proveedores': Usuario.objects.filter(tipo_usuario='proveedor').count(),
            'total_arrendadores': Usuario.objects.filter(tipo_usuario='arrendador').count(),
            'total_servicios': Servicios.objects.count(),
            'total_categorias': Categoria.objects.count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener estadísticas: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def crear_comentario(request):
    """Crea un nuevo comentario"""
    try:
        serializer = ComentariosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error al crear comentario: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def crear_servicio(request):
    """Crea un nuevo servicio con múltiples imágenes (hasta 5)"""
    try:
        # Validar que el proveedor existe
        proveedor_id = request.data.get('proveedor')
        if proveedor_id and not Usuario.objects.filter(id=proveedor_id, tipo_usuario='proveedor').exists():
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validar que la categoría existe
        categoria_id = request.data.get('categoria')
        if categoria_id and not Categoria.objects.filter(categoria_id=categoria_id).exists():
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener las imágenes del request
        imagenes = request.FILES.getlist('imagenes')  # Array de archivos
        
        # Validar que haya al menos 1 imagen
        if not imagenes:
            return Response({'error': 'Debes subir al menos 1 imagen'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar que no excedan 5 imágenes
        if len(imagenes) > 5:
            return Response({'error': 'Solo puedes subir un máximo de 5 imágenes'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear el servicio (sin incluir 'imagenes' en el serializer)
        serializer = ServiciosSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            servicio = serializer.save()
            
            # Guardar las imágenes en ServicioImagenes
            for index, imagen_file in enumerate(imagenes):
                ServicioImagenes.objects.create(
                    servicio=servicio,
                    imagen=imagen_file,
                    orden=index + 1,
                    es_principal=(index == 0)  # La primera es principal
                )
            
            # Retornar el servicio con todas sus imágenes
            response_data = ServiciosSerializer(servicio, context={'request': request}).data
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error al crear servicio: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return Response({'error': f'Error interno del servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def servicio_detail(request, servicio_id):
    """Obtiene los detalles de un servicio específico"""
    try:
        servicio = get_object_or_404(Servicios, id=servicio_id, activo=True)
        serializer = ServiciosSerializer(servicio, context={'request': request})
        
        # Incluir comentarios del servicio
        comentarios = Comentarios.objects.filter(servicio_fk=servicio).select_related('usuario_fk')
        comentarios_data = ComentariosSerializer(comentarios, many=True).data
        
        response_data = serializer.data
        response_data['comentarios'] = comentarios_data
        response_data['total_comentarios'] = comentarios.count()
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener detalles del servicio: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def actualizar_servicio(request, servicio_id):
    """Actualiza un servicio existente con múltiples imágenes"""
    try:
        servicio = get_object_or_404(Servicios, id=servicio_id)
        
        # Validar que el proveedor existe si se está actualizando
        proveedor_id = request.data.get('proveedor', servicio.proveedor_id)
        if proveedor_id and not Usuario.objects.filter(id=proveedor_id, tipo_usuario='proveedor').exists():
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validar que la categoría existe si se está actualizando
        categoria_id = request.data.get('categoria', servicio.categoria_id)
        if categoria_id and not Categoria.objects.filter(categoria_id=categoria_id).exists():
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Actualizar datos básicos del servicio
        serializer = ServiciosSerializer(servicio, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            servicio_actualizado = serializer.save()
            
            # Manejar nuevas imágenes si se envían
            imagenes = request.FILES.getlist('imagenes')
            if imagenes:
                # Validar límite de 5 imágenes
                total_imagenes = servicio.imagenes.count() + len(imagenes)
                if total_imagenes > 5:
                    return Response({
                        'error': f'El servicio ya tiene {servicio.imagenes.count()} imágenes. Solo puedes agregar {5 - servicio.imagenes.count()} más.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Agregar nuevas imágenes
                ultimo_orden = servicio.imagenes.count()
                for index, imagen_file in enumerate(imagenes):
                    ServicioImagenes.objects.create(
                        servicio=servicio_actualizado,
                        imagen=imagen_file,
                        orden=ultimo_orden + index + 1,
                        es_principal=False  # Las nuevas no son principales
                    )
            
            response_data = ServiciosSerializer(servicio_actualizado, context={'request': request}).data
            return Response({
                'message': 'Servicio actualizado exitosamente',
                'servicio': response_data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error al actualizar servicio: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return Response({'error': f'Error interno del servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def eliminar_servicio(request, servicio_id):
    """Elimina (desactiva) un servicio"""
    try:
        servicio = get_object_or_404(Servicios, id=servicio_id)
        servicio.activo = False
        servicio.save()
        
        return Response({'message': 'Servicio eliminado exitosamente'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al eliminar servicio: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def mis_servicios(request):
    """Obtiene todos los servicios de un proveedor específico"""
    try:
        proveedor_id = request.GET.get('proveedor_id')
        
        if not proveedor_id:
            return Response({'error': 'proveedor_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el usuario existe y es proveedor
        proveedor = get_object_or_404(Usuario, id=proveedor_id, tipo_usuario='proveedor')
        
        # Obtener servicios del proveedor (activos e inactivos)
        servicios = Servicios.objects.filter(proveedor=proveedor).order_by('-fecha_creacion')
        
        serializer = ServiciosSerializer(servicios, many=True, context={'request': request})
        
        print(f"\n📦 SERVICIOS DEL PROVEEDOR {proveedor.nombre_completo}")
        print(f"   Total servicios: {servicios.count()}")
        print(f"   Activos: {servicios.filter(activo=True).count()}")
        print(f"   Inactivos: {servicios.filter(activo=False).count()}\n")
        
        return Response({
            'servicios': serializer.data,
            'total': servicios.count(),
            'activos': servicios.filter(activo=True).count()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener servicios del proveedor: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
