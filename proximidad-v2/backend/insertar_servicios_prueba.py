#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Servicios, Categoria

def crear_servicios_prueba():
    """Crea servicios de prueba para testing"""
    
    # Crear o obtener categorías
    categorias_data = [
        {'nombre': 'Tecnología', 'descripcion': 'Servicios relacionados con tecnología'},
        {'nombre': 'Hogar', 'descripcion': 'Servicios para el hogar'},
        {'nombre': 'Salud', 'descripcion': 'Servicios de salud y bienestar'},
        {'nombre': 'Educación', 'descripcion': 'Servicios educativos'},
        {'nombre': 'Transporte', 'descripcion': 'Servicios de transporte'},
    ]
    
    categorias = {}
    for cat_data in categorias_data:
        categoria, created = Categoria.objects.get_or_create(
            nombre_categoria=cat_data['nombre'],
            defaults={'descripcion_categoria': cat_data['descripcion'], 'activo': True}
        )
        categorias[cat_data['nombre']] = categoria
        if created:
            print(f"✅ Categoría creada: {categoria.nombre_categoria}")
        else:
            print(f"📁 Categoría existente: {categoria.nombre_categoria}")
    
    # Crear servicios de prueba
    servicios_data = [
        {
            'nombre_servicio': 'Reparación de Computadores',
            'descripcion': 'Servicio técnico especializado en reparación y mantenimiento de equipos de cómputo',
            'precio_base': 50000.00,
            'categoria': categorias['Tecnología'],
            'ubicacion': 'Bogotá Centro',
            'activo': True
        },
        {
            'nombre_servicio': 'Plomería Residencial',
            'descripcion': 'Instalación y reparación de sistemas de plomería para el hogar',
            'precio_base': 75000.00,
            'categoria': categorias['Hogar'],
            'ubicacion': 'Zona Norte Bogotá',
            'activo': True
        },
        {
            'nombre_servicio': 'Consultas Médicas Generales',
            'descripcion': 'Atención médica general y consultas de medicina preventiva',
            'precio_base': 120000.00,
            'categoria': categorias['Salud'],
            'ubicacion': 'Chapinero',
            'activo': True
        },
        {
            'nombre_servicio': 'Clases de Inglés Personalizadas',
            'descripcion': 'Enseñanza de inglés con metodología personalizada para todos los niveles',
            'precio_base': 40000.00,
            'categoria': categorias['Educación'],
            'ubicacion': 'Zona Rosa',
            'activo': True
        },
        {
            'nombre_servicio': 'Servicio de Domicilios',
            'descripcion': 'Entrega rápida y segura de paquetes y documentos en la ciudad',
            'precio_base': 15000.00,
            'categoria': categorias['Transporte'],
            'ubicacion': 'Toda Bogotá',
            'activo': True
        },
        {
            'nombre_servicio': 'Desarrollo Web',
            'descripcion': 'Creación de sitios web y aplicaciones web modernas y responsivas',
            'precio_base': 500000.00,
            'categoria': categorias['Tecnología'],
            'ubicacion': 'Remoto/Bogotá',
            'activo': True
        },
        {
            'nombre_servicio': 'Limpieza Profunda de Hogar',
            'descripcion': 'Servicio completo de aseo y desinfección para el hogar',
            'precio_base': 80000.00,
            'categoria': categorias['Hogar'],
            'ubicacion': 'Suba y alrededores',
            'activo': True
        },
        {
            'nombre_servicio': 'Fisioterapia a Domicilio',
            'descripcion': 'Sesiones de fisioterapia y rehabilitación en la comodidad de su hogar',
            'precio_base': 90000.00,
            'categoria': categorias['Salud'],
            'ubicacion': 'Zona Sur Bogotá',
            'activo': True
        }
    ]
    
    servicios_creados = 0
    for servicio_data in servicios_data:
        servicio, created = Servicios.objects.get_or_create(
            nombre_servicio=servicio_data['nombre_servicio'],
            defaults=servicio_data
        )
        
        if created:
            servicios_creados += 1
            print(f"✅ Servicio creado: {servicio.nombre_servicio} - ${servicio.precio_base:,.0f}")
        else:
            print(f"📋 Servicio existente: {servicio.nombre_servicio}")
    
    print(f"\n🎉 ¡Completado! Se crearon {servicios_creados} nuevos servicios")
    print(f"📊 Total de servicios en la base de datos: {Servicios.objects.count()}")
    print(f"📁 Total de categorías: {Categoria.objects.count()}")

if __name__ == '__main__':
    print("🚀 Iniciando creación de servicios de prueba...\n")
    crear_servicios_prueba()
    print("\n✨ Servicios listos para testear favoritos!")