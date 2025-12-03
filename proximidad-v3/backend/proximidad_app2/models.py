"""
Modelos para proximidad_app2 - API de Solicitudes y Proveedores
Maneja todas las operaciones relacionadas con:
- Solicitudes de servicios
- Gestión de proveedores
- Notificaciones por email
"""

from django.db import models
from django.utils import timezone
from proximidad_app.models import Servicios, Usuario


class Solicitud(models.Model):
    """
    Modelo para gestionar solicitudes de servicios entre clientes y proveedores.
    Maneja el flujo completo desde la solicitud hasta la confirmación final.
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('en_proceso', 'En Proceso'),
        ('completado', 'Completado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    ]
    
    URGENCIA_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    
    # Relaciones con proximidad_app
    servicio = models.ForeignKey(
        'proximidad_app.Servicios',
        on_delete=models.CASCADE,
        db_column='servicio_id',
        related_name='solicitudes'
    )
    cliente = models.ForeignKey(
        'proximidad_app.Usuario',
        on_delete=models.CASCADE,
        db_column='cliente_id',
        related_name='solicitudes_realizadas'
    )
    proveedor = models.ForeignKey(
        'proximidad_app.Usuario',
        on_delete=models.CASCADE,
        db_column='proveedor_id',
        related_name='solicitudes_recibidas'
    )
    
    # Detalles de la solicitud
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='pendiente',
        db_index=True
    )
    precio_acordado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Precio acordado entre cliente y proveedor'
    )
    descripcion_personalizada = models.TextField(
        help_text='Descripción detallada del proyecto solicitado por el cliente'
    )
    urgencia = models.CharField(
        max_length=10,
        choices=URGENCIA_CHOICES,
        default='media'
    )
    fecha_preferida = models.DateField(
        null=True,
        blank=True,
        help_text='Fecha preferida de inicio del proyecto'
    )
    presupuesto_maximo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Presupuesto máximo del cliente'
    )
    comentarios_adicionales = models.TextField(
        blank=True,
        help_text='Comentarios adicionales del cliente'
    )
    
    # Respuesta del proveedor
    respuesta_proveedor = models.TextField(
        blank=True,
        help_text='Respuesta o propuesta del proveedor'
    )
    fecha_respuesta = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Fecha en que el proveedor respondió'
    )
    
    # Fechas de seguimiento
    fecha_solicitud = models.DateTimeField(
        default=timezone.now,
        db_index=True
    )
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_inicio = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Fecha de inicio del trabajo'
    )
    fecha_completado = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Fecha de finalización del trabajo'
    )
    
    # Notificaciones
    notificado_cliente = models.BooleanField(
        default=False,
        help_text='Email enviado al cliente'
    )
    notificado_proveedor = models.BooleanField(
        default=False,
        help_text='Email enviado al proveedor'
    )
    
    class Meta:
        app_label = 'proximidad_app2'
        db_table = 'solicitudes'
        ordering = ['-fecha_solicitud']
        indexes = [
            models.Index(fields=['cliente', 'estado']),
            models.Index(fields=['proveedor', 'estado']),
            models.Index(fields=['servicio']),
            models.Index(fields=['estado', 'fecha_solicitud']),
            models.Index(fields=['fecha_solicitud']),
        ]
    
    def __str__(self):
        return f"Solicitud #{self.id} - {self.get_servicio_nombre()} - {self.estado}"
    
    def get_servicio_nombre(self):
        """Nombre del servicio solicitado"""
        try:
            return self.servicio.nombre_servicio if self.servicio else None
        except:
            return None
    
    @property
    def servicio_nombre(self):
        return self.get_servicio_nombre()
    
    @property
    def cliente_nombre(self):
        """Nombre del cliente"""
        try:
            return self.cliente.nombre_completo if self.cliente else None
        except:
            return None
    
    @property
    def proveedor_nombre(self):
        """Nombre del proveedor"""
        try:
            return self.proveedor.nombre_completo if self.proveedor else None
        except:
            return None
    
    @property
    def dias_pendiente(self):
        """Días transcurridos desde la solicitud"""
        if self.estado == 'pendiente':
            return (timezone.now() - self.fecha_solicitud).days
        return None
    
    def cambiar_estado(self, nuevo_estado, respuesta=None):
        """
        Cambia el estado de la solicitud y actualiza fechas correspondientes
        """
        estados_validos = [choice[0] for choice in self.ESTADO_CHOICES]
        if nuevo_estado not in estados_validos:
            raise ValueError(f"Estado '{nuevo_estado}' no válido")
        
        self.estado = nuevo_estado
        
        if nuevo_estado == 'aceptado':
            self.fecha_respuesta = timezone.now()
            if respuesta:
                self.respuesta_proveedor = respuesta
        elif nuevo_estado == 'en_proceso':
            if not self.fecha_inicio:
                self.fecha_inicio = timezone.now()
        elif nuevo_estado == 'completado':
            self.fecha_completado = timezone.now()
        
        self.save()
