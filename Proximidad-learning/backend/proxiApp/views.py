from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import usuarios

def usuario(request):
    datos = list(usuarios.objects.values())
    return JsonResponse(datos, safe=False)

def home(request):
    return redirect('/usuario/')