"""
Script para poblar la base de datos con servicios profesionales reales
"""
import django
import os
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from proximidad_app.models import Servicios, Usuario, Categoria

# Servicios profesionales por categoría
servicios_data = [
    # Tecnología
    {
        'categoria_id': 1,
        'nombre': 'Desarrollo de Aplicaciones Web',
        'descripcion': 'Desarrollo de aplicaciones web modernas y responsivas con React, Vue o Angular. Incluye diseño UI/UX, backend API REST, base de datos y deployment. Experiencia en e-commerce, dashboards y sistemas administrativos.',
        'precio': '2500.00',
        'ubicacion': 'Ciudad de México'
    },
    {
        'categoria_id': 1,
        'nombre': 'Reparación de Computadoras y Laptops',
        'descripcion': 'Servicio técnico especializado en reparación de hardware y software. Cambio de piezas, limpieza de virus, instalación de sistemas operativos, recuperación de datos y optimización de rendimiento. Atención a domicilio.',
        'precio': '350.00',
        'ubicacion': 'Guadalajara'
    },
    {
        'categoria_id': 1,
        'nombre': 'Soporte Técnico IT para Empresas',
        'descripcion': 'Soporte técnico integral para pequeñas y medianas empresas. Mantenimiento de servidores, redes, configuración de equipos, respaldos automáticos y monitoreo 24/7. Planes mensuales personalizados.',
        'precio': '5000.00',
        'ubicacion': 'Monterrey'
    },
    
    # Educación
    {
        'categoria_id': 2,
        'nombre': 'Clases de Inglés Personalizadas',
        'descripcion': 'Clases de inglés uno a uno o grupales con profesor certificado TOEFL. Enfoque en conversación, gramática y preparación para exámenes. Material incluido. Clases presenciales u online.',
        'precio': '250.00',
        'ubicacion': 'Puebla'
    },
    {
        'categoria_id': 2,
        'nombre': 'Tutorías de Matemáticas y Física',
        'descripcion': 'Asesorías académicas para estudiantes de secundaria y preparatoria. Explicaciones claras, ejercicios prácticos y preparación para exámenes. Ingeniero con 5 años de experiencia docente.',
        'precio': '200.00',
        'ubicacion': 'Querétaro'
    },
    
    # Consultoría
    {
        'categoria_id': 3,
        'nombre': 'Asesoría Contable y Fiscal',
        'descripcion': 'Servicios contables para personas físicas y morales. Declaraciones mensuales y anuales, facturación electrónica, nóminas y auditorías. Contador público certificado con 10 años de experiencia.',
        'precio': '3000.00',
        'ubicacion': 'Ciudad de México'
    },
    {
        'categoria_id': 3,
        'nombre': 'Consultoría Legal Empresarial',
        'descripcion': 'Asesoría jurídica integral para empresas. Constitución de sociedades, contratos comerciales, propiedad intelectual y litigios mercantiles. Abogado titulado con maestría en derecho corporativo.',
        'precio': '4500.00',
        'ubicacion': 'Monterrey'
    },
    
    # Diseño
    {
        'categoria_id': 4,
        'nombre': 'Diseño de Logotipos e Identidad Corporativa',
        'descripcion': 'Creación de logotipos profesionales, manual de marca, papelería corporativa y aplicaciones digitales. Incluye 3 propuestas, revisiones ilimitadas y archivos vectoriales editables.',
        'precio': '1800.00',
        'ubicacion': 'Guadalajara'
    },
    {
        'categoria_id': 4,
        'nombre': 'Diseño Web UI/UX',
        'descripcion': 'Diseño de interfaces modernas y funcionales para sitios web y aplicaciones móviles. Wireframes, prototipos interactivos, diseño responsive y entrega en Figma/Adobe XD.',
        'precio': '2200.00',
        'ubicacion': 'Ciudad de México'
    },
    
    # Fotografía
    {
        'categoria_id': 5,
        'nombre': 'Fotografía de Eventos Sociales',
        'descripcion': 'Cobertura fotográfica profesional para bodas, XV años, bautizos y eventos corporativos. Incluye sesión completa, 300+ fotos editadas, álbum digital y entrega en USB. Equipo profesional Canon.',
        'precio': '4000.00',
        'ubicacion': 'Puebla'
    },
    {
        'categoria_id': 5,
        'nombre': 'Sesiones Fotográficas Profesionales',
        'descripcion': 'Sesiones de fotos para perfiles, books, productos y redes sociales. Estudio con iluminación profesional, 2 cambios de outfit, 50 fotos retocadas. Resultados en 48 horas.',
        'precio': '800.00',
        'ubicacion': 'Querétaro'
    },
    
    # Reparación
    {
        'categoria_id': 6,
        'nombre': 'Reparación de Electrodomésticos',
        'descripcion': 'Servicio técnico especializado en lavadoras, refrigeradores, estufas y microondas de todas las marcas. Diagnóstico gratuito, garantía de 3 meses y piezas originales. Atención a domicilio.',
        'precio': '400.00',
        'ubicacion': 'Guadalajara'
    },
    {
        'categoria_id': 6,
        'nombre': 'Plomería Profesional',
        'descripcion': 'Instalación y reparación de tuberías, llaves, WC, calentadores y drenajes. Destapado de cañerías, detección de fugas y trabajos de emergencia 24/7. 15 años de experiencia.',
        'precio': '450.00',
        'ubicacion': 'Monterrey'
    },
    {
        'categoria_id': 6,
        'nombre': 'Electricista Residencial',
        'descripcion': 'Instalaciones eléctricas, reparación de cortos circuitos, cambio de tableros, instalación de contactos y lámparas. Certificado por la CFE, trabajo garantizado y seguro.',
        'precio': '500.00',
        'ubicacion': 'Ciudad de México'
    },
    
    # Salud y Bienestar
    {
        'categoria_id': 7,
        'nombre': 'Terapia Psicológica Individual',
        'descripcion': 'Sesiones de psicoterapia para ansiedad, depresión, estrés y desarrollo personal. Psicóloga clínica con enfoque cognitivo-conductual. Sesiones de 50 minutos, presencial u online.',
        'precio': '600.00',
        'ubicacion': 'Ciudad de México'
    },
    {
        'categoria_id': 7,
        'nombre': 'Masaje Terapéutico y Relajante',
        'descripcion': 'Masajes especializados para alivio de tensión muscular, estrés y dolores crónicos. Técnicas de masaje sueco, deportivo y de tejido profundo. Terapeuta certificado con 8 años de experiencia.',
        'precio': '550.00',
        'ubicacion': 'Guadalajara'
    },
    
    # Hogar y Jardinería
    {
        'categoria_id': 9,
        'nombre': 'Limpieza Profunda de Hogar',
        'descripcion': 'Servicio de limpieza profunda para casas y departamentos. Incluye baños, cocina, recámaras, ventanas y áreas comunes. Equipo profesional, productos biodegradables. Equipo de 2-3 personas.',
        'precio': '800.00',
        'ubicacion': 'Puebla'
    },
    {
        'categoria_id': 9,
        'nombre': 'Jardinería y Mantenimiento de Áreas Verdes',
        'descripcion': 'Poda de árboles y arbustos, diseño de jardines, sistema de riego, fertilización y control de plagas. Servicio mensual o por evento. Herramientas profesionales incluidas.',
        'precio': '650.00',
        'ubicacion': 'Querétaro'
    },
    {
        'categoria_id': 9,
        'nombre': 'Carpintería y Muebles a Medida',
        'descripcion': 'Fabricación de muebles personalizados: closets, cocinas integrales, libreros y escritorios. Restauración de muebles antiguos. Madera de calidad, acabados profesionales y diseño 3D incluido.',
        'precio': '5500.00',
        'ubicacion': 'Monterrey'
    },
    
    # Deportes y Fitness
    {
        'categoria_id': 10,
        'nombre': 'Entrenamiento Personal',
        'descripcion': 'Planes de entrenamiento personalizados para pérdida de peso, ganancia muscular o acondicionamiento físico. Incluye rutinas, seguimiento nutricional y motivación constante. Entrenador certificado.',
        'precio': '1200.00',
        'ubicacion': 'Ciudad de México'
    },
    
    # Eventos
    {
        'categoria_id': 11,
        'nombre': 'Organización de Eventos Corporativos',
        'descripcion': 'Planeación y coordinación completa de eventos empresariales, conferencias y team building. Incluye logística, catering, decoración, audio y coordinación el día del evento.',
        'precio': '15000.00',
        'ubicacion': 'Ciudad de México'
    },
    {
        'categoria_id': 11,
        'nombre': 'Catering para Eventos',
        'descripcion': 'Servicio de banquetes para todo tipo de eventos. Menús personalizados, desde 20 hasta 500 personas. Montaje de buffet o servicio a la mesa. Chef profesional con especialidad en cocina mexicana e internacional.',
        'precio': '350.00',
        'ubicacion': 'Guadalajara'
    },
    
    # Transporte
    {
        'categoria_id': 12,
        'nombre': 'Mudanzas Locales y Foráneas',
        'descripcion': 'Servicio profesional de mudanzas con personal capacitado. Embalaje, carga, transporte y descarga. Seguro de mercancía, cajas y materiales incluidos. Camiones de diferentes tamaños.',
        'precio': '2500.00',
        'ubicacion': 'Monterrey'
    },
    {
        'categoria_id': 12,
        'nombre': 'Mensajería Express',
        'descripcion': 'Entrega de paquetes y documentos el mismo día dentro de la zona metropolitana. Servicio de mensajería rápida y confiable con rastreo en tiempo real. Disponible 7 días a la semana.',
        'precio': '150.00',
        'ubicacion': 'Ciudad de México'
    },
    
    # Belleza
    {
        'categoria_id': 13,
        'nombre': 'Corte y Peinado Profesional',
        'descripcion': 'Servicio de estilismo profesional: corte, tinte, mechas, alaciado, tratamientos capilares. Productos de alta calidad L\'Oréal y Kerastase. Estilista con 12 años de experiencia.',
        'precio': '400.00',
        'ubicacion': 'Puebla'
    },
    {
        'categoria_id': 13,
        'nombre': 'Maquillaje Profesional',
        'descripcion': 'Maquillaje para eventos sociales, bodas, sesiones fotográficas y producciones. Incluye prueba previa, maquillaje del día y retoque. Productos MAC y Urban Decay.',
        'precio': '800.00',
        'ubicacion': 'Guadalajara'
    },
    
    # Música y Arte
    {
        'categoria_id': 14,
        'nombre': 'Clases de Guitarra',
        'descripcion': 'Clases personalizadas de guitarra acústica y eléctrica para principiantes e intermedios. Aprende acordes, ritmos, teoría musical y tus canciones favoritas. Guitarrista profesional con 10 años enseñando.',
        'precio': '300.00',
        'ubicacion': 'Querétaro'
    },
    {
        'categoria_id': 14,
        'nombre': 'Producción Musical',
        'descripcion': 'Grabación, mezcla y masterización de canciones en estudio profesional. Producción de beats, arreglos musicales y post-producción. Ingeniero de audio con equipamiento de alta gama.',
        'precio': '3500.00',
        'ubicacion': 'Ciudad de México'
    },
    
    # Mascotas
    {
        'categoria_id': 15,
        'nombre': 'Veterinaria a Domicilio',
        'descripcion': 'Consultas veterinarias, vacunación, desparasitación y atención de urgencias en la comodidad de tu hogar. Médico veterinario titulado con 8 años de experiencia. Equipo portátil completo.',
        'precio': '450.00',
        'ubicacion': 'Monterrey'
    },
    {
        'categoria_id': 15,
        'nombre': 'Estética Canina Profesional',
        'descripcion': 'Baño, corte, cepillado, corte de uñas y limpieza de oídos para perros de todas las razas. Productos hipoalergénicos, trato amoroso y ambiente tranquilo. Estética con 5 años de experiencia.',
        'precio': '350.00',
        'ubicacion': 'Guadalajara'
    },
]

