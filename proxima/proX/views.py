from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['post'], url_path='registrar')
    def register(self, request):
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
