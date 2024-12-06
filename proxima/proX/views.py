from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario, Categoria, Servicio, Favorito, Comentario
from .serializers import UsuarioSerializer, CategoriaSerializer, ServicioSerializer, FavoritoSerializer, ComentarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['post'], url_path='registrar')
    def register(self, request):
        """
        Registro de un nuevo usuario con un código de verificación.
        """
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            usuario = serializer.save()
            return Response({
                'message': 'Registro exitoso',
                'user_id': usuario.id,
                'nombre': usuario.nombre_completo
            }, status=status.HTTP_201_CREATED)

        except Exception:
            return Response({
                'errors': serializer.errors,
                'message': 'Error en el registro'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='iniciar')
    def iniciar(self, request):
        """
        Iniciar sesión con correo electrónico y código de verificación.
        Si las credenciales son correctas, se retorna un token JWT.
        """
        correo_electronico = request.data.get('correo_electronico')
        codigo_verificacion = request.data.get('codigo_verificacion')

        try:
            usuario = Usuario.objects.get(correo_electronico=correo_electronico)
            if usuario.codigo_verificacion == codigo_verificacion:
                refresh = RefreshToken.for_user(usuario)
                access_token = str(refresh.access_token)
                return Response({
                    'message': 'Inicio de sesión exitoso',
                    'access_token': access_token
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': {'codigo_verificacion': 'Código de verificación incorrecto'}
                }, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({
                'errors': {'correo_electronico': 'Usuario no encontrado'}
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='proveedores')
    def listar_proveedores(self, request):
        proveedores = self.queryset.filter(tipo_usuario='proveedor')
        serializer = self.get_serializer(proveedores, many=True)
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

    @action(detail=False, methods=['get'], url_path='buscar')
    def buscar(self, request):
        query = request.query_params.get('q', None)
        if query:
            servicios = self.queryset.filter(nombre_servicio__icontains(query) | descripcion__icontains(query))
        else:
            servicios = self.queryset.all()
        
        serializer = self.get_serializer(servicios, many=True)
        return Response(serializer.data)

class FavoritoViewSet(viewsets.ModelViewSet):
    queryset = Favorito.objects.all()
    serializer_class = FavoritoSerializer

    @action(detail=False, methods=['get'], url_path='usuario/(?P<usuario_id>[^/.]+)')
    def listar_favoritos(self, request, usuario_id=None):
        favoritos = self.queryset.filter(usuario_id=usuario_id)
        serializer = self.get_serializer(favoritos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'], url_path='eliminar/(?P<usuario_id>[^/.]+)/(?P<favorito_id>[^/.]+)')
    def eliminar_favorito(self, request, usuario_id=None, favorito_id=None):
        try:
            favorito = Favorito.objects.get(usuario_id=usuario_id, favorito_id=favorito_id)
            favorito.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorito.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

    @action(detail=False, methods=['post'], url_path='crear')
    def crear_comentario(self, request):
        """
        Crear un comentario para un servicio específico.
        """
        serializer = ComentarioSerializer(data=request.data)
        if serializer.is_valid():
            comentario = serializer.save()
            return Response({
                'message': 'Comentario creado con éxito',
                'comentario_id': comentario.comentario_id,
                'usuario': comentario.usuario.nombre_completo,
                'servicio': comentario.servicio.nombre_servicio,
                'mensaje': comentario.mensaje
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Error al crear el comentario',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
