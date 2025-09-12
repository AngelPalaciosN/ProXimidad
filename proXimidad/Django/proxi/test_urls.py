#!/usr/bin/env python
"""
Script para probar las URLs de imágenes corregidas
"""

import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proxi.settings')
django.setup()

from proxiApp.models import Usuario, Servicios
from proxiApp.serializer import UsuarioSerializer, ServiciosSerializer
from django.test import RequestFactory

def test_usuario_urls():
    """Prueba las URLs de usuarios"""
    print("=== PRUEBA DE URLs DE USUARIOS ===\n")
    
    # Crear factory de request para simular contexto
    factory = RequestFactory()
    request = factory.get('/api/usuarios/')
    request.META['HTTP_HOST'] = '192.168.1.101:8000'
    request.META['wsgi.url_scheme'] = 'http'
    
    # Obtener usuarios con imagen
    usuarios = Usuario.objects.exclude(imagen__isnull=True).exclude(imagen__exact='')[:2]
    
    for usuario in usuarios:
        print(f"Usuario: {usuario.nombre_completo}")
        print(f"Campo imagen (BD): {usuario.imagen}")
        
        # Serializar con context
        serializer = UsuarioSerializer(usuario, context={'request': request})
        data = serializer.data
        
        print(f"imagen_url serializada: {data.get('imagen_url')}")
        print(f"URL completa esperada: http://192.168.1.101:8000{data.get('imagen_url')}")
        print("-" * 50)

def test_api_response():
    """Prueba la respuesta real de la API"""
    print("\n=== PRUEBA DE RESPUESTA API ===\n")
    
    api_url = "http://192.168.1.101:8000/api/usuarios/"
    
    try:
        response = requests.get(api_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"Status: {response.status_code}")
            print(f"Total usuarios: {len(data)}")
            
            # Buscar usuario con imagen
            for usuario in data:
                if usuario.get('imagen_url'):
                    print(f"\nUsuario: {usuario['nombre_completo']}")
                    print(f"imagen_url: {usuario['imagen_url']}")
                    
                    # Verificar si la URL no está duplicada
                    imagen_url = usuario['imagen_url']
                    if imagen_url.count('http://') > 1:
                        print("❌ ERROR: URL duplicada detectada!")
                    else:
                        print("✅ URL correcta")
                    
                    break
        else:
            print(f"Error: Status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("⚠️  No se pudo conectar al servidor. Asegúrate de que esté ejecutándose.")
    except Exception as e:
        print(f"Error: {e}")

def test_direct_image_access():
    """Prueba el acceso directo a las imágenes"""
    print("\n=== PRUEBA DE ACCESO DIRECTO A IMÁGENES ===\n")
    
    # URLs de imágenes conocidas
    test_images = [
        "/media/usuarios/Alan_Toro_Prime.jpeg",
        "/media/usuarios/down-4_Mbd7s3p.jpg"
    ]
    
    base_url = "http://192.168.1.101:8000"
    
    for img_path in test_images:
        full_url = f"{base_url}{img_path}"
        print(f"Probando: {full_url}")
        
        try:
            response = requests.head(full_url, timeout=5)
            if response.status_code == 200:
                print(f"✅ Accesible - Tamaño: {response.headers.get('Content-Length', 'Unknown')} bytes")
            else:
                print(f"❌ Error {response.status_code}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print()

def main():
    print("🔍 VERIFICACIÓN DE URLs DE IMÁGENES CORREGIDAS\n")
    
    test_usuario_urls()
    test_api_response()
    test_direct_image_access()
    
    print("\n=== RESUMEN ===")
    print("✅ Verificación completada")
    print("📝 Las URLs ahora deberían ser relativas (/media/...)")
    print("🌐 El frontend concatenará con VITE_API_BASE_URL")
    print("\n💡 URLs esperadas:")
    print("   - API: http://192.168.1.101:8000/api/usuarios/")
    print("   - Imagen: http://192.168.1.101:8000/media/usuarios/imagen.jpg")

if __name__ == "__main__":
    main()