"""
Script para corregir problemas de UTF-8 en las categorías
"""
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Categoria

# Diccionario con las correcciones
correcciones = {
    1: {'nombre': 'Tecnología', 'descripcion': 'Desarrollo web, apps, software, TI y servicios tecnológicos'},
    2: {'nombre': 'Educación', 'descripcion': 'Clases, tutorías, cursos y capacitaciones'},
    3: {'nombre': 'Consultoría', 'descripcion': 'Asesoría empresarial, legal, financiera y profesional'},
    4: {'nombre': 'Diseño', 'descripcion': 'Diseño gráfico, web, identidad corporativa y creativo'},
    5: {'nombre': 'Fotografía', 'descripcion': 'Fotografía profesional, edición y producción audiovisual'},
    6: {'nombre': 'Reparación', 'descripcion': 'Reparación de electrodomésticos, equipos y mantenimiento'},
    7: {'nombre': 'Salud y Bienestar', 'descripcion': 'Terapias, psicología, nutrición y servicios de salud'},
    9: {'nombre': 'Hogar y Jardinería', 'descripcion': 'Limpieza, jardinería, decoración y servicios del hogar'},
    11: {'nombre': 'Eventos', 'descripcion': 'Organización de eventos, catering, animación y logística'},
    12: {'nombre': 'Transporte', 'descripcion': 'Mudanzas, mensajería, transporte de personas y carga'},
    13: {'nombre': 'Belleza', 'descripcion': 'Peluquería, estética, maquillaje y cuidado personal'},
    14: {'nombre': 'Música y Arte', 'descripcion': 'Clases de música, arte, instrumentos y producción'},
    15: {'nombre': 'Mascotas', 'descripcion': 'Veterinaria, peluquería canina, adiestramiento y cuidado'}
}

print("=== Corrección de categorías UTF-8 ===\n")

actualizadas = 0
for cat_id, datos in correcciones.items():
    try:
        cat = Categoria.objects.get(categoria_id=cat_id)
        cat.nombre_categoria = datos['nombre']
        cat.descripcion_categoria = datos['descripcion']
        cat.save()
        actualizadas += 1
        print(f'✓ Categoría {cat_id}: {datos["nombre"]}')
    except Categoria.DoesNotExist:
        print(f'✗ Categoría {cat_id} no existe')

print(f'\n{actualizadas} categorías actualizadas correctamente')
