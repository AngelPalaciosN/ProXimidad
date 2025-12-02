from django.contrib import admin
from .models import Usuario, Servicios, Categoria, Comentarios, Favoritos, ServicioImagenes, Solicitud


class ServicioImagenesInline(admin.TabularInline):
    """Inline para mostrar imágenes dentro del admin de Servicios"""
    model = ServicioImagenes
    extra = 1
    max_num = 5
    fields = ['imagen', 'orden', 'es_principal']
    ordering = ['orden']


@admin.register(Servicios)
class ServiciosAdmin(admin.ModelAdmin):
    list_display = ['nombre_servicio', 'categoria', 'proveedor', 'precio_base', 'activo', 'destacado', 'views']
    list_filter = ['activo', 'destacado', 'categoria']
    search_fields = ['nombre_servicio', 'descripcion']
    inlines = [ServicioImagenesInline]


@admin.register(ServicioImagenes)
class ServicioImagenesAdmin(admin.ModelAdmin):
    list_display = ['servicio', 'orden', 'es_principal', 'fecha_creacion']
    list_filter = ['es_principal']
    ordering = ['servicio', 'orden']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['correo_electronico', 'nombre_completo', 'tipo_usuario', 'activo']
    list_filter = ['tipo_usuario', 'activo']
    search_fields = ['correo_electronico', 'nombre_completo']


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre_categoria', 'color', 'icono', 'orden', 'activo']
    list_filter = ['activo']
    ordering = ['orden']


@admin.register(Comentarios)
class ComentariosAdmin(admin.ModelAdmin):
    list_display = ['servicio_fk', 'usuario_fk', 'calificacion', 'fecha_creacion', 'activo']
    list_filter = ['calificacion', 'activo']


@admin.register(Favoritos)
class FavoritosAdmin(admin.ModelAdmin):
    list_display = ['usuario_id', 'favorito_usuario', 'favorito_servicio', 'tipo_favorito', 'fecha_agregado']
    list_filter = ['tipo_favorito']


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
