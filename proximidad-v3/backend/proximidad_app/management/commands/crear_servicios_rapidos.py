#!/usr/bin/env python
"""
Comando de Django management para crear servicios rápidamente para usuarios proveedores
"""
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from decimal import Decimal
import random

from proximidad_app.models import Usuario, Categoria, Servicios


class Command(BaseCommand):
    help = 'Crea servicios de ejemplo para usuarios proveedores existentes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--proveedor-id',
            type=int,
            help='ID específico del proveedor (opcional, si no se especifica usa todos los proveedores)'
        )
        parser.add_argument(
            '--cantidad',
            type=int,
            default=5,
            help='Cantidad de servicios a crear por proveedor (default: 5)'
        )
        parser.add_argument(
            '--categoria',
            type=str,
            help='Nombre específico de categoría (opcional)'
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 Iniciando creación de servicios rápidos...')
        )
        
        # Verificar o crear categorías básicas
        self.crear_categorias_basicas()
        
        # Obtener proveedores
        if options['proveedor_id']:
            try:
                proveedores = [Usuario.objects.get(
                    id=options['proveedor_id'], 
                    tipo_usuario='proveedor'
                )]
                self.stdout.write(
                    f"Proveedor seleccionado: {proveedores[0].nombre_completo}"
                )
            except Usuario.DoesNotExist:
                raise CommandError(f'Proveedor con ID {options["proveedor_id"]} no encontrado')
        else:
            proveedores = Usuario.objects.filter(tipo_usuario='proveedor')
            if not proveedores.exists():
                raise CommandError('No hay usuarios proveedores en la base de datos')
            
            self.stdout.write(
                f"Proveedores encontrados: {proveedores.count()}"
            )
        
        # Obtener categorías
        if options['categoria']:
            try:
                categorias = [Categoria.objects.get(nombre_categoria__icontains=options['categoria'])]
            except Categoria.DoesNotExist:
                raise CommandError(f'Categoría "{options["categoria"]}" no encontrada')
        else:
            categorias = Categoria.objects.filter(activo=True)
            if not categorias.exists():
                raise CommandError('No hay categorías activas en la base de datos')
        
        # Crear servicios
        cantidad = options['cantidad']
        total_creados = 0
        
        for proveedor in proveedores:
            self.stdout.write(f"\n👨‍💼 Creando servicios para: {proveedor.nombre_completo}")
            
            servicios_creados = self.crear_servicios_para_proveedor(
                proveedor, categorias, cantidad
            )
            total_creados += servicios_creados
            
            self.stdout.write(
                self.style.SUCCESS(f"   ✅ {servicios_creados} servicios creados")
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 ¡Completado! Total de servicios creados: {total_creados}'
            )
        )

    def crear_categorias_basicas(self):
        """Crear categorías básicas si no existen"""
        categorias_basicas = [
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
        
        for cat_data in categorias_basicas:
            categoria, created = Categoria.objects.get_or_create(
                nombre_categoria=cat_data['nombre_categoria'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f"📁 Categoría creada: {categoria.nombre_categoria}")

    def crear_servicios_para_proveedor(self, proveedor, categorias, cantidad):
        """Crear servicios para un proveedor específico"""
        servicios_templates = [
            # Tecnología
            {
                'nombre_servicio': 'Desarrollo Web Personalizado',
                'descripcion': 'Desarrollo de sitios web modernos y responsivos usando las últimas tecnologías. Incluye diseño UX/UI, desarrollo frontend y backend, optimización SEO y hosting.',
                'precio_base': Decimal(str(random.randint(800000, 2500000))),
                'categoria_preferida': 'Tecnología'
            },
            {
                'nombre_servicio': 'Consultoría en Transformación Digital',
                'descripcion': 'Asesoría especializada para empresas que buscan digitalizar sus procesos. Análisis de necesidades, implementación de soluciones tecnológicas y capacitación del personal.',
                'precio_base': Decimal(str(random.randint(1200000, 3000000))),
                'categoria_preferida': 'Consultoría'
            },
            {
                'nombre_servicio': 'Aplicaciones Móviles Nativas',
                'descripcion': 'Desarrollo de aplicaciones móviles para Android e iOS con funcionalidades avanzadas, integración con APIs y diseño intuitivo.',
                'precio_base': Decimal(str(random.randint(1500000, 4000000))),
                'categoria_preferida': 'Tecnología'
            },
            {
                'nombre_servicio': 'Cursos de Programación Online',
                'descripcion': 'Formación personalizada en programación web, móvil y de escritorio. Incluye ejercicios prácticos, proyectos reales y certificación.',
                'precio_base': Decimal(str(random.randint(300000, 800000))),
                'categoria_preferida': 'Educación'
            },
            {
                'nombre_servicio': 'Diseño de Identidad Corporativa',
                'descripcion': 'Creación completa de identidad visual para empresas: logo, paleta de colores, tipografía, papelería y manual de marca.',
                'precio_base': Decimal(str(random.randint(600000, 1500000))),
                'categoria_preferida': 'Diseño'
            },
            {
                'nombre_servicio': 'Mantenimiento de Sistemas Informáticos',
                'descripcion': 'Soporte técnico preventivo y correctivo para equipos de cómputo, redes y servidores. Incluye diagnóstico, reparación y optimización.',
                'precio_base': Decimal(str(random.randint(200000, 600000))),
                'categoria_preferida': 'Tecnología'
            },
            {
                'nombre_servicio': 'Marketing Digital y SEO',
                'descripcion': 'Estrategias integrales de marketing digital: gestión de redes sociales, campañas publicitarias, posicionamiento SEO y análisis de métricas.',
                'precio_base': Decimal(str(random.randint(500000, 1800000))),
                'categoria_preferida': 'Consultoría'
            },
            {
                'nombre_servicio': 'Instalación de Redes y Cableado',
                'descripcion': 'Instalación y configuración de redes empresariales, cableado estructurado, WiFi empresarial y sistemas de seguridad informática.',
                'precio_base': Decimal(str(random.randint(400000, 1200000))),
                'categoria_preferida': 'Tecnología'
            },
            {
                'nombre_servicio': 'Diseño Gráfico y Publicitario',
                'descripcion': 'Creación de material publicitario impreso y digital: brochures, catálogos, banners, posts para redes sociales y presentaciones corporativas.',
                'precio_base': Decimal(str(random.randint(250000, 800000))),
                'categoria_preferida': 'Diseño'
            },
            {
                'nombre_servicio': 'Automatización de Procesos',
                'descripcion': 'Implementación de soluciones de automatización para optimizar procesos empresariales usando RPA, integración de sistemas y flujos de trabajo.',
                'precio_base': Decimal(str(random.randint(1000000, 2800000))),
                'categoria_preferida': 'Consultoría'
            },
            {
                'nombre_servicio': 'Clases Particulares de Matemáticas',
                'descripcion': 'Tutoría personalizada en matemáticas para estudiantes de primaria, secundaria y universidad. Metodología adaptada a cada estudiante.',
                'precio_base': Decimal(str(random.randint(80000, 200000))),
                'categoria_preferida': 'Educación'
            },
            {
                'nombre_servicio': 'Terapia Psicológica Individual',
                'descripcion': 'Sesiones de terapia psicológica para adultos, enfoque cognitivo-conductual, manejo de ansiedad, depresión y desarrollo personal.',
                'precio_base': Decimal(str(random.randint(150000, 300000))),
                'categoria_preferida': 'Salud'
            },
            {
                'nombre_servicio': 'Reparación de Electrodomésticos',
                'descripcion': 'Servicio técnico especializado en reparación de electrodomésticos de línea blanca y pequeños electrodomésticos. Diagnóstico gratuito.',
                'precio_base': Decimal(str(random.randint(80000, 250000))),
                'categoria_preferida': 'Hogar'
            },
            {
                'nombre_servicio': 'Fotografía de Eventos',
                'descripcion': 'Cobertura fotográfica profesional para eventos sociales y corporativos. Incluye edición digital y entrega en alta resolución.',
                'precio_base': Decimal(str(random.randint(400000, 1200000))),
                'categoria_preferida': 'Diseño'
            },
            {
                'nombre_servicio': 'Coaching Empresarial',
                'descripcion': 'Coaching ejecutivo y empresarial para desarrollo de liderazgo, gestión de equipos y mejora de productividad organizacional.',
                'precio_base': Decimal(str(random.randint(300000, 900000))),
                'categoria_preferida': 'Consultoría'
            }
        ]
        
        servicios_creados = 0
        servicios_disponibles = servicios_templates.copy()
        random.shuffle(servicios_disponibles)
        
        for i in range(min(cantidad, len(servicios_disponibles))):
            template = servicios_disponibles[i]
            
            # Buscar categoría preferida o usar una aleatoria
            try:
                categoria = categorias.filter(
                    nombre_categoria__icontains=template['categoria_preferida']
                ).first()
                if not categoria:
                    categoria = random.choice(categorias)
            except:
                categoria = random.choice(categorias)
            
            # Personalizar el nombre del servicio para evitar duplicados
            nombre_base = template['nombre_servicio']
            sufijos = ['', ' Premium', ' Express', ' Plus', ' Pro', ' Avanzado', ' Básico']
            nombre_final = nombre_base + random.choice(sufijos)
            
            # Verificar si ya existe el servicio
            if Servicios.objects.filter(
                nombre_servicio=nombre_final, 
                proveedor=proveedor
            ).exists():
                nombre_final = f"{nombre_base} - {random.randint(1, 999)}"
            
            # Crear el servicio
            servicio = Servicios.objects.create(
                nombre_servicio=nombre_final,
                descripcion=template['descripcion'],
                precio_base=template['precio_base'],
                categoria=categoria,
                proveedor=proveedor,
                activo=True,
                destacado=random.choice([True, False, False, False]),  # 25% destacados
                ubicacion=proveedor.direccion,
                views=random.randint(0, 100)
            )
            
            servicios_creados += 1
            self.stdout.write(f"   📦 {servicio.nombre_servicio} - ${servicio.precio_base:,.0f}")
        
        return servicios_creados