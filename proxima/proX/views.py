from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
import random
from datetime import timedelta
from .models import Usuario, Categoria, Servicio, Favorito, Comentario
from .serializers import UsuarioSerializer, CategoriaSerializer, ServicioSerializer, FavoritoSerializer, ComentarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['post'], url_path='registrar')
    def register(self, request):
        """
        Register a new user and generate verification code
        """
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            usuario = serializer.save()
            
            # Generate verification code automatically
            codigo_verificacion = str(random.randint(100000, 999999))
            usuario.codigo_verificacion = codigo_verificacion
            usuario.codigo_fecha_generacion = timezone.now()
            usuario.save()

            # In production, send via email instead of printing
            print(f'Código de verificación para {usuario.correo_electronico}: {codigo_verificacion}')

            return Response({
                'message': 'Registro exitoso',
                'user_id': usuario.id,
                'nombre': usuario.nombre_completo,
                'email': usuario.correo_electronico
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'errors': serializer.errors,
                'message': f'Error en el registro: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='iniciar')
    def iniciar(self, request):
        """
        Login with email and verification code
        """
        correo_electronico = request.data.get('correo_electronico')
        codigo_verificacion = request.data.get('codigo_verificacion')

        if not correo_electronico or not codigo_verificacion:
            return Response({
                'errors': 'Correo electrónico y código de verificación son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(correo_electronico=correo_electronico)
            
            # Check if code is expired (30 minutes validity)
            if usuario.codigo_fecha_generacion and \
               timezone.now() > usuario.codigo_fecha_generacion + timedelta(minutes=30):
                return Response({
                    'errors': 'Código de verificación expirado'
                }, status=status.HTTP_400_BAD_REQUEST)

            if usuario.codigo_verificacion == codigo_verificacion:
                refresh = RefreshToken.for_user(usuario)
                return Response({
                    'message': 'Inicio de sesión exitoso',
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'id': usuario.id,
                        'nombre': usuario.nombre_completo,
                        'email': usuario.correo_electronico,
                        'tipo_usuario': usuario.tipo_usuario
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': 'Código de verificación incorrecto'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({
                'errors': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='generar-codigo')
    def generar_codigo(self, request):
        """
        Generate verification code and store generation timestamp
        """
        correo_electronico = request.data.get('correo_electronico')
        if not correo_electronico:
            return Response({
                'error': 'Correo electrónico es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(correo_electronico=correo_electronico)
            
            # Check if last code was generated less than 1 minute ago
            if usuario.codigo_fecha_generacion and \
               timezone.now() < usuario.codigo_fecha_generacion + timedelta(minutes=1):
                return Response({
                    'error': 'Debe esperar 1 minuto antes de solicitar un nuevo código'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            codigo_verificacion = str(random.randint(100000, 999999))
            usuario.codigo_verificacion = codigo_verificacion
            usuario.codigo_fecha_generacion = timezone.now()
            usuario.save()

            # In production, send via email instead of printing
            print(f'Código de verificación para {correo_electronico}: {codigo_verificacion}')

            return Response({
                'message': 'Código de verificación generado',
                'email': correo_electronico
            }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({
                'error': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='proveedores')
    def listar_proveedores(self, request):
        """
        List all service providers
        """
        proveedores = self.queryset.filter(tipo_usuario='proveedor')
        serializer = self.get_serializer(proveedores, many=True)
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

    @action(detail=False, methods=['post'], url_path='buscar')
    def buscar(self, request):
        """
        Search services by name or description
        """
        query = request.data.get('q', '')
        servicios = self.queryset.all()
        
        if query:
            servicios = servicios.filter(
                nombre_servicio__icontains=query
            ) | servicios.filter(
                descripcion__icontains=query
            )
        
        serializer = self.get_serializer(servicios, many=True)
        return Response(serializer.data)

class FavoritoViewSet(viewsets.ModelViewSet):
    queryset = Favorito.objects.all()
    serializer_class = FavoritoSerializer

    @action(detail=False, methods=['post'], url_path='usuario')
    def listar_favoritos(self, request):
        """
        List all favorites for a specific user
        """
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response({
                'error': 'ID de usuario es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)

        favoritos = self.queryset.filter(usuario_id=usuario_id)
        serializer = self.get_serializer(favoritos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='eliminar')
    def eliminar_favorito(self, request):
        """
        Delete a specific favorite for a user
        """
        usuario_id = request.data.get('usuario_id')
        favorito_id = request.data.get('favorito_id')
        
        if not usuario_id or not favorito_id:
            return Response({
                'error': 'ID de usuario y favorito son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            favorito = Favorito.objects.get(usuario_id=usuario_id, id=favorito_id)
            favorito.delete()
            return Response({
                'message': 'Favorito eliminado exitosamente'
            }, status=status.HTTP_200_OK)
        except Favorito.DoesNotExist:
            return Response({
                'error': 'Favorito no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

    @action(detail=False, methods=['post'], url_path='crear')
    def crear_comentario(self, request):
        """
        Create a comment for a specific service
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            comentario = serializer.save()
            return Response({
                'message': 'Comentario creado con éxito',
                'comentario_id': comentario.id,
                'usuario': comentario.usuario.nombre_completo,
                'servicio': comentario.servicio.nombre_servicio,
                'mensaje': comentario.mensaje
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Error al crear el comentario',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)