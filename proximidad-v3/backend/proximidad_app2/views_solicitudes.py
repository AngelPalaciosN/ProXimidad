"""
Views para gestionar solicitudes de servicios entre clientes y proveedores.
Incluye notificaciones por email en cada cambio de estado.
MIGRADO A proximidad_app2 - API de Solicitudes
"""
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Solicitud
from proximidad_app.models import Servicios, Usuario
from .serializers import (
    SolicitudSerializer, 
    SolicitudListSerializer, 
    SolicitudCreateSerializer
)
import logging

logger = logging.getLogger(__name__)


def enviar_email_notificacion(tipo, solicitud):
    """
    Envía emails de notificación según el tipo de evento.
    
    Tipos:
    - 'solicitud_creada': Al cliente y proveedor cuando se crea la solicitud
    - 'solicitud_aceptada': Al cliente cuando el proveedor acepta
    - 'solicitud_rechazada': Al cliente cuando el proveedor rechaza
    - 'solicitud_completada': Al cliente y proveedor cuando se marca como completada
    """
    try:
        cliente_email = solicitud.cliente.correo_electronico
        proveedor_email = solicitud.proveedor.correo_electronico
        servicio_nombre = solicitud.servicio.nombre_servicio
        
        if tipo == 'solicitud_creada':
            # Email al cliente
            send_mail(
                subject=f'✅ Solicitud Creada - {servicio_nombre}',
                message=f'''
Hola {solicitud.cliente.nombre_completo},

Tu solicitud del servicio "{servicio_nombre}" ha sido enviada exitosamente.

Detalles de tu solicitud:
- Servicio: {servicio_nombre}
- Proveedor: {solicitud.proveedor.nombre_completo}
- Urgencia: {solicitud.get_urgencia_display()}
- Fecha de solicitud: {solicitud.fecha_solicitud.strftime('%d/%m/%Y %H:%M')}

Descripción:
{solicitud.descripcion_personalizada}

El proveedor recibirá tu solicitud y te responderá pronto.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[cliente_email],
                fail_silently=False,
            )
            
            # Email al proveedor
            send_mail(
                subject=f'🔔 Nueva Solicitud - {servicio_nombre}',
                message=f'''
Hola {solicitud.proveedor.nombre_completo},

Has recibido una nueva solicitud para tu servicio "{servicio_nombre}".

Detalles de la solicitud:
- Cliente: {solicitud.cliente.nombre_completo}
- Teléfono: {solicitud.cliente.telefono}
- Email: {solicitud.cliente.correo_electronico}
- Urgencia: {solicitud.get_urgencia_display()}
- Presupuesto máximo: ${solicitud.presupuesto_maximo or 'No especificado'}
- Fecha preferida: {solicitud.fecha_preferida or 'Flexible'}

Descripción del proyecto:
{solicitud.descripcion_personalizada}

Comentarios adicionales:
{solicitud.comentarios_adicionales or 'Ninguno'}

Ingresa a tu panel de proveedor para aceptar o rechazar esta solicitud.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[proveedor_email],
                fail_silently=False,
            )
            
            solicitud.notificado_cliente = True
            solicitud.notificado_proveedor = True
            solicitud.save()
            
        elif tipo == 'solicitud_aceptada':
            send_mail(
                subject=f'🎉 Solicitud Aceptada - {servicio_nombre}',
                message=f'''
Hola {solicitud.cliente.nombre_completo},

¡Buenas noticias! {solicitud.proveedor.nombre_completo} ha aceptado tu solicitud para "{servicio_nombre}".

Respuesta del proveedor:
{solicitud.respuesta_proveedor or 'El proveedor aceptó tu solicitud y se pondrá en contacto contigo.'}

Precio acordado: ${solicitud.precio_acordado or solicitud.servicio.precio_base}

Contacto del proveedor:
- Teléfono: {solicitud.proveedor.telefono}
- Email: {solicitud.proveedor.correo_electronico}

El proveedor se pondrá en contacto contigo pronto para coordinar los detalles.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[cliente_email],
                fail_silently=False,
            )
            
        elif tipo == 'solicitud_rechazada':
            send_mail(
                subject=f'❌ Solicitud Rechazada - {servicio_nombre}',
                message=f'''
Hola {solicitud.cliente.nombre_completo},

Lamentamos informarte que {solicitud.proveedor.nombre_completo} no puede atender tu solicitud para "{servicio_nombre}" en este momento.

Razón:
{solicitud.respuesta_proveedor or 'El proveedor no puede atender tu solicitud actualmente.'}

Te recomendamos buscar otros proveedores de servicios similares en nuestra plataforma.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[cliente_email],
                fail_silently=False,
            )
            
        elif tipo == 'solicitud_completada':
            # Email al cliente
            send_mail(
                subject=f'✅ Servicio Completado - {servicio_nombre}',
                message=f'''
Hola {solicitud.cliente.nombre_completo},

El servicio "{servicio_nombre}" ha sido marcado como completado.

Proveedor: {solicitud.proveedor.nombre_completo}
Fecha de completado: {solicitud.fecha_completado.strftime('%d/%m/%Y')}

Por favor, ingresa a la plataforma para dejar tu comentario y calificación sobre el servicio recibido.

Tu opinión es muy valiosa y ayuda a otros usuarios a tomar mejores decisiones.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[cliente_email],
                fail_silently=False,
            )
            
            # Email al proveedor
            send_mail(
                subject=f'✅ Servicio Completado - {servicio_nombre}',
                message=f'''
Hola {solicitud.proveedor.nombre_completo},

El servicio "{servicio_nombre}" para {solicitud.cliente.nombre_completo} ha sido marcado como completado.

¡Felicitaciones por completar este trabajo!

El cliente podrá dejar su comentario y calificación pronto.

Saludos,
Equipo ProXimidad
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[proveedor_email],
                fail_silently=False,
            )
        
        logger.info(f"Email de tipo '{tipo}' enviado para solicitud #{solicitud.id}")
        return True
        
    except Exception as e:
        logger.error(f"Error al enviar email '{tipo}' para solicitud #{solicitud.id}: {str(e)}")
        return False


