#!/usr/bin/env python
"""
Script de validación para verificar el funcionamiento de las imágenes en ProXimidad

Ejecuta este script desde el directorio Django/proxi para verificar que todo esté configurado correctamente.
"""

import os
import sys
import django
from pathlib import Path

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proxi.settings')
django.setup()

from proxiApp.models import Usuario, Servicios
from django.conf import settings

def verificar_configuracion():
    """Verifica la configuración de archivos media"""
    print("=== VERIFICACIÓN DE CONFIGURACIÓN DE IMÁGENES ===\n")
    
    # Verificar configuración de MEDIA
    print(f"MEDIA_URL: {settings.MEDIA_URL}")
    print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
    print(f"DEBUG: {settings.DEBUG}")
    
    # Verificar que el directorio media existe
    media_path = Path(settings.MEDIA_ROOT)
    print(f"\nDirectorio MEDIA existe: {media_path.exists()}")
    
    # Verificar subdirectorios
    usuarios_path = media_path / 'usuarios'
    servicios_path = media_path / 'servicios'
    
    print(f"Directorio usuarios/ existe: {usuarios_path.exists()}")
    print(f"Directorio servicios/ existe: {servicios_path.exists()}")
    
    if usuarios_path.exists():
        archivos_usuarios = list(usuarios_path.glob('*'))
        print(f"Archivos en usuarios/: {len(archivos_usuarios)}")
        for archivo in archivos_usuarios[:5]:  # Mostrar primeros 5
            print(f"  - {archivo.name}")
    
    if servicios_path.exists():
        archivos_servicios = list(servicios_path.glob('*'))
        print(f"Archivos en servicios/: {len(archivos_servicios)}")

def verificar_modelos():
    """Verifica que los modelos estén configurados correctamente"""
    print("\n=== VERIFICACIÓN DE MODELOS ===\n")
    
    # Verificar modelo Usuario
    print("Campos del modelo Usuario:")
    for field in Usuario._meta.fields:
        print(f"  - {field.name}: {field.__class__.__name__}")
        if field.name == 'imagen':
            print(f"    Upload to: {getattr(field, 'upload_to', 'N/A')}")
    
    print("\nCampos del modelo Servicios:")
    for field in Servicios._meta.fields:
        print(f"  - {field.name}: {field.__class__.__name__}")
        if field.name == 'imagen':
            print(f"    Upload to: {getattr(field, 'upload_to', 'N/A')}")

def verificar_datos():
    """Verifica los datos existentes"""
    print("\n=== VERIFICACIÓN DE DATOS ===\n")
    
    # Usuarios con imagen
    usuarios_con_imagen = Usuario.objects.exclude(imagen__isnull=True).exclude(imagen__exact='')
    print(f"Usuarios con imagen: {usuarios_con_imagen.count()}")
    
    for usuario in usuarios_con_imagen[:3]:  # Mostrar primeros 3
        print(f"  - {usuario.nombre_completo}: {usuario.imagen}")
        
        # Verificar si el archivo existe
        if usuario.imagen:
            archivo_path = Path(settings.MEDIA_ROOT) / str(usuario.imagen)
            existe = archivo_path.exists()
            print(f"    Archivo existe: {existe}")
            if existe:
                print(f"    Tamaño: {archivo_path.stat().st_size} bytes")
    
    # Servicios con imagen
    servicios_con_imagen = Servicios.objects.exclude(imagen__isnull=True).exclude(imagen__exact='')
    print(f"\nServicios con imagen: {servicios_con_imagen.count()}")
    
    for servicio in servicios_con_imagen[:3]:  # Mostrar primeros 3
        print(f"  - {servicio.nombre_servicio}: {servicio.imagen}")

def verificar_urls():
    """Verifica que las URLs de ejemplo funcionen"""
    print("\n=== URLS DE EJEMPLO ===\n")
    
    base_url = "http://192.168.1.101:8000"  # Usar IP de desarrollo en lugar de localhost
    
    print("URLs que deberían funcionar:")
    print(f"  - API Usuarios: {base_url}/api/usuarios/")
    print(f"  - API Servicios: {base_url}/api/servicios/")
    print(f"  - Admin Panel: {base_url}/admin/")
    
    # Ejemplo de URL de imagen
    usuarios_con_imagen = Usuario.objects.exclude(imagen__isnull=True).exclude(imagen__exact='').first()
    if usuarios_con_imagen:
        imagen_url = f"{base_url}{settings.MEDIA_URL}{usuarios_con_imagen.imagen}"
        print(f"  - Imagen de usuario ejemplo: {imagen_url}")

def main():
    try:
        verificar_configuracion()
        verificar_modelos()
        verificar_datos()
        verificar_urls()
        
        print("\n=== RESUMEN ===")
        print("✅ Verificación completada")
        print("📝 Revisa la salida anterior para identificar cualquier problema")
        print("\n💡 Para aplicar cambios pendientes:")
        print("   python manage.py makemigrations proxiApp")
        print("   python manage.py migrate")
        print("   python manage.py runserver")
        
    except Exception as e:
        print(f"\n❌ Error durante la verificación: {e}")
        print("🔧 Asegúrate de que Django esté configurado correctamente")

if __name__ == "__main__":
    main()