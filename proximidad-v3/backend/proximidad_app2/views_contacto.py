"""
Vista para manejar contacto y sugerencias de usuarios públicos
Envía emails a proximidadapp@gmail.com
"""
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
def contacto_publico(request):
    """
    Recibe mensajes de contacto de usuarios públicos (con o sin sesión).
    
    Body esperado:
    {
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "mensaje": "Quiero sugerir...",
        "tipo": "sugerencia" | "contacto" | "comentario"
    }
    """
    try:
        nombre = request.data.get('nombre', '').strip()
        email = request.data.get('email', '').strip()
        mensaje = request.data.get('mensaje', '').strip()
        tipo = request.data.get('tipo', 'contacto')
        
        # Validaciones
        if not nombre:
            return Response(
                {'error': 'El nombre es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not email:
            return Response(
                {'error': 'El email es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not mensaje:
            return Response(
                {'error': 'El mensaje es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar formato de email básico
        if '@' not in email or '.' not in email:
            return Response(
                {'error': 'Email inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determinar el asunto según el tipo
        asuntos = {
            'sugerencia': '💡 Nueva Sugerencia',
            'contacto': '📧 Nuevo Mensaje de Contacto',
            'comentario': '💬 Nuevo Comentario Público',
            'newsletter': '📰 Suscripción al Boletín'
        }
        
        asunto_tipo = asuntos.get(tipo, '📧 Nuevo Mensaje')
        
        # Email al equipo de ProXimidad
        email_equipo = f'''
Nuevo mensaje recibido en ProXimidad

Tipo: {tipo.upper()}
=====================================

De: {nombre}
Email: {email}
Fecha: {__import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M')}

Mensaje:
{mensaje}

=====================================

Para responder a este usuario, usa el email: {email}

---
Sistema ProXimidad - Gestión de Contactos
        '''
        
        # Enviar email al equipo
        try:
            send_mail(
                subject=f'{asunto_tipo} - {nombre}',
                message=email_equipo,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['proximidadapp@gmail.com'],
                fail_silently=False,
            )
            logger.info(f"Email de contacto enviado desde {email}")
        except Exception as e:
            logger.error(f"Error al enviar email al equipo: {str(e)}")
            return Response(
                {'error': 'Error al enviar el mensaje. Intenta nuevamente.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Email de confirmación al usuario
        if tipo == 'newsletter':
            mensaje_confirmacion = f'''
Hola {nombre},

¡Gracias por suscribirte a nuestro boletín!

Recibirás las últimas actualizaciones y noticias sobre servicios, promociones y novedades de ProXimidad directamente en tu bandeja de entrada.

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo ProXimidad
            '''
        else:
            mensaje_confirmacion = f'''
Hola {nombre},

Hemos recibido tu mensaje:

"{mensaje[:100]}{'...' if len(mensaje) > 100 else ''}"

Nuestro equipo revisará tu {tipo} y te responderemos a la brevedad a este correo: {email}

Tiempo estimado de respuesta: 24-48 horas.

Gracias por contactarnos.

Saludos,
Equipo ProXimidad
            '''
        
        try:
            send_mail(
                subject=f'✅ Mensaje Recibido - ProXimidad',
                message=mensaje_confirmacion,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,  # No fallar si el email del usuario es inválido
            )
        except Exception as e:
            logger.warning(f"No se pudo enviar confirmación a {email}: {str(e)}")
        
        return Response({
            'success': True,
            'message': 'Mensaje enviado correctamente. Te responderemos pronto.'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error en contacto_publico: {str(e)}")
        return Response(
            {'error': 'Error al procesar el mensaje'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
