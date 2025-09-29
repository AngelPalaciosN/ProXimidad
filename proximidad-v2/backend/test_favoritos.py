#!/usr/bin/env python
import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Usuario, Servicios, Favoritos

def probar_favoritos():
    """Prueba el sistema de favoritos completo"""
    
    BASE_URL = "http://192.168.0.100:8000/api"
    
    print("🚀 Iniciando pruebas del sistema de favoritos...\n")
    
    # Obtener usuarios existentes
    usuarios = Usuario.objects.all()[:2]
    if len(usuarios) < 2:
        print("❌ Se necesitan al menos 2 usuarios para las pruebas")
        return
    
    usuario1 = usuarios[0]
    usuario2 = usuarios[1]
    
    # Obtener servicios existentes  
    servicios = Servicios.objects.all()[:2]
    if len(servicios) < 2:
        print("❌ Se necesitan al menos 2 servicios para las pruebas")
        return
        
    servicio1 = servicios[0]
    servicio2 = servicios[1]
    
    print(f"👤 Usuario 1: {usuario1.nombre_completo} (ID: {usuario1.id})")
    print(f"👤 Usuario 2: {usuario2.nombre_completo} (ID: {usuario2.id})")
    print(f"🛠️ Servicio 1: {servicio1.nombre_servicio} (ID: {servicio1.id})")
    print(f"🛠️ Servicio 2: {servicio2.nombre_servicio} (ID: {servicio2.id})")
    print()
    
    # Test 1: Agregar usuario favorito
    print("📋 Test 1: Agregar usuario favorito")
    data = {
        'usuario_id': usuario1.id,
        'favorito_id': usuario2.id,
        'tipo': 'usuario'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/favoritos/", json=data)
        if response.status_code == 201:
            print("✅ Usuario favorito agregado exitosamente")
            print(f"   Respuesta: {response.json()}")
        else:
            print(f"❌ Error al agregar usuario favorito: {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    print()
    
    # Test 2: Agregar servicio favorito
    print("📋 Test 2: Agregar servicio favorito")
    data = {
        'usuario_id': usuario1.id,
        'favorito_id': servicio1.id,
        'tipo': 'servicio'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/favoritos/", json=data)
        if response.status_code == 201:
            print("✅ Servicio favorito agregado exitosamente")
            print(f"   Respuesta: {response.json()}")
        else:
            print(f"❌ Error al agregar servicio favorito: {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    print()
    
    # Test 3: Obtener favoritos de usuarios
    print("📋 Test 3: Obtener usuarios favoritos")
    try:
        response = requests.get(f"{BASE_URL}/favoritos/{usuario1.id}/?tipo=usuario")
        if response.status_code == 200:
            data = response.json()
            print("✅ Usuarios favoritos obtenidos exitosamente")
            print(f"   Total: {data.get('total', 0)} usuarios favoritos")
            for fav in data.get('favoritos', []):
                print(f"   - {fav.get('favorito_nombre')} ({fav.get('favorito_email')})")
        else:
            print(f"❌ Error al obtener usuarios favoritos: {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    print()
    
    # Test 4: Obtener favoritos de servicios
    print("📋 Test 4: Obtener servicios favoritos")
    try:
        response = requests.get(f"{BASE_URL}/favoritos/{usuario1.id}/?tipo=servicio")
        if response.status_code == 200:
            data = response.json()
            print("✅ Servicios favoritos obtenidos exitosamente")
            print(f"   Total: {data.get('total', 0)} servicios favoritos")
            for fav in data.get('favoritos', []):
                print(f"   - {fav.get('favorito_nombre')} (${fav.get('favorito_precio')})")
        else:
            print(f"❌ Error al obtener servicios favoritos: {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    print()
    
    # Test 5: Verificar datos en la base de datos
    print("📋 Test 5: Verificar datos en la base de datos")
    favoritos_db = Favoritos.objects.filter(usuario_id=usuario1.id)
    print(f"✅ Total de favoritos en BD para usuario {usuario1.id}: {favoritos_db.count()}")
    
    for fav in favoritos_db:
        if fav.tipo_favorito == 'usuario':
            print(f"   👤 Usuario favorito: {fav.favorito_usuario.nombre_completo}")
        else:
            print(f"   🛠️ Servicio favorito: {fav.favorito_servicio.nombre_servicio}")
    
    print("\n🎉 Pruebas completadas!")

if __name__ == '__main__':
    probar_favoritos()