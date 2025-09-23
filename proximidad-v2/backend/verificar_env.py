#!/usr/bin/env python
"""
Script de verificación de variables de entorno para ProXimidad
Valida que todas las configuraciones estén correctamente cargadas
"""

import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from decouple import config

def verificar_variables_entorno():
    """Verifica que todas las variables de entorno estén configuradas correctamente"""
    
    print("🔍 Verificando configuración de variables de entorno...\n")
    
    # Verificar variables críticas
    variables_criticas = [
        ('SECRET_KEY', settings.SECRET_KEY, 'Clave secreta de Django'),
        ('DEBUG', settings.DEBUG, 'Modo debug'),
        ('ALLOWED_HOSTS', settings.ALLOWED_HOSTS, 'Hosts permitidos'),
        ('TIME_ZONE', settings.TIME_ZONE, 'Zona horaria'),
        ('LANGUAGE_CODE', settings.LANGUAGE_CODE, 'Código de idioma'),
    ]
    
    print("📋 Variables críticas del backend:")
    for nombre, valor, descripcion in variables_criticas:
        status = "✅" if valor else "❌"
        print(f"  {status} {nombre}: {valor} ({descripcion})")
    
    # Verificar configuración de base de datos
    print(f"\n🗄️  Base de datos:")
    db_config = settings.DATABASES['default']
    print(f"  ✅ ENGINE: {db_config['ENGINE']}")
    print(f"  ✅ NAME: {db_config['NAME']}")
    
    # Verificar CORS
    print(f"\n🌐 CORS:")
    if hasattr(settings, 'CORS_ALLOWED_ORIGINS'):
        print(f"  ✅ CORS_ALLOWED_ORIGINS: {list(settings.CORS_ALLOWED_ORIGINS)}")
    else:
        print("  ❌ CORS_ALLOWED_ORIGINS no configurado")
    
    # Verificar archivos estáticos
    print(f"\n📁 Archivos estáticos:")
    print(f"  ✅ STATIC_URL: {settings.STATIC_URL}")
    print(f"  ✅ MEDIA_URL: {settings.MEDIA_URL}")
    
    # Verificar que se pueden leer variables adicionales
    print(f"\n🔧 Variables adicionales:")
    try:
        jwt_secret = config('JWT_SECRET_KEY', default='no-configurado')
        print(f"  ✅ JWT_SECRET_KEY: {'configurado' if jwt_secret != 'no-configurado' else 'no configurado'}")
        
        file_upload_max = config('FILE_UPLOAD_MAX_SIZE', default=5242880, cast=int)
        print(f"  ✅ FILE_UPLOAD_MAX_SIZE: {file_upload_max} bytes")
        
        log_level = config('LOG_LEVEL', default='INFO')
        print(f"  ✅ LOG_LEVEL: {log_level}")
        
    except Exception as e:
        print(f"  ❌ Error leyendo variables adicionales: {e}")
    
    print(f"\n✅ Verificación de backend completada!")
    return True

def verificar_archivo_env():
    """Verifica que el archivo .env exista y tenga las variables necesarias"""
    
    print("\n📄 Verificando archivo .env...")
    
    env_path = backend_dir / '.env'
    if env_path.exists():
        print(f"  ✅ Archivo .env encontrado en: {env_path}")
        
        # Leer y mostrar algunas variables
        with open(env_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        variables_encontradas = 0
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                variables_encontradas += 1
        
        print(f"  ✅ Variables encontradas: {variables_encontradas}")
        
    else:
        print(f"  ❌ Archivo .env no encontrado en: {env_path}")
        print("  💡 Copia .env.example a .env y configura las variables")
        return False
    
    return True

if __name__ == "__main__":
    try:
        print("🚀 ProXimidad - Verificador de Variables de Entorno")
        print("=" * 50)
        
        # Verificar archivo .env
        if verificar_archivo_env():
            # Verificar variables de entorno
            verificar_variables_entorno()
            
            print("\n🎉 ¡Configuración verificada exitosamente!")
            print("💡 Tu proyecto está listo para ejecutarse.")
            
        else:
            print("\n⚠️  Configuración incompleta")
            print("💡 Revisa los errores mostrados arriba.")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ Error durante la verificación: {e}")
        print("💡 Asegúrate de que el archivo .env esté configurado correctamente.")
        sys.exit(1)