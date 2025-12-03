"""
Admin para proximidad_app2 - API de Solicitudes y Proveedores
"""

from django.contrib import admin
from .models import Solicitud


@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'servicio', 'cliente', 'proveedor', 'estado', 
        'urgencia', 'fecha_solicitud', 'dias_pendiente'
    ]
    list_filter = ['estado', 'urgencia', 'fecha_solicitud']
    search_fields = ['servicio__nombre_servicio', 'cliente__nombre_completo', 'proveedor__nombre_completo']
    readonly_fields = ['fecha_solicitud', 'fecha_actualizacion', 'fecha_respuesta', 'dias_pendiente']
    
    fieldsets = (
        ('Información General', {
            'fields': ('servicio', 'cliente', 'proveedor', 'estado')
        }),
        ('Detalles de la Solicitud', {
            'fields': (
                'descripcion_personalizada', 'urgencia', 'fecha_preferida',
                'presupuesto_maximo', 'precio_acordado', 'comentarios_adicionales'
            )
        }),
        ('Respuesta del Proveedor', {
            'fields': ('respuesta_proveedor', 'fecha_respuesta')
        }),
        ('Fechas de Seguimiento', {
            'fields': (
                'fecha_solicitud', 'fecha_actualizacion', 
                'fecha_inicio', 'fecha_completado', 'dias_pendiente'
            )
        }),
        ('Notificaciones', {
            'fields': ('notificado_cliente', 'notificado_proveedor')
        }),
    )
    
    def dias_pendiente(self, obj):
        """Muestra días pendientes solo si está en estado pendiente"""
        return obj.dias_pendiente if obj.dias_pendiente is not None else '-'
    dias_pendiente.short_description = 'Días Pendiente'
