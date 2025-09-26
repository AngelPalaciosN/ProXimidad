#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    import django
    django.setup()
    
    from django.conf import settings
    from decouple import Config, RepositoryEnv
    
    print("=== VERIFICACIÓN DE CONFIGURACIÓN ===")
    print(f"BASE_DIR: {settings.BASE_DIR}")
    
    # Cargar variables del .env del directorio raíz
    root_dir = settings.BASE_DIR.parent
    env_path = root_dir / '.env'
    
    print(f"Buscando archivo .env en: {env_path}")
    print(f"¿Existe el archivo .env? {env_path.exists()}")
    
    if env_path.exists():
        config = Config(RepositoryEnv(env_path))
        
        print("\n=== VARIABLES DEL .ENV ===")
        print(f"DATABASE_HOST: {config('DATABASE_HOST', default='No encontrada')}")
        print(f"DATABASE_PASSWORD: {config('DATABASE_PASSWORD', default='No encontrada')}")
        print(f"ALLOWED_HOSTS: {config('ALLOWED_HOSTS', default='No encontrada')}")
        print(f"SERVER_HOST: {config('SERVER_HOST', default='No encontrada')}")
        print(f"BACKEND_URL: {config('BACKEND_URL', default='No encontrada')}")
        
        print("\n=== CONFIGURACIÓN ACTUAL DE DJANGO ===")
        print(f"ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
        print(f"DEBUG: {settings.DEBUG}")
        print(f"CORS_ALLOW_ALL_ORIGINS: {settings.CORS_ALLOW_ALL_ORIGINS}")
        
        print("\n=== CONFIGURACIÓN DE BASE DE DATOS ===")
        db_config = settings.DATABASES['default']
        print(f"ENGINE: {db_config['ENGINE']}")
        print(f"NAME: {db_config['NAME']}")
        print(f"USER: {db_config['USER']}")
        print(f"PASSWORD: {'***' if db_config['PASSWORD'] else 'VACÍA'}")
        print(f"HOST: {db_config['HOST']}")
        print(f"PORT: {db_config['PORT']}")
        
    else:
        print("¡ERROR! No se encontró el archivo .env")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()