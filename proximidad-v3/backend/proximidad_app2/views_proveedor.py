"""
API específica para proveedores de servicios.
Esta API maneja todas las operaciones relacionadas con el panel del proveedor,
manteniendo una separación clara con las APIs de clientes.
MIGRADO A proximidad_app2 - API de Proveedores

Endpoints disponibles:
- GET /api/proveedor/mis-servicios/ - Lista de servicios del proveedor
- GET /api/proveedor/solicitudes/ - Solicitudes recibidas
- PUT /api/proveedor/solicitudes/<id>/responder/ - Responder solicitud
- GET /api/proveedor/estadisticas/ - Estadísticas del proveedor
- GET /api/proveedor/calificacion/ - Calificación promedio del proveedor
"""

from django.db.models import Avg, Count, Q, F
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Solicitud
from proximidad_app.models import Servicios, Comentarios, Usuario
from proximidad_app.serializer import ServiciosSerializer
from .serializers import (
    SolicitudSerializer,
    SolicitudListSerializer
)
from datetime import datetime, timedelta
from django.utils import timezone


def buildApiUrl(path):
    """Helper para construir URLs de API consistentes"""
    return f"/api/proveedor{path}"


@api_view(['GET'])
def mis_servicios(request):
    """
    Obtiene todos los servicios del proveedor autenticado.
    
    Query params:
    - proveedor_id: ID del proveedor (requerido)
    - activo: Filtrar por estado (true/false)
    - destacado: Filtrar destacados (true/false)
    - ordenar_por: views | fecha_creacion | precio_base (default: -fecha_creacion)
    """
    proveedor_id = request.GET.get('proveedor_id')
    
    if not proveedor_id:
        return Response({
            'error': 'proveedor_id es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verificar que el proveedor existe
        proveedor = Usuario.objects.get(id=proveedor_id, tipo_usuario='proveedor')
    except Usuario.DoesNotExist:
        return Response({
            'error': 'Proveedor no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Construir query
    servicios = Servicios.objects.filter(proveedor_id=proveedor_id)
    
    # Filtros opcionales
    if request.GET.get('activo'):
        activo = request.GET.get('activo').lower() == 'true'
        servicios = servicios.filter(activo=activo)
    
    if request.GET.get('destacado'):
        destacado = request.GET.get('destacado').lower() == 'true'
        servicios = servicios.filter(destacado=destacado)
    
    # Ordenamiento
    ordenar = request.GET.get('ordenar_por', '-fecha_creacion')
    servicios = servicios.order_by(ordenar)
    
    # Agregar estadísticas por servicio
    servicios_con_stats = []
    for servicio in servicios:
        servicio_data = ServiciosSerializer(servicio).data
        
        # Agregar estadísticas adicionales
        servicio_data['total_solicitudes'] = Solicitud.objects.filter(
            servicio=servicio
        ).count()
        
        servicio_data['solicitudes_completadas'] = Solicitud.objects.filter(
            servicio=servicio,
            estado='completado'
        ).count()
        
        servicio_data['solicitudes_en_proceso'] = Solicitud.objects.filter(
            servicio=servicio,
            estado='en_proceso'
        ).count()
        
        # Calificación promedio del servicio
        calificacion_data = Comentarios.objects.filter(
            servicio_fk=servicio,
            activo=True,
            calificacion__isnull=False
        ).aggregate(
            promedio=Avg('calificacion'),
            total=Count('comentario_id')
        )
        
        servicio_data['calificacion_promedio'] = round(calificacion_data['promedio'], 1) if calificacion_data['promedio'] else 0
        servicio_data['total_calificaciones'] = calificacion_data['total']
        
        servicios_con_stats.append(servicio_data)
    
    return Response({
        'success': True,
        'total': len(servicios_con_stats),
        'servicios': servicios_con_stats,
        'proveedor': {
            'id': proveedor.id,
            'nombre': proveedor.nombre_completo,
            'correo': proveedor.correo_electronico
        }
    })


@api_view(['GET'])
def solicitudes_recibidas(request):
    """
    Obtiene todas las solicitudes recibidas por el proveedor.
    
    Query params:
    - proveedor_id: ID del proveedor (requerido)
    - estado: Filtrar por estado (pendiente, aceptado, en_proceso, completado, rechazado, cancelado)
    - urgencia: Filtrar por urgencia (baja, media, alta, urgente)
    - fecha_desde: Filtrar desde fecha (YYYY-MM-DD)
    - fecha_hasta: Filtrar hasta fecha (YYYY-MM-DD)
    """
    proveedor_id = request.GET.get('proveedor_id')
    
    if not proveedor_id:
        return Response({
            'error': 'proveedor_id es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        proveedor = Usuario.objects.get(id=proveedor_id, tipo_usuario='proveedor')
    except Usuario.DoesNotExist:
        return Response({
            'error': 'Proveedor no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Query base
    solicitudes = Solicitud.objects.filter(proveedor_id=proveedor_id)
    
    # Filtros opcionales
    if request.GET.get('estado'):
        solicitudes = solicitudes.filter(estado=request.GET.get('estado'))
    
    if request.GET.get('urgencia'):
        solicitudes = solicitudes.filter(urgencia=request.GET.get('urgencia'))
    
    if request.GET.get('fecha_desde'):
        fecha_desde = datetime.strptime(request.GET.get('fecha_desde'), '%Y-%m-%d')
        solicitudes = solicitudes.filter(fecha_solicitud__gte=fecha_desde)
    
    if request.GET.get('fecha_hasta'):
        fecha_hasta = datetime.strptime(request.GET.get('fecha_hasta'), '%Y-%m-%d')
        solicitudes = solicitudes.filter(fecha_solicitud__lte=fecha_hasta)
    
    # Ordenar por fecha más reciente primero
    solicitudes = solicitudes.order_by('-fecha_solicitud')
    
    # Serializar
    serializer = SolicitudListSerializer(solicitudes, many=True)
    
    # Estadísticas rápidas
    stats = {
        'total': solicitudes.count(),
        'pendientes': solicitudes.filter(estado='pendiente').count(),
        'aceptadas': solicitudes.filter(estado='aceptado').count(),
        'en_proceso': solicitudes.filter(estado='en_proceso').count(),
        'completadas': solicitudes.filter(estado='completado').count(),
        'rechazadas': solicitudes.filter(estado='rechazado').count(),
    }
    
    return Response({
        'success': True,
        'solicitudes': serializer.data,
        'estadisticas': stats,
        'proveedor': {
            'id': proveedor.id,
            'nombre': proveedor.nombre_completo
        }
    })


@api_view(['PUT', 'PATCH'])
def responder_solicitud(request, solicitud_id):
    """
    Permite al proveedor responder a una solicitud (aceptar/rechazar/actualizar estado).
    
    Body params:
    - estado: Nuevo estado (aceptado, rechazado, en_proceso, completado)
    - respuesta_proveedor: Mensaje de respuesta del proveedor (opcional)
    - precio_acordado: Precio final acordado (opcional)
    """
    try:
        solicitud = Solicitud.objects.get(id=solicitud_id)
    except Solicitud.DoesNotExist:
        return Response({
            'error': 'Solicitud no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Validar que el usuario sea el proveedor de esta solicitud
    proveedor_id = request.data.get('proveedor_id')
    if str(solicitud.proveedor_id) != str(proveedor_id):
        return Response({
            'error': 'No tienes permiso para responder esta solicitud'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Obtener datos
    nuevo_estado = request.data.get('estado')
    respuesta = request.data.get('respuesta_proveedor', '')
    precio = request.data.get('precio_acordado')
    
    if not nuevo_estado:
        return Response({
            'error': 'El campo estado es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar transiciones de estado
    estado_actual = solicitud.estado
    transiciones_validas = {
        'pendiente': ['aceptado', 'rechazado'],
        'aceptado': ['en_proceso', 'rechazado'],
        'en_proceso': ['completado'],
        'completado': [],  # No se puede cambiar
        'rechazado': [],    # No se puede cambiar
        'cancelado': []     # No se puede cambiar
    }
    
    if nuevo_estado not in transiciones_validas.get(estado_actual, []):
        return Response({
            'error': f'No se puede cambiar de {estado_actual} a {nuevo_estado}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar solicitud usando el método del modelo
    try:
        solicitud.cambiar_estado(nuevo_estado, respuesta)
        
        if respuesta:
            solicitud.respuesta_proveedor = respuesta
        
        if precio:
            solicitud.precio_acordado = precio
        
        solicitud.save()
        
        # Enviar email de notificación
        from .views_solicitudes import enviar_email_notificacion
        
        if nuevo_estado == 'aceptado':
            enviar_email_notificacion('aceptada', solicitud)
        elif nuevo_estado == 'rechazado':
            enviar_email_notificacion('rechazada', solicitud)
        elif nuevo_estado == 'completado':
            enviar_email_notificacion('completada', solicitud)
        
        return Response({
            'success': True,
            'mensaje': 'Solicitud actualizada correctamente',
            'solicitud': SolicitudSerializer(solicitud).data
        })
        
    except Exception as e:
        return Response({
            'error': f'Error al actualizar solicitud: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def estadisticas_proveedor(request):
    """
    Obtiene estadísticas generales del proveedor.
    
    Query params:
    - proveedor_id: ID del proveedor (requerido)
    - periodo: ultimos_7_dias | ultimos_30_dias | ultimo_mes | todo (default: todo)
    """
    proveedor_id = request.GET.get('proveedor_id')
    
    if not proveedor_id:
        return Response({
            'error': 'proveedor_id es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        proveedor = Usuario.objects.get(id=proveedor_id, tipo_usuario='proveedor')
    except Usuario.DoesNotExist:
        return Response({
            'error': 'Proveedor no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Filtro de fecha según periodo
    periodo = request.GET.get('periodo', 'todo')
    fecha_desde = None
    
    if periodo == 'ultimos_7_dias':
        fecha_desde = timezone.now() - timedelta(days=7)
    elif periodo == 'ultimos_30_dias':
        fecha_desde = timezone.now() - timedelta(days=30)
    elif periodo == 'ultimo_mes':
        fecha_desde = timezone.now().replace(day=1)
    
    # Estadísticas de servicios
    servicios_query = Servicios.objects.filter(proveedor_id=proveedor_id)
    if fecha_desde:
        servicios_query_periodo = servicios_query.filter(fecha_creacion__gte=fecha_desde)
    else:
        servicios_query_periodo = servicios_query
    
    servicios_stats = {
        'total_servicios': servicios_query.count(),
        'servicios_activos': servicios_query.filter(activo=True).count(),
        'servicios_destacados': servicios_query.filter(destacado=True).count(),
        'servicios_creados_periodo': servicios_query_periodo.count(),
        'total_views': servicios_query.aggregate(total=Count('views'))['total'] or 0
    }
    
    # Estadísticas de solicitudes
    solicitudes_query = Solicitud.objects.filter(proveedor_id=proveedor_id)
    if fecha_desde:
        solicitudes_query_periodo = solicitudes_query.filter(fecha_solicitud__gte=fecha_desde)
    else:
        solicitudes_query_periodo = solicitudes_query
    
    solicitudes_stats = {
        'total_solicitudes': solicitudes_query.count(),
        'solicitudes_periodo': solicitudes_query_periodo.count(),
        'pendientes': solicitudes_query.filter(estado='pendiente').count(),
        'aceptadas': solicitudes_query.filter(estado='aceptado').count(),
        'en_proceso': solicitudes_query.filter(estado='en_proceso').count(),
        'completadas': solicitudes_query.filter(estado='completado').count(),
        'rechazadas': solicitudes_query.filter(estado='rechazado').count(),
        'tasa_aceptacion': 0,
        'tasa_completado': 0
    }
    
    # Calcular tasas
    total_respondidas = solicitudes_stats['aceptadas'] + solicitudes_stats['rechazadas']
    if total_respondidas > 0:
        solicitudes_stats['tasa_aceptacion'] = round(
            (solicitudes_stats['aceptadas'] / total_respondidas) * 100, 1
        )
    
    if solicitudes_stats['aceptadas'] > 0:
        solicitudes_stats['tasa_completado'] = round(
            (solicitudes_stats['completadas'] / solicitudes_stats['aceptadas']) * 100, 1
        )
    
    # Estadísticas de calificaciones
    calificaciones_query = Comentarios.objects.filter(
        servicio_fk__proveedor_id=proveedor_id,
        activo=True,
        calificacion__isnull=False
    )
    
    calificaciones_data = calificaciones_query.aggregate(
        promedio=Avg('calificacion'),
        total=Count('comentario_id')
    )
    
    # Distribución de calificaciones
    distribucion = {
        '5_estrellas': calificaciones_query.filter(calificacion=5).count(),
        '4_estrellas': calificaciones_query.filter(calificacion=4).count(),
        '3_estrellas': calificaciones_query.filter(calificacion=3).count(),
        '2_estrellas': calificaciones_query.filter(calificacion=2).count(),
        '1_estrella': calificaciones_query.filter(calificacion=1).count(),
    }
    
    calificaciones_stats = {
        'calificacion_promedio': round(calificaciones_data['promedio'], 2) if calificaciones_data['promedio'] else 0,
        'total_calificaciones': calificaciones_data['total'],
        'distribucion': distribucion
    }
    
    # Ingresos estimados (basado en solicitudes completadas)
    ingresos_query = solicitudes_query.filter(
        estado='completado',
        precio_acordado__isnull=False
    )
    if fecha_desde:
        ingresos_query = ingresos_query.filter(fecha_completado__gte=fecha_desde)
    
    ingresos_stats = {
        'total_completadas': ingresos_query.count(),
        'ingresos_estimados': sum([s.precio_acordado for s in ingresos_query if s.precio_acordado]) or 0
    }
    
    return Response({
        'success': True,
        'periodo': periodo,
        'proveedor': {
            'id': proveedor.id,
            'nombre': proveedor.nombre_completo,
            'correo': proveedor.correo_electronico,
            'fecha_registro': proveedor.fecha_registro
        },
        'servicios': servicios_stats,
        'solicitudes': solicitudes_stats,
        'calificaciones': calificaciones_stats,
        'ingresos': ingresos_stats
    })


@api_view(['GET'])
def calificacion_promedio(request):
    """
    Obtiene la calificación promedio del proveedor basada en todos sus servicios.
    
    Query params:
    - proveedor_id: ID del proveedor (requerido)
    """
    proveedor_id = request.GET.get('proveedor_id')
    
    if not proveedor_id:
        return Response({
            'error': 'proveedor_id es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        proveedor = Usuario.objects.get(id=proveedor_id, tipo_usuario='proveedor')
    except Usuario.DoesNotExist:
        return Response({
            'error': 'Proveedor no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Obtener calificaciones de todos los servicios del proveedor
    calificaciones = Comentarios.objects.filter(
        servicio_fk__proveedor_id=proveedor_id,
        activo=True,
        calificacion__isnull=False
    )
    
    # Calcular promedio y distribución
    stats = calificaciones.aggregate(
        promedio=Avg('calificacion'),
        total=Count('comentario_id')
    )
    
    # Distribución por estrellas
    distribucion = []
    for i in range(5, 0, -1):
        cantidad = calificaciones.filter(calificacion=i).count()
        porcentaje = (cantidad / stats['total'] * 100) if stats['total'] > 0 else 0
        distribucion.append({
            'estrellas': i,
            'cantidad': cantidad,
            'porcentaje': round(porcentaje, 1)
        })
    
    # Comentarios recientes (últimos 5)
    comentarios_recientes = calificaciones.order_by('-fecha_creacion')[:5]
    comentarios_data = []
    
    for com in comentarios_recientes:
        comentarios_data.append({
            'usuario': com.usuario_fk.nombre_completo,
            'servicio': com.servicio_fk.nombre_servicio,
            'calificacion': com.calificacion,
            'mensaje': com.mensaje,
            'fecha': com.fecha_creacion.strftime('%Y-%m-%d')
        })
    
    return Response({
        'success': True,
        'calificacion_promedio': round(stats['promedio'], 2) if stats['promedio'] else 0,
        'total_calificaciones': stats['total'],
        'distribucion': distribucion,
        'comentarios_recientes': comentarios_data,
        'proveedor': {
            'id': proveedor.id,
            'nombre': proveedor.nombre_completo
        }
    })


@api_view(['GET'])
def dashboard_resumen(request):
    """
    Endpoint todo-en-uno para el dashboard del proveedor.
    Devuelve todas las estadísticas principales en una sola llamada.
    
    Query params:
    - proveedor_id: ID del proveedor (requerido)
    """
    proveedor_id = request.GET.get('proveedor_id')
    
    if not proveedor_id:
        return Response({
            'error': 'proveedor_id es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        proveedor = Usuario.objects.get(id=proveedor_id, tipo_usuario='proveedor')
    except Usuario.DoesNotExist:
        return Response({
            'error': 'Proveedor no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Resumen de servicios
    servicios = Servicios.objects.filter(proveedor_id=proveedor_id)
    total_servicios = servicios.count()
    servicios_activos = servicios.filter(activo=True).count()
    
    # Resumen de solicitudes
    solicitudes = Solicitud.objects.filter(proveedor_id=proveedor_id)
    solicitudes_pendientes = solicitudes.filter(estado='pendiente').count()
    solicitudes_en_proceso = solicitudes.filter(estado='en_proceso').count()
    solicitudes_completadas = solicitudes.filter(estado='completado').count()
    
    # Calificación promedio
    calificaciones = Comentarios.objects.filter(
        servicio_fk__proveedor_id=proveedor_id,
        activo=True,
        calificacion__isnull=False
    )
    
    calificacion_data = calificaciones.aggregate(
        promedio=Avg('calificacion'),
        total=Count('comentario_id')
    )
    
    calificacion_promedio = round(calificacion_data['promedio'], 1) if calificacion_data['promedio'] else 0
    total_calificaciones = calificacion_data['total']
    
    return Response({
        'success': True,
        'proveedor': {
            'id': proveedor.id,
            'nombre': proveedor.nombre_completo,
            'correo': proveedor.correo_electronico,
            'tipo': proveedor.tipo_usuario
        },
        'resumen': {
            'servicios_creados': total_servicios,
            'servicios_activos': servicios_activos,
            'solicitudes_pendientes': solicitudes_pendientes,
            'solicitudes_en_proceso': solicitudes_en_proceso,
            'servicios_exitosos': solicitudes_completadas,  # Compatible con prop del componente
            'calificacion_general': calificacion_promedio,
            'total_calificaciones': total_calificaciones
        }
    })
