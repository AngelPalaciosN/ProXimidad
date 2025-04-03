"""
URL configuration for proxi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from proxiApp.views import servicios_list, usuarios_list, agregar_favorito, eliminar_favorito
from proxiApp.auth_views import register, login, generar_codigo, verificar_codigo
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('servicios/', servicios_list, name='servicios-list'),
    path('usuarios/', usuarios_list, name='usuarios-list'),
    path('favoritos/', agregar_favorito, name='agregar-favorito'),
    path('favoritos/eliminar/<int:usuario_id>/<int:favorito_id>/', eliminar_favorito, name='eliminar-favorito'),
    
    # Auth endpoints
    path('register/', csrf_exempt(register), name='register'),
    path('login/', csrf_exempt(login), name='login'),
    path('generar-codigo/', csrf_exempt(generar_codigo), name='generar-codigo'),
    path('verificar-codigo/', csrf_exempt(verificar_codigo), name='verificar-codigo'),
]
