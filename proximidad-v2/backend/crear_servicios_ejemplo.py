#!/usr/bin/env python
"""
Script para crear servicios de ejemplo en la base de datos
"""
import os
import sys
import django
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Usuario, Categoria, Servicios

def crear_categorias():
    """Crear categorías de ejemplo"""
    categorias = [
        {"nombre_categoria": "Tecnología", "descripcion_categoria": "Servicios relacionados con tecnología e informática"},
        {"nombre_categoria": "Diseño", "descripcion_categoria": "Servicios de diseño gráfico y creativo"},
        {"nombre_categoria": "Marketing", "descripcion_categoria": "Servicios de marketing digital y publicidad"},
        {"nombre_categoria": "Consultoría", "descripcion_categoria": "Servicios de consultoría empresarial"},
        {"nombre_categoria": "Educación", "descripcion_categoria": "Servicios educativos y de capacitación"},
        {"nombre_categoria": "Salud", "descripcion_categoria": "Servicios relacionados con salud y bienestar"},
        {"nombre_categoria": "Construcción", "descripcion_categoria": "Servicios de construcción y remodelación"},
        {"nombre_categoria": "Finanzas", "descripcion_categoria": "Servicios financieros y contables"},
    ]
    
    for cat_data in categorias:
        categoria, created = Categoria.objects.get_or_create(
            nombre_categoria=cat_data["nombre_categoria"],
            defaults=cat_data
        )
        if created:
            print(f"✅ Categoría creada: {categoria.nombre_categoria}")
        else:
            print(f"ℹ️  Categoría ya existe: {categoria.nombre_categoria}")

def crear_usuarios_proveedores():
    """Crear usuarios proveedores de ejemplo"""
    proveedores = [
        {
            "nombre_completo": "Juan Pérez García",
            "correo_electronico": "juan.perez@ejemplo.com",
            "telefono": "3001234567",
            "direccion": "Calle 123 #45-67, Bogotá",
            "cedula": "12345678",
            "tipo_usuario": "proveedor"
        },
        {
            "nombre_completo": "María González López",
            "correo_electronico": "maria.gonzalez@ejemplo.com",
            "telefono": "3007654321",
            "direccion": "Carrera 50 #30-15, Medellín",
            "cedula": "23456789",
            "tipo_usuario": "proveedor"
        },
        {
            "nombre_completo": "Carlos Rodríguez Sánchez",
            "correo_electronico": "carlos.rodriguez@ejemplo.com",
            "telefono": "3009876543",
            "direccion": "Avenida 80 #25-40, Cali",
            "cedula": "34567890",
            "tipo_usuario": "proveedor"
        },
        {
            "nombre_completo": "Ana María Herrera",
            "correo_electronico": "ana.herrera@ejemplo.com",
            "telefono": "3005432109",
            "direccion": "Calle 70 #15-20, Barranquilla",
            "cedula": "45678901",
            "tipo_usuario": "proveedor"
        },
        {
            "nombre_completo": "Luis Fernando Torres",
            "correo_electronico": "luis.torres@ejemplo.com",
            "telefono": "3008765432",
            "direccion": "Carrera 15 #85-30, Bogotá",
            "cedula": "56789012",
            "tipo_usuario": "proveedor"
        }
    ]
    
    for prov_data in proveedores:
        usuario, created = Usuario.objects.get_or_create(
            correo_electronico=prov_data["correo_electronico"],
            defaults=prov_data
        )
        if created:
            print(f"✅ Proveedor creado: {usuario.nombre_completo}")
        else:
            print(f"ℹ️  Proveedor ya existe: {usuario.nombre_completo}")

