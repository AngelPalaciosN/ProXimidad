from django.urls import path
from . import views

urlpatterns = [
    # APIs básicas
    path('usuarios/', views.usuarios_list, name='usuarios_list'),
    path('servicios/', views.servicios_list, name='servicios_list'),
    path('categorias/', views.categorias_list, name='categorias_list'),
    path('comentarios/', views.comentarios_list, name='comentarios_list'),
    path('comentarios/crear/', views.crear_comentario, name='crear_comentario'),
    
    # Autenticación y usuarios
    path('generar-codigo/', views.generar_codigo, name='generar_codigo'),
    path('crear-usuario/', views.create_usuario, name='create_usuario'),
    path('login/', views.login_usuario, name='login_usuario'),
    
    # Favoritos
    path('favoritos/', views.agregar_favorito, name='agregar_favorito'),
    path('favoritos/eliminar/<int:usuario_id>/<int:favorito_id>/', views.eliminar_favorito, name='eliminar_favorito'),
]
