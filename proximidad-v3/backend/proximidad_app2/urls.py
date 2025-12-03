"""
URLs para proximidad_app2 - API de Solicitudes y Proveedores
Maneja todas las operaciones de solicitudes, proveedores y notificaciones
"""

from django.urls import path
from . import views_solicitudes, views_proveedor, views_contacto

app_name = 'proximidad_app2'

urlpatterns = [
    # ===== CONTACTO PÚBLICO =====
    path('contacto/', views_contacto.contacto_publico, name='contacto_publico'),
    
    # ===== SOLICITUDES DE SERVICIOS =====
    path('solicitudes/crear/', views_solicitudes.crear_solicitud, name='crear_solicitud'),
    path('solicitudes/cliente/<int:cliente_id>/', views_solicitudes.listar_solicitudes_cliente, name='solicitudes_cliente'),
    path('solicitudes/proveedor/<int:proveedor_id>/', views_solicitudes.listar_solicitudes_proveedor, name='solicitudes_proveedor'),
    path('solicitudes/<int:solicitud_id>/', views_solicitudes.detalle_solicitud, name='detalle_solicitud'),
    path('solicitudes/<int:solicitud_id>/actualizar/', views_solicitudes.actualizar_estado_solicitud, name='actualizar_solicitud'),
    path('solicitudes/<int:solicitud_id>/cancelar/', views_solicitudes.cancelar_solicitud, name='cancelar_solicitud'),
    path('solicitudes/estadisticas/<int:usuario_id>/', views_solicitudes.estadisticas_solicitudes, name='estadisticas_solicitudes'),
    
    # ===== API PROVEEDOR (SEPARADA) =====
    # Endpoints exclusivos para el panel del proveedor
    path('proveedor/mis-servicios/', views_proveedor.mis_servicios, name='proveedor_servicios'),
    path('proveedor/solicitudes/', views_proveedor.solicitudes_recibidas, name='proveedor_solicitudes'),
    path('proveedor/solicitudes/<int:solicitud_id>/responder/', views_proveedor.responder_solicitud, name='proveedor_responder'),
    path('proveedor/estadisticas/', views_proveedor.estadisticas_proveedor, name='proveedor_estadisticas'),
    path('proveedor/calificacion/', views_proveedor.calificacion_promedio, name='proveedor_calificacion'),
    path('proveedor/dashboard/', views_proveedor.dashboard_resumen, name='proveedor_dashboard'),
]