def crear_servicios():
    """Crear servicios de ejemplo"""
    servicios = [
        {
            "nombre_servicio": "Desarrollo Web Completo",
            "descripcion": "Creación de sitios web profesionales y responsivos con tecnologías modernas como React, Vue.js o Angular. Incluye diseño, desarrollo, testing y deployment.",
            "precio_base": Decimal("2500000"),
            "categoria": "Tecnología",
            "proveedor": "juan.perez@ejemplo.com"
        },
        {
            "nombre_servicio": "Diseño de Identidad Corporativa",
            "descripcion": "Diseño completo de identidad visual para empresas: logo, papelería, manual de marca, y aplicaciones digitales.",
            "precio_base": Decimal("1200000"),
            "categoria": "Diseño",
            "proveedor": "maria.gonzalez@ejemplo.com"
        },
        {
            "nombre_servicio": "Campaña de Marketing Digital",
            "descripcion": "Estrategia completa de marketing digital: SEO, SEM, redes sociales, email marketing y análisis de resultados.",
            "precio_base": Decimal("1800000"),
            "categoria": "Marketing",
            "proveedor": "carlos.rodriguez@ejemplo.com"
        },
        {
            "nombre_servicio": "Consultoría Empresarial",
            "descripcion": "Asesoría integral para optimización de procesos empresariales, análisis financiero y estrategias de crecimiento.",
            "precio_base": Decimal("3000000"),
            "categoria": "Consultoría",
            "proveedor": "ana.herrera@ejemplo.com"
        },
        {
            "nombre_servicio": "Desarrollo de Apps Móviles",
            "descripcion": "Creación de aplicaciones móviles nativas o híbridas para Android e iOS con diseño intuitivo y funcionalidades avanzadas.",
            "precio_base": Decimal("4000000"),
            "categoria": "Tecnología",
            "proveedor": "luis.torres@ejemplo.com"
        },
        {
            "nombre_servicio": "Diseño UX/UI",
            "descripcion": "Diseño de experiencia de usuario y interfaces para aplicaciones web y móviles, con focus en usabilidad y conversión.",
            "precio_base": Decimal("1500000"),
            "categoria": "Diseño",
            "proveedor": "maria.gonzalez@ejemplo.com"
        },
        {
            "nombre_servicio": "Automatización de Procesos",
            "descripcion": "Implementación de soluciones de automatización para optimizar procesos empresariales y aumentar la eficiencia.",
            "precio_base": Decimal("2200000"),
            "categoria": "Tecnología",
            "proveedor": "juan.perez@ejemplo.com"
        },
        {
            "nombre_servicio": "Gestión de Redes Sociales",
            "descripcion": "Administración completa de redes sociales: creación de contenido, community management y análisis de métricas.",
            "precio_base": Decimal("800000"),
            "categoria": "Marketing",
            "proveedor": "carlos.rodriguez@ejemplo.com"
        },
        {
            "nombre_servicio": "Capacitación en Tecnología",
            "descripcion": "Cursos y talleres personalizados en tecnologías modernas para equipos de trabajo y empresas.",
            "precio_base": Decimal("1000000"),
            "categoria": "Educación",
            "proveedor": "luis.torres@ejemplo.com"
        },
        {
            "nombre_servicio": "Análisis de Datos",
            "descripcion": "Servicios de análisis de datos empresariales, creación de dashboards y reportes automatizados con herramientas como Power BI.",
            "precio_base": Decimal("1600000"),
            "categoria": "Consultoría",
            "proveedor": "ana.herrera@ejemplo.com"
        }
    ]
    
    for serv_data in servicios:
        try:
            # Buscar categoría
            categoria = Categoria.objects.get(nombre_categoria=serv_data["categoria"])
            
            # Buscar proveedor
            proveedor = Usuario.objects.get(correo_electronico=serv_data["proveedor"])
            
            # Crear servicio
            servicio, created = Servicios.objects.get_or_create(
                nombre_servicio=serv_data["nombre_servicio"],
                defaults={
                    "descripcion": serv_data["descripcion"],
                    "precio_base": serv_data["precio_base"],
                    "categoria": categoria,
                    "proveedor": proveedor,
                    "activo": True
                }
            )
            
            if created:
                print(f"✅ Servicio creado: {servicio.nombre_servicio} - ${servicio.precio_base}")
            else:
                print(f"ℹ️  Servicio ya existe: {servicio.nombre_servicio}")
                
        except Exception as e:
            print(f"❌ Error creando servicio {serv_data['nombre_servicio']}: {str(e)}")

def main():
    """Función principal"""
    print("🚀 Iniciando creación de datos de ejemplo...")
    
    print("\n📁 Creando categorías...")
    crear_categorias()
    
    print("\n👥 Creando usuarios proveedores...")
    crear_usuarios_proveedores()
    
    print("\n🛠️  Creando servicios...")
    crear_servicios()
    
    print("\n✅ ¡Datos de ejemplo creados exitosamente!")
    print("\nResumen:")
    print(f"- Categorías: {Categoria.objects.count()}")
    print(f"- Usuarios: {Usuario.objects.count()}")
    print(f"- Servicios: {Servicios.objects.count()}")

if __name__ == "__main__":
    main()