print("=== Poblando base de datos con servicios profesionales ===\n")

# Obtener un proveedor existente o usar el primero disponible
try:
    proveedor = Usuario.objects.filter(tipo_usuario='proveedor').first()
    if not proveedor:
        print("⚠ No hay proveedores en la base de datos. Creando uno...")
        proveedor = Usuario.objects.create(
            nombre_completo='Proveedor de Servicios',
            correo_electronico='servicios@proximidad.com',
            telefono='5555555555',
            cedula='000000000',
            direccion='Ciudad de México',
            tipo_usuario='proveedor',
            activo=True
        )
    
    print(f"Usando proveedor: {proveedor.nombre_completo} (ID: {proveedor.id})\n")
    
    creados = 0
    errores = 0
    
    for servicio_data in servicios_data:
        try:
            # Verificar si ya existe un servicio con el mismo nombre
            existe = Servicios.objects.filter(nombre_servicio=servicio_data['nombre']).exists()
            if existe:
                print(f"⊘ Servicio ya existe: {servicio_data['nombre']}")
                continue
            
            # Obtener la categoría
            categoria = Categoria.objects.get(categoria_id=servicio_data['categoria_id'])
            
            # Crear el servicio
            servicio = Servicios.objects.create(
                nombre_servicio=servicio_data['nombre'],
                descripcion=servicio_data['descripcion'],
                precio_base=Decimal(servicio_data['precio']),
                ubicacion=servicio_data['ubicacion'],
                categoria=categoria,
                proveedor=proveedor,
                activo=True,
                destacado=False,
                views=0
            )
            
            creados += 1
            print(f"✓ Creado: {servicio_data['nombre']} (${servicio_data['precio']}) - {categoria.nombre_categoria}")
            
        except Categoria.DoesNotExist:
            print(f"✗ Categoría {servicio_data['categoria_id']} no existe para: {servicio_data['nombre']}")
            errores += 1
        except Exception as e:
            print(f"✗ Error al crear {servicio_data['nombre']}: {str(e)}")
            errores += 1
    
    print(f"\n=== Resumen ===")
    print(f"✓ Servicios creados: {creados}")
    print(f"✗ Errores: {errores}")
    print(f"Total en BD: {Servicios.objects.count()} servicios")
    
except Exception as e:
    print(f"Error general: {str(e)}")
