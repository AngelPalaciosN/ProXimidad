from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, CategoriaViewSet, ServicioViewSet, FavoritoViewSet, ComentarioViewSet

router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'favoritos', FavoritoViewSet)
router.register(r'comentarios', ComentarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
