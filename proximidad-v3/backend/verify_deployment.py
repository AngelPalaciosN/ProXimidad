#!/usr/bin/env python
"""
Script de verificación pre-deployment para ProXimidad V3
Ejecutar antes de subir a producción
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from django.core.management import call_command
from proximidad_app.models import Usuario, Servicios, Solicitud, Comentarios, Categoria

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def check_pass(message):
    print(f"{Colors.GREEN}✓{Colors.END} {message}")

def check_fail(message):
    print(f"{Colors.RED}✗{Colors.END} {message}")

def check_warn(message):
    print(f"{Colors.YELLOW}⚠{Colors.END} {message}")

def check_debug_mode():
    """Verificar que DEBUG esté en False"""
    print_header("1. VERIFICACIÓN DE SEGURIDAD")
    
    if settings.DEBUG:
        check_fail("DEBUG está en True - CAMBIAR A False PARA PRODUCCIÓN")
        return False
    else:
        check_pass("DEBUG está en False ✓")
        return True

def check_secret_key():
    """Verificar que SECRET_KEY no sea la default"""
    default_key = 'django-insecure-'
    if settings.SECRET_KEY.startswith(default_key):
        check_warn("SECRET_KEY parece ser la clave por defecto - Considera cambiarla")
        return False
    else:
        check_pass("SECRET_KEY está configurada")
        return True

def check_allowed_hosts():
    """Verificar ALLOWED_HOSTS"""
    if not settings.ALLOWED_HOSTS or settings.ALLOWED_HOSTS == ['*']:
        check_warn("ALLOWED_HOSTS no está configurado o permite todos los hosts")
        return False
    else:
        check_pass(f"ALLOWED_HOSTS configurado: {settings.ALLOWED_HOSTS}")
        return True

def check_database():
    """Verificar conexión a base de datos"""
    print_header("2. VERIFICACIÓN DE BASE DE DATOS")
    
    try:
        # Test connection
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        check_pass("Conexión a base de datos exitosa")
        
        # Check tables
        usuarios = Usuario.objects.count()
        servicios = Servicios.objects.count()
        solicitudes = Solicitud.objects.count()
        comentarios = Comentarios.objects.count()
        categorias = Categoria.objects.count()
        
        print(f"\n   Registros en base de datos:")
        print(f"   - Usuarios: {usuarios}")
        print(f"   - Servicios: {servicios}")
        print(f"   - Solicitudes: {solicitudes}")
        print(f"   - Comentarios: {comentarios}")
        print(f"   - Categorías: {categorias}")
        
        if categorias == 0:
            check_warn("No hay categorías. Ejecutar: python manage.py loaddata categorias.json")
        
        return True
        
    except Exception as e:
        check_fail(f"Error de conexión a BD: {str(e)}")
        return False

def check_migrations():
    """Verificar que todas las migraciones estén aplicadas"""
    print_header("3. VERIFICACIÓN DE MIGRACIONES")
    
    try:
        from django.db.migrations.executor import MigrationExecutor
        from django.db import connection
        
        executor = MigrationExecutor(connection)
        plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
        
        if plan:
            check_warn(f"Hay {len(plan)} migración(es) pendiente(s)")
            print("   Ejecutar: python manage.py migrate")
            return False
        else:
            check_pass("Todas las migraciones están aplicadas")
            return True
            
    except Exception as e:
        check_fail(f"Error verificando migraciones: {str(e)}")
        return False

def check_static_files():
    """Verificar archivos estáticos"""
    print_header("4. VERIFICACIÓN DE ARCHIVOS ESTÁTICOS")
    
    static_root = getattr(settings, 'STATIC_ROOT', None)
    media_root = getattr(settings, 'MEDIA_ROOT', None)
    
    if not static_root:
        check_warn("STATIC_ROOT no está configurado")
        return False
    else:
        if os.path.exists(static_root):
            check_pass(f"STATIC_ROOT existe: {static_root}")
        else:
            check_warn(f"STATIC_ROOT no existe. Ejecutar: python manage.py collectstatic")
    
    if not media_root:
        check_warn("MEDIA_ROOT no está configurado")
    else:
        if os.path.exists(media_root):
            check_pass(f"MEDIA_ROOT existe: {media_root}")
        else:
            check_warn(f"MEDIA_ROOT no existe. Crear carpeta: {media_root}")
    
    return True

def check_email_config():
    """Verificar configuración de email"""
    print_header("5. VERIFICACIÓN DE EMAIL")
    
    email_backend = settings.EMAIL_BACKEND
    
    if 'console' in email_backend.lower():
        check_warn("EMAIL_BACKEND está en modo consola (desarrollo)")
        return False
    
    if not settings.EMAIL_HOST:
        check_fail("EMAIL_HOST no está configurado")
        return False
    
    if not settings.EMAIL_HOST_USER:
        check_warn("EMAIL_HOST_USER no está configurado")
        return False
    
    if not settings.EMAIL_HOST_PASSWORD:
        check_warn("EMAIL_HOST_PASSWORD no está configurado")
        return False
    
    check_pass("Configuración de email presente")
    check_warn("⚠ Recuerda probar envío de emails manualmente")
    return True

def check_api_endpoints():
    """Verificar que las vistas principales existan"""
    print_header("6. VERIFICACIÓN DE ENDPOINTS API")
    
    try:
        from proximidad_app import views, views_proveedor, views_solicitudes
        
        check_pass("views.py cargado correctamente")
        check_pass("views_proveedor.py cargado correctamente")
        check_pass("views_solicitudes.py cargado correctamente")
        
        # Verificar que existan funciones clave
        assert hasattr(views_proveedor, 'dashboard_resumen')
        assert hasattr(views_proveedor, 'calificacion_promedio')
        assert hasattr(views_solicitudes, 'crear_solicitud')
        
        check_pass("Endpoints críticos presentes")
        return True
        
    except Exception as e:
        check_fail(f"Error verificando endpoints: {str(e)}")
        return False

def check_frontend_build():
    """Verificar que exista build de frontend"""
    print_header("7. VERIFICACIÓN DE FRONTEND")
    
    frontend_dist = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'frontend',
        'dist'
    )
    
    if os.path.exists(frontend_dist):
        check_pass(f"Build de frontend existe: {frontend_dist}")
        
        # Verificar index.html
        index_html = os.path.join(frontend_dist, 'index.html')
        if os.path.exists(index_html):
            check_pass("index.html presente")
        else:
            check_warn("index.html no encontrado en dist/")
        
        return True
    else:
        check_warn("Build de frontend no existe. Ejecutar: npm run build")
        return False

def generate_report():
    """Generar reporte final"""
    print_header("RESUMEN DE VERIFICACIÓN")
    
    checks = {
        "Seguridad (DEBUG=False)": check_debug_mode(),
        "Secret Key": check_secret_key(),
        "Allowed Hosts": check_allowed_hosts(),
        "Base de Datos": check_database(),
        "Migraciones": check_migrations(),
        "Archivos Estáticos": check_static_files(),
        "Configuración Email": check_email_config(),
        "Endpoints API": check_api_endpoints(),
        "Frontend Build": check_frontend_build(),
    }
    
    passed = sum(checks.values())
    total = len(checks)
    percentage = (passed / total) * 100
    
    print(f"\n{Colors.BOLD}Resultado:{Colors.END}")
    print(f"   Verificaciones pasadas: {passed}/{total} ({percentage:.1f}%)")
    
    if percentage == 100:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ ¡Todo listo para deploy!{Colors.END}\n")
        return True
    elif percentage >= 70:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠ Casi listo, pero revisa las advertencias{Colors.END}\n")
        return False
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}✗ NO LISTO para deploy. Corrige los errores{Colors.END}\n")
        return False

if __name__ == "__main__":
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         VERIFICACIÓN PRE-DEPLOY - PROXIMIDAD V3           ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")
    
    success = generate_report()
    
    if not success:
        print(f"{Colors.YELLOW}Consulta DEPLOY_CHECKLIST.md para más detalles{Colors.END}\n")
        sys.exit(1)
    else:
        print(f"{Colors.GREEN}Puedes proceder con el deployment siguiendo DEPLOY_CHECKLIST.md{Colors.END}\n")
        sys.exit(0)