@api_view(['POST'])
def crear_solicitud(request):
    """
    Crea una nueva solicitud de servicio y envía notificaciones por email.
    
    Body esperado:
    {
        "servicio": 1,
        "cliente": 1,
        "descripcion_personalizada": "Necesito...",
        "urgencia": "media",
        "fecha_preferida": "2025-12-15",
        "presupuesto_maximo": 2000,
        "comentarios_adicionales": "..."
    }
    """
    try:
        # Log de datos recibidos para debugging
        logger.info(f"🔍 Recibiendo solicitud de creación con datos: {request.data}")
        
        # Validar campo servicio
        servicio_id = request.data.get('servicio')
        if not servicio_id:
            logger.error("❌ Campo 'servicio' faltante en la solicitud")
            return Response(
                {'servicio': ['El campo servicio es requerido']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar campo cliente
        cliente_id = request.data.get('cliente')
        if not cliente_id:
            logger.error("❌ Campo 'cliente' faltante en la solicitud")
            return Response(
                {'cliente': ['El campo cliente es requerido']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar campo descripción
        descripcion = request.data.get('descripcion_personalizada')
        if not descripcion or not descripcion.strip():
            logger.error("❌ Campo 'descripcion_personalizada' faltante o vacío")
            return Response(
                {'descripcion_personalizada': ['La descripción del proyecto es requerida']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el servicio existe
        try:
            servicio = Servicios.objects.get(id=servicio_id)
            logger.info(f"✅ Servicio encontrado: {servicio.nombre_servicio} (ID: {servicio_id})")
        except Servicios.DoesNotExist:
            logger.error(f"❌ Servicio con ID {servicio_id} no encontrado")
            return Response(
                {'servicio': [f'Servicio con ID {servicio_id} no existe']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el servicio tiene un proveedor
        if not servicio.proveedor:
            logger.error(f"❌ Servicio {servicio_id} no tiene proveedor asignado")
            return Response(
                {'servicio': ['Este servicio no tiene un proveedor asignado']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el cliente existe
        try:
            cliente = Usuario.objects.get(id=cliente_id)
            logger.info(f"✅ Cliente encontrado: {cliente.nombre_completo} (ID: {cliente_id})")
        except Usuario.DoesNotExist:
            logger.error(f"❌ Cliente con ID {cliente_id} no encontrado")
            return Response(
                {'cliente': [f'Cliente con ID {cliente_id} no existe']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Agregar el proveedor automáticamente
        data = request.data.copy()
        data['proveedor'] = servicio.proveedor.id
        
        logger.info(f"📝 Creando solicitud con proveedor auto-asignado: {servicio.proveedor.nombre_completo} (ID: {servicio.proveedor.id})")
        
        serializer = SolicitudCreateSerializer(data=data)
        
        if serializer.is_valid():
            solicitud = serializer.save()
            logger.info(f"✅ Solicitud creada exitosamente: ID {solicitud.id}")
            
            # Enviar emails de notificación
            try:
                enviar_email_notificacion('solicitud_creada', solicitud)
                logger.info(f"📧 Emails de notificación enviados para solicitud {solicitud.id}")
            except Exception as email_error:
                logger.warning(f"⚠️ Error al enviar emails (solicitud creada): {str(email_error)}")
                # No fallar la solicitud por error de email
            
            # Retornar la solicitud completa con toda la info
            response_serializer = SolicitudSerializer(solicitud, context={'request': request})
            
            return Response({
                'message': 'Solicitud creada exitosamente',
                'solicitud': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        logger.error(f"❌ Errores de validación: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"❌ Error inesperado al crear solicitud: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Error interno del servidor: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def listar_solicitudes_cliente(request, cliente_id):
    """
    Lista todas las solicitudes realizadas por un cliente específico.
    Filtros opcionales: ?estado=pendiente
    """
    try:
        estado_filter = request.GET.get('estado', None)
        
        solicitudes = Solicitud.objects.filter(cliente_id=cliente_id)
        
        if estado_filter:
            solicitudes = solicitudes.filter(estado=estado_filter)
        
        solicitudes = solicitudes.select_related(
            'servicio', 'cliente', 'proveedor'
        ).order_by('-fecha_solicitud')
        
        serializer = SolicitudSerializer(solicitudes, many=True, context={'request': request})
        
        return Response({
            'count': solicitudes.count(),
            'solicitudes': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al listar solicitudes del cliente {cliente_id}: {str(e)}")
        return Response(
            {'error': 'Error al obtener solicitudes'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def listar_solicitudes_proveedor(request, proveedor_id):
    """
    Lista todas las solicitudes recibidas por un proveedor específico.
    Filtros opcionales: ?estado=pendiente
    """
    try:
        estado_filter = request.GET.get('estado', None)
        
        solicitudes = Solicitud.objects.filter(proveedor_id=proveedor_id)
        
        if estado_filter:
            solicitudes = solicitudes.filter(estado=estado_filter)
        
        solicitudes = solicitudes.select_related(
            'servicio', 'cliente', 'proveedor'
        ).order_by('-fecha_solicitud')
        
        serializer = SolicitudSerializer(solicitudes, many=True, context={'request': request})
        
        return Response({
            'count': solicitudes.count(),
            'solicitudes': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al listar solicitudes del proveedor {proveedor_id}: {str(e)}")
        return Response(
            {'error': 'Error al obtener solicitudes'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def detalle_solicitud(request, solicitud_id):
    """Obtiene el detalle completo de una solicitud"""
    try:
        solicitud = get_object_or_404(
            Solicitud.objects.select_related('servicio', 'cliente', 'proveedor'),
            id=solicitud_id
        )
        
        serializer = SolicitudSerializer(solicitud, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener solicitud {solicitud_id}: {str(e)}")
        return Response(
            {'error': 'Error al obtener solicitud'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT', 'PATCH'])
def actualizar_estado_solicitud(request, solicitud_id):
    """
    Actualiza el estado de una solicitud (usado por proveedores).
    
    Body esperado:
    {
        "estado": "aceptado",
        "respuesta_proveedor": "Puedo realizar el trabajo...",
        "precio_acordado": 1500
    }
    """
    try:
        solicitud = get_object_or_404(Solicitud, id=solicitud_id)
        
        nuevo_estado = request.data.get('estado')
        respuesta = request.data.get('respuesta_proveedor', '')
        precio_acordado = request.data.get('precio_acordado')
        
        if not nuevo_estado:
            return Response(
                {'error': 'El campo estado es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado usando el método del modelo
        solicitud.cambiar_estado(nuevo_estado, respuesta)
        
        # Actualizar precio acordado si se proporciona
        if precio_acordado:
            solicitud.precio_acordado = precio_acordado
            solicitud.save()
        
        # Enviar email según el estado
        if nuevo_estado == 'aceptado':
            enviar_email_notificacion('solicitud_aceptada', solicitud)
        elif nuevo_estado == 'rechazado':
            enviar_email_notificacion('solicitud_rechazada', solicitud)
        elif nuevo_estado == 'completado':
            enviar_email_notificacion('solicitud_completada', solicitud)
        
        serializer = SolicitudSerializer(solicitud, context={'request': request})
        
        return Response({
            'message': f'Solicitud actualizada a estado: {nuevo_estado}',
            'solicitud': serializer.data
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error al actualizar solicitud {solicitud_id}: {str(e)}")
        return Response(
            {'error': f'Error al actualizar solicitud: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def cancelar_solicitud(request, solicitud_id):
    """
    Cancela una solicitud (solo cliente y solo si está pendiente)
    """
    try:
        solicitud = get_object_or_404(Solicitud, id=solicitud_id)
        
        # Verificar que esté pendiente
        if solicitud.estado != 'pendiente':
            return Response(
                {'error': 'Solo se pueden cancelar solicitudes pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar a cancelado
        solicitud.cambiar_estado('cancelado')
        
        return Response({
            'message': 'Solicitud cancelada exitosamente'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al cancelar solicitud {solicitud_id}: {str(e)}")
        return Response(
            {'error': 'Error al cancelar solicitud'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def estadisticas_solicitudes(request, usuario_id):
    """
    Obtiene estadísticas de solicitudes para un usuario (cliente o proveedor).
    Detecta automáticamente si es cliente o proveedor según el tipo_usuario.
    """
    try:
        usuario = get_object_or_404(Usuario, id=usuario_id)
        
        if usuario.tipo_usuario == 'proveedor':
            # Estadísticas como proveedor
            solicitudes = Solicitud.objects.filter(proveedor_id=usuario_id)
            
            stats = {
                'tipo': 'proveedor',
                'total': solicitudes.count(),
                'pendientes': solicitudes.filter(estado='pendiente').count(),
                'aceptadas': solicitudes.filter(estado='aceptado').count(),
                'en_proceso': solicitudes.filter(estado='en_proceso').count(),
                'completadas': solicitudes.filter(estado='completado').count(),
                'rechazadas': solicitudes.filter(estado='rechazado').count(),
            }
        else:
            # Estadísticas como cliente
            solicitudes = Solicitud.objects.filter(cliente_id=usuario_id)
            
            stats = {
                'tipo': 'cliente',
                'total': solicitudes.count(),
                'pendientes': solicitudes.filter(estado='pendiente').count(),
                'aceptadas': solicitudes.filter(estado='aceptado').count(),
                'en_proceso': solicitudes.filter(estado='en_proceso').count(),
                'completadas': solicitudes.filter(estado='completado').count(),
                'rechazadas': solicitudes.filter(estado='rechazado').count(),
                'canceladas': solicitudes.filter(estado='cancelado').count(),
            }
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error al obtener estadísticas para usuario {usuario_id}: {str(e)}")
        return Response(
            {'error': 'Error al obtener estadísticas'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
