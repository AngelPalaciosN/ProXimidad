from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views, views_optimizadas
# views_solicitudes y views_proveedor MIGRADOS a proximidad_app2

urlpatterns = [
    # APIs básicas (existentes)
    path('usuarios/', views.usuarios_list, name='usuarios_list'),
    path('servicios/', views.servicios_list, name='servicios_list'),
    path('servicios/crear/', views.crear_servicio, name='crear_servicio'),
    path('servicios/<int:servicio_id>/', views.servicio_detail, name='servicio_detail'),
    path('servicios/<int:servicio_id>/actualizar/', views.actualizar_servicio, name='actualizar_servicio'),
    path('servicios/<int:servicio_id>/eliminar/', views.eliminar_servicio, name='eliminar_servicio'),
    path('servicios/buscar/', views.buscar_servicios, name='buscar_servicios'),
    path('servicios/mis-servicios/', views.mis_servicios, name='mis_servicios'),
    path('categorias/', views.categorias_list, name='categorias_list'),
    path('comentarios/', views.comentarios_list, name='comentarios_list'),
    path('comentarios/crear/', views.crear_comentario, name='crear_comentario'),
    
    # Autenticación y usuarios (exacto como el backend viejo)
    path('generar-codigo/', views.generar_codigo, name='generar_codigo'),
    path('verificar-codigo/', views.verificar_codigo, name='verificar_codigo'),  # NUEVA RUTA OBLIGATORIA
    path('crear-usuario/', views.create_usuario, name='create_usuario'),
    path('login/', views.login_usuario, name='login_usuario'),
    path('usuarios/<int:usuario_id>/', views.usuario_detail, name='usuario_detail'),
    path('usuarios/<int:usuario_id>/actualizar/', views.actualizar_usuario, name='actualizar_usuario'),
    
    # Favoritos (existentes)
    path('favoritos/', views.agregar_favorito, name='agregar_favorito'),
    path('favoritos/<int:usuario_id>/', views.obtener_favoritos, name='obtener_favoritos'),
    path('favoritos/eliminar/<int:usuario_id>/<int:favorito_id>/', views.eliminar_favorito, name='eliminar_favorito'),
    
    # Estadísticas (existentes)
    path('estadisticas/', views.estadisticas_dashboard, name='estadisticas_dashboard'),
    
    # NOTA: Rutas de solicitudes y proveedor MIGRADAS a proximidad_app2/urls.py
    
    # ===== NUEVAS RUTAS OPTIMIZADAS =====
    
    # Autenticación v2 (optimizada)
    path('v2/auth/codigo/', views_optimizadas.enviar_codigo_verificacion_v2, name='auth_codigo_v2'),
    path('v2/auth/verificar/', views_optimizadas.verificar_codigo_v2, name='auth_verificar_v2'),
    
    # Servicios optimizados
    path('v2/servicios/', views_optimizadas.ServiciosOptimizadosListView.as_view(), name='servicios_optimizados'),
    path('v2/servicios/categoria/<int:categoria_id>/', views_optimizadas.servicios_por_categoria_optimizado, name='servicios_categoria_v2'),
    path('v2/servicios/busqueda/', views_optimizadas.busqueda_avanzada_servicios, name='busqueda_avanzada_v2'),
    path('v2/servicios/recomendados/', views_optimizadas.servicios_recomendados, name='recomendados_v2'),
    path('v2/servicios/recomendados/<int:usuario_id>/', views_optimizadas.servicios_recomendados, name='recomendados_usuario_v2'),
    
    # Dashboard y estadísticas v2
    path('v2/dashboard/', views_optimizadas.dashboard_estadisticas, name='dashboard_v2'),
    
    # Health check optimizado
    path('v2/health/', views_optimizadas.health_check_optimizado, name='health_v2'),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
