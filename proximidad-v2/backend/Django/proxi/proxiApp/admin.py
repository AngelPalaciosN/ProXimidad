from django.contrib import admin
from .models import Usuario, Servicios, Categoria, Comentarios, Favoritos

# Register your models here.

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['categoria_id', 'nombre_categoria', 'descripcion_categoria']
    search_fields = ['nombre_categoria']

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_completo', 'correo_electronico', 'tipo_usuario', 'telefono', 'tiene_imagen']
    list_filter = ['tipo_usuario']
    search_fields = ['nombre_completo', 'correo_electronico', 'cedula']
    fields = ['nombre_completo', 'correo_electronico', 'telefono', 'direccion', 'cedula', 'tipo_usuario', 'imagen']
    readonly_fields = ['tiene_imagen']
    
    def tiene_imagen(self, obj):
        """Indica si el usuario tiene imagen"""
        return 'Sí' if obj.imagen else 'No'
    tiene_imagen.short_description = 'Tiene imagen'

@admin.register(Servicios)
class ServiciosAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_servicio', 'proveedor', 'categoria', 'precio_base', 'tiene_imagen']
    list_filter = ['categoria', 'proveedor']
    search_fields = ['nombre_servicio', 'descripcion']
    fields = ['nombre_servicio', 'descripcion', 'precio_base', 'imagen', 'imagen_url', 'categoria', 'proveedor']
    readonly_fields = ['tiene_imagen']
    
    def tiene_imagen(self, obj):
        """Indica si el servicio tiene imagen"""
        return 'Sí' if obj.imagen or obj.imagen_url else 'No'
    tiene_imagen.short_description = 'Tiene imagen'

@admin.register(Comentarios)
class ComentariosAdmin(admin.ModelAdmin):
    list_display = ['comentario_id', 'usuario_fk', 'servicio_fk']
    list_filter = ['servicio_fk__categoria']
    search_fields = ['mensaje', 'usuario_fk__nombre_completo']

@admin.register(Favoritos)
class FavoritosAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario_id', 'favorito_id']
    search_fields = ['usuario_id__nombre_completo', 'favorito_id__nombre_completo']
