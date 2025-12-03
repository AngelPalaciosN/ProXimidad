"""
Script para corregir UTF-8 en categorías usando UPDATE directo en MySQL
"""
import django
import os
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

print("=== Corrección UTF-8 en categorías (Método MySQL directo) ===\n")

# Correcciones con UPDATE directo
correcciones = [
    (1, 'Tecnología', 'Desarrollo web, apps, software, TI y servicios tecnológicos'),
    (2, 'Educación', 'Clases, tutorías, cursos y capacitaciones'),
    (3, 'Consultoría', 'Asesoría empresarial, legal, financiera y profesional'),
    (4, 'Diseño', 'Diseño gráfico, web, identidad corporativa y creativo'),
    (5, 'Fotografía', 'Fotografía profesional, edición y producción audiovisual'),
    (6, 'Reparación', 'Reparación de electrodomésticos, equipos y mantenimiento'),
    (7, 'Salud y Bienestar', 'Terapias, psicología, nutrición y servicios de salud'),
    (9, 'Hogar y Jardinería', 'Limpieza, jardinería, decoración y servicios del hogar'),
    (11, 'Eventos', 'Organización de eventos, catering, animación y logística'),
    (12, 'Transporte', 'Mudanzas, mensajería, transporte de personas y carga'),
    (13, 'Belleza', 'Peluquería, estética, maquillaje y cuidado personal'),
    (14, 'Música y Arte', 'Clases de música, arte, instrumentos y producción'),
    (15, 'Mascotas', 'Veterinaria, peluquería canina, adiestramiento y cuidado')
]

with connection.cursor() as cursor:
    actualizadas = 0
    for cat_id, nombre, descripcion in correcciones:
        try:
            # UPDATE con codificación explícita UTF-8
            cursor.execute("""
                UPDATE categoria 
                SET nombre_categoria = %s, 
                    descripcion_categoria = %s
                WHERE categoria_id = %s
            """, [nombre, descripcion, cat_id])
            
            if cursor.rowcount > 0:
                actualizadas += 1
                print(f'✓ Categoría {cat_id}: {nombre}')
            else:
                print(f'⊘ Categoría {cat_id} no encontrada')
                
        except Exception as e:
            print(f'✗ Error en categoría {cat_id}: {str(e)}')
    
    # Commit de cambios
    connection.commit()

print(f'\n✓ {actualizadas} categorías actualizadas correctamente')
print('\n=== Verificando resultados ===')

# Verificar con SELECT
with connection.cursor() as cursor:
    cursor.execute("SELECT categoria_id, nombre_categoria FROM categoria ORDER BY categoria_id LIMIT 15")
    resultados = cursor.fetchall()
    
    print("\nCategorías actuales en la BD:")
    for cat_id, nombre in resultados:
        print(f"{cat_id:2d}. {nombre}")
