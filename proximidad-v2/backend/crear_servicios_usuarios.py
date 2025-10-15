#!/usr/bin/env python
"""
Script para crear servicios para usuarios proveedores existentes
"""

import os
import sys
import django
from decimal import Decimal
import random

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Usuario, Servicios, Categoria

def crear_categorias_si_no_existen():
    """Crear categorías básicas si no existen"""
    categorias = [
        {
            'nombre_categoria': 'Tecnología',
            'descripcion_categoria': 'Servicios relacionados con tecnología e informática',
            'icono': 'fas fa-laptop-code',
            'color': '#007bff'
        },
        {
            'nombre_categoria': 'Educación',
            'descripcion_categoria': 'Servicios educativos y de formación',
            'icono': 'fas fa-graduation-cap',
            'color': '#28a745'
        },
        {
            'nombre_categoria': 'Consultoría',
            'descripcion_categoria': 'Servicios de consultoría y asesoría',
            'icono': 'fas fa-user-tie',
            'color': '#6f42c1'
        },
        {
            'nombre_categoria': 'Diseño',
            'descripcion_categoria': 'Servicios de diseño gráfico y creativo',
            'icono': 'fas fa-palette',
            'color': '#e83e8c'
        },
        {
            'nombre_categoria': 'Salud',
            'descripcion_categoria': 'Servicios relacionados con salud y bienestar',
            'icono': 'fas fa-heartbeat',
            'color': '#dc3545'
        },
        {
            'nombre_categoria': 'Hogar',
            'descripcion_categoria': 'Servicios para el hogar y mantenimiento',
            'icono': 'fas fa-home',
            'color': '#fd7e14'
        }
    ]
    
    for cat_data in categorias:
        categoria, created = Categoria.objects.get_or_create(
            nombre_categoria=cat_data['nombre_categoria'],
            defaults=cat_data
        )
        if created:
            print(f"✅ Categoría creada: {categoria.nombre_categoria}")
        else:
            print(f"ℹ️  Categoría ya existe: {categoria.nombre_categoria}")

