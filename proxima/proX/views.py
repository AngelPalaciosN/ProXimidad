from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    # Acción personalizada para registrar usuario
    @action(detail=False, methods=['post'], url_path='registrar')
    def register(self, request):
        # Utilizamos el serializer para validar y guardar los datos del usuario
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            
            # Guardamos el usuario si la validación fue exitosa
            usuario = serializer.save()
            
            # Respondemos con un mensaje de éxito y datos del usuario registrado
            return Response({
                'message': 'Registro exitoso',
                'user_id': usuario.id,
                'nombre': usuario.nombre_completo
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Si ocurre un error, devolvemos los errores del serializer
            return Response({
                'errors': serializer.errors,
                'message': 'Error en el registro'
            }, status=status.HTTP_400_BAD_REQUEST)
