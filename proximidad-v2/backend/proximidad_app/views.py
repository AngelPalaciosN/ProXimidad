from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Servicios, Usuario, Favoritos, Categoria, Comentarios
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
        usuarios = Usuario.objects.all()
        
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
    """Añade un usuario a favoritos"""
    try:
        # Permitir favoritos sin autenticación por ahora
        # En producción, se debería requerir autenticación
        
        usuario_id = request.data.get('usuario_id')
        favorito_id = request.data.get('favorito_id')
        
        if not usuario_id or not favorito_id:
            return Response({'error': 'usuario_id y favorito_id son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que los usuarios existen
        if not Usuario.objects.filter(id=usuario_id).exists():
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Usuario.objects.filter(id=favorito_id).exists():
            return Response({'error': 'Usuario favorito no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Crear el favorito
        favorito_data = {
            'usuario_id': usuario_id,
            'favorito_id': favorito_id
        }
        
        serializer = FavoritosSerializer(data=favorito_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Favorito añadido exitosamente', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except IntegrityError:
        return Response({'error': 'Este usuario ya está en favoritos'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error al agregar favorito: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_favoritos(request, usuario_id):
    """Obtiene la lista de favoritos de un usuario"""
    try:
        # Verificar que el usuario existe
        if not Usuario.objects.filter(id=usuario_id).exists():
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener favoritos del usuario
        favoritos = Favoritos.objects.filter(usuario_id=usuario_id).select_related('favorito')
        
        # Serializar los datos
        favoritos_data = []
        for favorito in favoritos:
            favoritos_data.append({
                'id': favorito.id,
                'usuario_id': favorito.usuario_id,
                'favorito_id': favorito.favorito_id,
                'favorito_nombre': favorito.favorito.nombre_completo,
                'favorito_email': favorito.favorito.correo_electronico,
                'favorito_tipo': favorito.favorito.tipo_usuario,
                'favorito_imagen_url': favorito.favorito.imagen.url if favorito.favorito.imagen else None
            })
        
        return Response(favoritos_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener favoritos: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def eliminar_favorito(request, usuario_id, favorito_id):
    """Elimina un usuario de favoritos"""
    try:
        favorito = get_object_or_404(Favoritos, usuario_id=usuario_id, favorito_id=favorito_id)
        favorito.delete()
        return Response({'message': 'Favorito eliminado correctamente'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al eliminar favorito: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_usuario(request):
    """Crea un nuevo usuario con validaciones mejoradas"""
    try:
        # Validar que no exista un usuario con el mismo correo o cédula
        correo = request.data.get('correo_electronico')
        cedula = request.data.get('cedula')
        
        if Usuario.objects.filter(correo_electronico=correo).exists():
            return Response({'error': 'Ya existe un usuario con este correo electrónico'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if Usuario.objects.filter(cedula=cedula).exists():
            return Response({'error': 'Ya existe un usuario con esta cédula'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            # Generar código de verificación
            usuario.codigo_verificacion = random.randint(100000, 999999)
            usuario.save()
            
            # No devolver el código de verificación en la respuesta por seguridad
            response_data = UsuarioSerializer(usuario, context={'request': request}).data
            response_data.pop('codigo_verificacion', None)
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error al crear usuario: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        
        # En un entorno real, aquí enviarías el código por email
        # send_email_with_code(email, codigo)
        
        # Para desarrollo: mostrar código en consola
        print(f"\n{'='*60}")
        print(f"🔐 CÓDIGO DE VERIFICACIÓN GENERADO")
        print(f"📧 Usuario: {email}")
        print(f"� Código: {codigo}")
        print(f"⏰ Usa este código para iniciar sesión")
        print(f"{'='*60}\n")
        
        # También usar logger para que aparezca en los logs
        logger.info(f"Código de verificación generado para {email}: {codigo}")
        
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
    """Crea un nuevo servicio con imagen"""
    try:
        # Validar que el proveedor existe
        proveedor_id = request.data.get('proveedor')
        if proveedor_id and not Usuario.objects.filter(id=proveedor_id, tipo_usuario='proveedor').exists():
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validar que la categoría existe
        categoria_id = request.data.get('categoria')
        if categoria_id and not Categoria.objects.filter(categoria_id=categoria_id).exists():
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ServiciosSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            servicio = serializer.save()
            response_data = ServiciosSerializer(servicio, context={'request': request}).data
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error al crear servicio: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    """Actualiza un servicio existente"""
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
        
        serializer = ServiciosSerializer(servicio, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            servicio_actualizado = serializer.save()
            response_data = ServiciosSerializer(servicio_actualizado, context={'request': request}).data
            return Response({
                'message': 'Servicio actualizado exitosamente',
                'servicio': response_data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error al actualizar servicio: {str(e)}")
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