def crear_servicios_para_proveedores():
    """Crear servicios variados para cada proveedor"""
    
    # Obtener todos los usuarios proveedores
    proveedores = Usuario.objects.filter(tipo_usuario='proveedor', activo=True)
    print(f"📋 Encontrados {proveedores.count()} proveedores activos")
    
    if not proveedores.exists():
        print("❌ No se encontraron proveedores en la base de datos")
        return
    
    # Obtener categorías
    categorias = list(Categoria.objects.filter(activo=True))
    if not categorias:
        print("❌ No se encontraron categorías. Creando categorías primero...")
        crear_categorias_si_no_existen()
        categorias = list(Categoria.objects.filter(activo=True))
    
    # Plantillas de servicios por categoría
    servicios_plantillas = {
        'Tecnología': [
            {
                'nombre': 'Desarrollo Web Profesional',
                'descripcion': 'Desarrollo de sitios web modernos y responsivos con las últimas tecnologías. Incluye diseño, desarrollo, testing y despliegue.'
            },
            {
                'nombre': 'Aplicaciones Móviles',
                'descripcion': 'Desarrollo de aplicaciones móviles nativas e híbridas para Android e iOS con funcionalidades avanzadas.'
            },
            {
                'nombre': 'Consultoría en Sistemas',
                'descripcion': 'Asesoría especializada en arquitectura de sistemas, optimización de procesos y transformación digital.'
            }
        ],
        'Educación': [
            {
                'nombre': 'Clases Particulares de Programación',
                'descripcion': 'Tutoría personalizada en programación, desde conceptos básicos hasta tecnologías avanzadas.'
            },
            {
                'nombre': 'Cursos de Inglés',
                'descripcion': 'Clases de inglés personalizadas para todos los niveles, enfoque conversacional y técnico.'
            },
            {
                'nombre': 'Matemáticas y Física',
                'descripcion': 'Clases particulares de matemáticas y física para estudiantes de secundaria y universidad.'
            }
        ],
        'Consultoría': [
            {
                'nombre': 'Consultoría Empresarial',
                'descripcion': 'Asesoría en gestión empresarial, procesos organizacionales y estrategias de crecimiento.'
            },
            {
                'nombre': 'Marketing Digital',
                'descripcion': 'Estrategias de marketing digital, gestión de redes sociales y campañas publicitarias.'
            }
        ],
        'Diseño': [
            {
                'nombre': 'Diseño Gráfico',
                'descripcion': 'Diseño de logos, identidad corporativa, material publicitario y diseño web.'
            },
            {
                'nombre': 'Diseño UX/UI',
                'descripcion': 'Diseño de interfaces de usuario y experiencia de usuario para aplicaciones web y móviles.'
            }
        ],
        'Salud': [
            {
                'nombre': 'Terapia Psicológica',
                'descripcion': 'Sesiones de terapia psicológica individual, manejo de ansiedad, estrés y desarrollo personal.'
            },
            {
                'nombre': 'Nutrición y Dietética',
                'descripcion': 'Planes nutricionales personalizados, seguimiento dietético y educación alimentaria.'
            }
        ],
        'Hogar': [
            {
                'nombre': 'Reparaciones Domésticas',
                'descripcion': 'Servicios de reparación y mantenimiento del hogar: plomería, electricidad, pintura.'
            },
            {
                'nombre': 'Limpieza Profunda',
                'descripcion': 'Servicios de limpieza profunda y mantenimiento para hogares y oficinas.'
            }
        ]
    }
    
    servicios_creados = 0
    
    for proveedor in proveedores:
        print(f"\n👤 Creando servicios para: {proveedor.nombre_completo}")
        
        # Crear entre 2-4 servicios por proveedor
        num_servicios = random.randint(2, 4)
        
        for i in range(num_servicios):
            # Seleccionar categoría aleatoria
            categoria = random.choice(categorias)
            
            # Obtener plantillas de esa categoría
            plantillas = servicios_plantillas.get(categoria.nombre_categoria, [
                {'nombre': 'Servicio Profesional', 'descripcion': 'Servicio profesional especializado'}
            ])
            
            if plantillas:
                plantilla = random.choice(plantillas)
                
                # Generar precio aleatorio entre 50,000 y 2,000,000
                precio = Decimal(random.randint(50000, 2000000))
                
                # Verificar si ya existe un servicio similar
                existe = Servicios.objects.filter(
                    proveedor=proveedor,
                    nombre_servicio__icontains=plantilla['nombre'][:20]
                ).exists()
                
                if not existe:  # Solo crear si no existe
                    servicio = Servicios.objects.create(
                        nombre_servicio=f"{plantilla['nombre']} - {proveedor.nombre_completo.split()[0]}",
                        descripcion=plantilla['descripcion'],
                        precio_base=precio,
                        categoria=categoria,
                        proveedor=proveedor,
                        activo=True,
                        destacado=random.choice([True, False]),
                        views=random.randint(1, 100)
                    )
                    
                    print(f"  ✅ Servicio creado: {servicio.nombre_servicio} - ${precio:,.0f}")
                    servicios_creados += 1
                else:
                    print(f"  ⚠️  Servicio similar ya existe para {plantilla['nombre']}")
    
    print(f"\n🎉 ¡Proceso completado! Se crearon {servicios_creados} servicios nuevos")
    
    # Mostrar resumen
    print("\n📊 RESUMEN FINAL:")
    total_servicios = Servicios.objects.count()
    total_proveedores = Usuario.objects.filter(tipo_usuario='proveedor').count()
    print(f"👥 Total proveedores: {total_proveedores}")
    print(f"🛍️  Total servicios: {total_servicios}")
    print(f"📂 Total categorías: {Categoria.objects.count()}")

if __name__ == "__main__":
    print("🚀 Iniciando creación de servicios para proveedores...")
    crear_categorias_si_no_existen()
    crear_servicios_para_proveedores()
    print("✅ ¡Script completado!")