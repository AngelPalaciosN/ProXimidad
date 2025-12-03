"""
URL configuration for ProXimidad V3 - Arquitectura de 2 APIs

proximidad_app  → API pública: servicios, búsqueda, imágenes (lectura)
proximidad_app2 → API privada: solicitudes, proveedores, emails (operaciones)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
import os

# Determinar qué app cargar según variable de entorno
app_mode = os.environ.get('PROXIMIDAD_APP_MODE', 'all')

if app_mode == 'app1':
    # Solo cargar rutas de proximidad_app
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('proximidad_app.urls')),
    ]
elif app_mode == 'app2':
    # Solo cargar rutas de proximidad_app2
    urlpatterns = [
        path('api/', include('proximidad_app2.urls')),
    ]
else:
    # Modo desarrollo: cargar ambas
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('proximidad_app.urls')),
        path('api/', include('proximidad_app2.urls')),
    ]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
