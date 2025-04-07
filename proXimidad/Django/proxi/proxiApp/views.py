from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Servicios, Usuario, Favoritos
from .serializer import ServiciosSerializer, UsuarioSerializer, FavoritosSerializer
import random
from rest_framework import serializers
from django.contrib.auth.models import User

# Create your views here.

@api_view(['GET'])
def servicios_list(request):
    servicios = Servicios.objects.all()
    serializer = ServiciosSerializer(servicios, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def usuarios_list(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def agregar_favorito(request):
    serializer = FavoritosSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def eliminar_favorito(request, usuario_id, favorito_id):
    try:
        favorito = Favoritos.objects.get(usuario_id=usuario_id, favorito_id=favorito_id)
        favorito.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Favoritos.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
