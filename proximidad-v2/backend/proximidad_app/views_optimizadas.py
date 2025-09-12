import random
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg, Count, Prefetch
from django.utils import timezone
from django.http import JsonResponse
from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Usuario, Servicios, Categoria, Comentarios, Favoritos
from .serializer import (
    UsuarioSerializer, ServiciosSerializer, CategoriaSerializer,
    ComentariosSerializer, FavoritosSerializer, ServiciosListSerializer,
    LoginSerializer, RegistroSerializer, UsuarioBasicSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    """Paginación estándar para todas las vistas"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ===== AUTENTICACIÓN =====
@api_view(['POST'])
@permission_classes([AllowAny])
def enviar_codigo_verificacion_v2(request):
    """Envía código de verificación por correo - Versión optimizada"""
    try:
        correo = request.data.get('correo_electronico')
        
        if not correo:
            return Response(
                {'error': 'El correo electrónico es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generar código aleatorio de 6 dígitos
        codigo = random.randint(100000, 999999)
        
        # Buscar o crear usuario temporal
        usuario, created = Usuario.objects.get_or_create(
            correo_electronico=correo,
            defaults={
                'codigo_verificacion': codigo,
                'nombre_completo': '',
                'telefono': '',
                'direccion': '',
                'cedula': '',
                'tipo_usuario': 'arrendador'
            }
        )
        
        if not created:
            usuario.codigo_verificacion = codigo
            usuario.save(update_fields=['codigo_verificacion'])
        
        # Aquí integrarías el servicio de email
        # Por ahora solo devolvemos el código para testing
        return Response({
            'message': 'Código enviado exitosamente',
            'codigo': codigo,  # Solo para desarrollo
            'usuario_existe': not created
        })
        
    except Exception as e:
        return Response(
            {'error': f'Error al enviar código: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_codigo_v2(request):
    """Verifica el código y permite login - Versión optimizada"""
    try:
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        correo = serializer.validated_data['correo_electronico']
        codigo = serializer.validated_data.get('codigo_verificacion')
        
        usuario = get_object_or_404(Usuario, correo_electronico=correo)
        
        if str(usuario.codigo_verificacion) == str(codigo):
            # Limpiar código después de verificación exitosa
            usuario.codigo_verificacion = 0
            usuario.save(update_fields=['codigo_verificacion'])
            
            user_data = UsuarioSerializer(usuario, context={'request': request}).data
            return Response({
                'message': 'Login exitoso',
                'usuario': user_data
            })
        else:
            return Response(
                {'error': 'Código de verificación inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': f'Error en verificación: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===== SERVICIOS OPTIMIZADOS =====
class ServiciosOptimizadosListView(generics.ListCreateAPIView):
    """Vista optimizada para listar servicios con filtros avanzados"""
    serializer_class = ServiciosListSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'proveedor', 'destacado', 'activo']
    search_fields = ['nombre_servicio', 'descripcion', 'ubicacion']
    ordering_fields = ['precio_base', 'fecha_creacion', 'views']
    ordering = ['-fecha_creacion']

    def get_queryset(self):
        """Optimización de consulta con select_related y prefetch_related"""
        return Servicios.objects.filter(activo=True).select_related(
            'categoria', 'proveedor'
        ).prefetch_related('comentarios').order_by('-fecha_creacion')


@api_view(['GET'])
@permission_classes([AllowAny])
def servicios_por_categoria_optimizado(request, categoria_id):
    """Obtiene servicios de una categoría específica con optimizaciones"""
    try:
        categoria = get_object_or_404(Categoria, categoria_id=categoria_id, activo=True)
        
        servicios = Servicios.objects.filter(
            categoria=categoria, activo=True
        ).select_related('proveedor').prefetch_related('comentarios')
        
        # Paginación
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(servicios, request)
        
        if page is not None:
            serializer = ServiciosListSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response({
                'categoria': CategoriaSerializer(categoria).data,
                'servicios': serializer.data
            })
        
        serializer = ServiciosListSerializer(servicios, many=True, context={'request': request})
        return Response({
            'categoria': CategoriaSerializer(categoria).data,
            'servicios': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': f'Error al obtener servicios: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def busqueda_avanzada_servicios(request):
    """Búsqueda avanzada con múltiples filtros"""
    try:
        # Parámetros de búsqueda
        query = request.GET.get('q', '')
        categoria_id = request.GET.get('categoria')
        precio_min = request.GET.get('precio_min')
        precio_max = request.GET.get('precio_max')
        ubicacion = request.GET.get('ubicacion')
        calificacion_min = request.GET.get('calificacion_min')
        solo_destacados = request.GET.get('destacados', '').lower() == 'true'
        
        # Query base optimizada
        servicios = Servicios.objects.filter(activo=True).select_related(
            'categoria', 'proveedor'
        ).prefetch_related('comentarios')
        
        # Aplicar filtros
        if query:
            servicios = servicios.filter(
                Q(nombre_servicio__icontains=query) |
                Q(descripcion__icontains=query) |
                Q(proveedor__nombre_completo__icontains=query) |
                Q(categoria__nombre_categoria__icontains=query)
            )
        
        if categoria_id:
            servicios = servicios.filter(categoria_id=categoria_id)
        
        if precio_min:
            servicios = servicios.filter(precio_base__gte=precio_min)
        
        if precio_max:
            servicios = servicios.filter(precio_base__lte=precio_max)
        
        if ubicacion:
            servicios = servicios.filter(ubicacion__icontains=ubicacion)
        
        if solo_destacados:
            servicios = servicios.filter(destacado=True)
        
        # Filtro por calificación (requiere subconsulta)
        if calificacion_min:
            servicios_con_calificacion = []
            for servicio in servicios:
                comentarios = servicio.comentarios.filter(activo=True, calificacion__isnull=False)
                if comentarios.exists():
                    promedio = comentarios.aggregate(Avg('calificacion'))['calificacion__avg']
                    if promedio and promedio >= float(calificacion_min):
                        servicios_con_calificacion.append(servicio.id)
            servicios = servicios.filter(id__in=servicios_con_calificacion)
        
        # Ordenamiento
        orden = request.GET.get('orden', 'fecha')
        if orden == 'precio_asc':
            servicios = servicios.order_by('precio_base')
        elif orden == 'precio_desc':
            servicios = servicios.order_by('-precio_base')
        elif orden == 'popularidad':
            servicios = servicios.order_by('-views')
        else:  # fecha por defecto
            servicios = servicios.order_by('-fecha_creacion')
        
        # Paginación
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(servicios, request)
        
        if page is not None:
            serializer = ServiciosListSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ServiciosListSerializer(servicios, many=True, context={'request': request})
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': f'Error en búsqueda: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===== ESTADÍSTICAS Y DASHBOARDS =====
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_estadisticas(request):
    """Dashboard completo con estadísticas del sistema"""
    try:
        # Estadísticas básicas
        stats = {
            'usuarios': {
                'total': Usuario.objects.filter(activo=True).count(),
                'proveedores': Usuario.objects.filter(activo=True, tipo_usuario='proveedor').count(),
                'arrendadores': Usuario.objects.filter(activo=True, tipo_usuario='arrendador').count(),
                'nuevos_mes': Usuario.objects.filter(
                    activo=True,
                    fecha_registro__gte=timezone.now().replace(day=1)
                ).count()
            },
            'servicios': {
                'total': Servicios.objects.filter(activo=True).count(),
                'destacados': Servicios.objects.filter(activo=True, destacado=True).count(),
                'nuevos_mes': Servicios.objects.filter(
                    activo=True,
                    fecha_creacion__gte=timezone.now().replace(day=1)
                ).count()
            },
            'categorias': {
                'total': Categoria.objects.filter(activo=True).count(),
                'con_servicios': Categoria.objects.filter(
                    activo=True, servicios__activo=True
                ).distinct().count()
            }
        }
        
        # Top categorías
        top_categorias = Categoria.objects.filter(activo=True).annotate(
            servicios_count=Count('servicios', filter=Q(servicios__activo=True))
        ).order_by('-servicios_count')[:5]
        
        stats['top_categorias'] = [
            {
                'nombre': cat.nombre_categoria,
                'servicios_count': cat.servicios_count,
                'icono': cat.icono,
                'color': cat.color
            }
            for cat in top_categorias
        ]
        
        # Servicios más populares
        servicios_populares = Servicios.objects.filter(activo=True).select_related(
            'categoria', 'proveedor'
        ).order_by('-views')[:5]
        
        stats['servicios_populares'] = ServiciosListSerializer(
            servicios_populares, many=True, context={'request': request}
        ).data
        
        # Promedio de calificaciones
        comentarios_activos = Comentarios.objects.filter(
            activo=True, calificacion__isnull=False
        )
        
        if comentarios_activos.exists():
            stats['calificaciones'] = {
                'promedio_general': round(
                    comentarios_activos.aggregate(Avg('calificacion'))['calificacion__avg'], 2
                ),
                'total_comentarios': comentarios_activos.count()
            }
        else:
            stats['calificaciones'] = {
                'promedio_general': 0,
                'total_comentarios': 0
            }
        
        return Response(stats)
        
    except Exception as e:
        return Response(
            {'error': f'Error al obtener estadísticas: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===== RECOMENDACIONES =====
@api_view(['GET'])
@permission_classes([AllowAny])
def servicios_recomendados(request, usuario_id=None):
    """Sistema de recomendaciones basado en favoritos y actividad"""
    try:
        servicios_recomendados = []
        
        if usuario_id:
            # Obtener categorías de servicios favoritos del usuario
            usuario = get_object_or_404(Usuario, id=usuario_id)
            
            # Categorías de favoritos
            categorias_favoritas = Categoria.objects.filter(
                servicios__in=Favoritos.objects.filter(
                    usuario_id=usuario
                ).values_list('favorito_id', flat=True)
            ).distinct()
            
            if categorias_favoritas.exists():
                # Recomendar servicios de categorías similares
                servicios_recomendados = Servicios.objects.filter(
                    activo=True,
                    categoria__in=categorias_favoritas
                ).exclude(
                    proveedor=usuario
                ).select_related('categoria', 'proveedor').order_by('-views')[:10]
        
        # Si no hay recomendaciones personalizadas, mostrar más populares
        if not servicios_recomendados:
            servicios_recomendados = Servicios.objects.filter(
                activo=True
            ).select_related('categoria', 'proveedor').order_by('-views')[:10]
        
        serializer = ServiciosListSerializer(
            servicios_recomendados, many=True, context={'request': request}
        )
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': f'Error al obtener recomendaciones: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===== HEALTH CHECK =====
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check_optimizado(request):
    """Health check con información del sistema"""
    try:
        from django.db import connection
        
        # Test de conexión a BD
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "ok"
        
        return Response({
            'status': 'ok',
            'timestamp': timezone.now(),
            'version': '2.0.0',
            'database': db_status,
            'total_servicios': Servicios.objects.filter(activo=True).count(),
            'total_usuarios': Usuario.objects.filter(activo=True).count()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'timestamp': timezone.now(),
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
