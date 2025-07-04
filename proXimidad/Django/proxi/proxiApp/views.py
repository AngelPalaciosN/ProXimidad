from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
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
    """Lista todos los servicios con información del proveedor"""
    try:
        servicios = Servicios.objects.select_related('proveedor', 'categoria').all()
        serializer = ServiciosSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
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
            
        serializer = UsuarioSerializer(usuarios, many=True)
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
        serializer = FavoritosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        return Response({'error': 'Este usuario ya está en favoritos'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error al agregar favorito: {str(e)}")
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
            response_data = serializer.data
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
        
        return Response({'message': 'Código generado exitosamente'}, status=status.HTTP_200_OK)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error al generar código: {str(e)}")
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
        serializer = ServiciosSerializer(servicios, many=True)
        
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
        serializer = UsuarioSerializer(usuario)
        
        # Si es un proveedor, incluir sus servicios
        if usuario.tipo_usuario == 'proveedor':
            servicios = Servicios.objects.filter(proveedor=usuario)
            servicios_data = ServiciosSerializer(servicios, many=True).data
            
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
    """Autenticación básica por correo electrónico"""
    try:
        correo = request.data.get('correo_electronico')
        codigo = request.data.get('codigo_verificacion')
        
        if not correo:
            return Response({'error': 'El correo electrónico es requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario = Usuario.objects.get(correo_electronico=correo)
            
            # Si se proporciona código de verificación, validarlo
            if codigo and str(usuario.codigo_verificacion) == str(codigo):
                # No podemos actualizar el estado porque no existe ese campo
                pass
            
            serializer = UsuarioSerializer(usuario)
            return Response({
                'message': 'Login exitoso',
                'usuario': serializer.data
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
