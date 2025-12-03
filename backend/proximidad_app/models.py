import uuid
import os
from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator


def upload_to_usuarios(instance, filename):
    """Genera un path único para las imágenes de usuarios"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('usuarios', filename)


def upload_to_servicios(instance, filename):
    """Genera un path único para las imágenes de servicios"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('servicios', filename)


class BaseModel(models.Model):
    """Modelo base abstracto con campos comunes"""
    created_at = models.DateTimeField('Fecha de creación', auto_now_add=True)
    updated_at = models.DateTimeField('Fecha de actualización', auto_now=True)
    is_active = models.BooleanField('Activo', default=True)

    class Meta:
        abstract = True


class Categoria(models.Model):
    categoria_id = models.BigAutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100, db_index=True)
    descripcion_categoria = models.TextField(blank=True, null=True)
    icono = models.CharField('Icono', max_length=50, blank=True, help_text='Clase CSS del icono')
    color = models.CharField('Color', max_length=7, default='#007bff', help_text='Color hexadecimal')
    orden = models.PositiveIntegerField('Orden', default=0)
    activo = models.BooleanField('Activo', default=True)

    class Meta:
        db_table = 'categoria'
        indexes = [
            models.Index(fields=['nombre_categoria']),
            models.Index(fields=['activo', 'orden']),
        ]
        ordering = ['orden', 'nombre_categoria']
        
    def __str__(self):
        return self.nombre_categoria


class Usuario(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100, db_index=True)
    correo_electronico = models.CharField(max_length=100, unique=True, db_index=True)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=200)
    cedula = models.CharField(max_length=100, unique=True, db_index=True)
    codigo_verificacion = models.IntegerField(null=True, blank=True, default=0)
    tipo_usuario = models.CharField(max_length=50)  # 'proveedor' o 'arrendador'
    imagen = models.ImageField(
        'Foto de perfil',
        upload_to=upload_to_usuarios,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
        help_text='Foto de perfil del usuario (aparece en círculo)'
    )
    banner = models.ImageField(
        'Banner de perfil',
        upload_to=upload_to_usuarios,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
        help_text='Imagen de banner para el fondo del perfil (1200x400 recomendado)'
    )
    fecha_registro = models.DateTimeField('Fecha de registro', default=timezone.now)
    ultima_actualizacion = models.DateTimeField('Última actualización', auto_now=True)
    activo = models.BooleanField('Activo', default=True)

    class Meta:
        db_table = 'usuario'
        indexes = [
            models.Index(fields=['correo_electronico']),
            models.Index(fields=['cedula']),
            models.Index(fields=['tipo_usuario']),
            models.Index(fields=['activo']),
            models.Index(fields=['fecha_registro']),
        ]
        
    def __str__(self):
        return self.nombre_completo

    @property
    def imagen_url(self):
        """URL de la imagen del usuario para el serializer"""
        if self.imagen:
            return self.imagen.url
        return None
    
    @property
    def banner_url(self):
        """URL del banner del usuario para el serializer"""
        if self.banner:
            return self.banner.url
        return None


class Servicios(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_servicio = models.CharField(max_length=100, db_index=True)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    imagen_url = models.CharField(max_length=255, blank=True, null=True)
    imagen = models.ImageField(
        upload_to=upload_to_servicios,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])]
    )
    activo = models.BooleanField(default=True, db_index=True)
    destacado = models.BooleanField('Destacado', default=False, db_index=True)
    views = models.PositiveIntegerField('Visualizaciones', default=0, db_index=True)
    ubicacion = models.CharField('Ubicación', max_length=200, blank=True)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        db_column='categoria_id',
        blank=True,
        null=True,
        related_name='servicios'
    )
    proveedor = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='proveedor_id',
        blank=True,
        null=True,
        related_name='servicios_ofrecidos'
    )
    fecha_creacion = models.DateTimeField(default=timezone.now, db_index=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'servicios'
        indexes = [
            models.Index(fields=['nombre_servicio']),
            models.Index(fields=['precio_base']),
            models.Index(fields=['activo', 'destacado']),
            models.Index(fields=['categoria', 'activo']),
            models.Index(fields=['proveedor', 'activo']),
            models.Index(fields=['views']),
            models.Index(fields=['fecha_creacion']),
        ]
        ordering = ['-fecha_creacion']
        
    def __str__(self):
        return self.nombre_servicio

    def increment_views(self):
        """Incrementa el contador de visualizaciones"""
        self.views = models.F('views') + 1
        self.save(update_fields=['views'])

    @property
    def proveedor_nombre(self):
        """Nombre del proveedor del servicio"""
        return self.proveedor.nombre_completo if self.proveedor else None

    @property
    def categoria_nombre(self):
        """Nombre de la categoría del servicio"""
        return self.categoria.nombre_categoria if self.categoria else None

    @property
    def imagen_completa_url(self):
        """URL completa de la imagen del servicio"""
        if self.imagen:
            return self.imagen.url
        elif self.imagen_url:
            return self.imagen_url
        return None


class Comentarios(models.Model):
    comentario_id = models.BigAutoField(primary_key=True)
    mensaje = models.TextField()
    calificacion = models.PositiveSmallIntegerField(
        'Calificación',
        choices=[(i, i) for i in range(1, 6)],
        null=True,
        blank=True,
        help_text='Calificación del 1 al 5'
    )
    servicio_fk = models.ForeignKey(
        Servicios,
        on_delete=models.CASCADE,
        db_column='servicio_fk',
        related_name='comentarios'
    )
    usuario_fk = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='usuario_fk',
        related_name='comentarios_realizados'
    )
    fecha_creacion = models.DateTimeField('Fecha de creación', default=timezone.now)
    activo = models.BooleanField('Activo', default=True)

    class Meta:
        db_table = 'comentarios'
        indexes = [
            models.Index(fields=['servicio_fk']),
            models.Index(fields=['usuario_fk']),
            models.Index(fields=['fecha_creacion']),
            models.Index(fields=['calificacion']),
            models.Index(fields=['activo']),
        ]
        ordering = ['-fecha_creacion']
        
    def __str__(self):
        return f"Comentario de {self.usuario_fk.nombre_completo}"


class Favoritos(models.Model):
    TIPO_FAVORITO_CHOICES = [
        ('usuario', 'Usuario'),
        ('servicio', 'Servicio'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    usuario_id = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='usuario_id',
        related_name='mis_favoritos'
    )
    # Para usuarios favoritos
    favorito_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        null=True, 
        blank=True,
        related_name='soy_favorito_de'
    )
    # Para servicios favoritos  
    favorito_servicio = models.ForeignKey(
        'Servicios',
        on_delete=models.CASCADE,
        null=True,
        blank=True, 
        related_name='favorito_en'
    )
    tipo_favorito = models.CharField(
        max_length=10, 
        choices=TIPO_FAVORITO_CHOICES,
        default='usuario'
    )
    fecha_agregado = models.DateTimeField('Fecha agregado', default=timezone.now)

    class Meta:
        db_table = 'favoritos'
        # ✅ COMPATIBLE CON MYSQL: Sin unique constraints con condiciones
        indexes = [
            models.Index(fields=['usuario_id', 'tipo_favorito']),
            models.Index(fields=['favorito_usuario']),
            models.Index(fields=['favorito_servicio']),
            models.Index(fields=['fecha_agregado']),
            # Índices compuestos para mejorar rendimiento
            models.Index(fields=['usuario_id', 'favorito_usuario']),
            models.Index(fields=['usuario_id', 'favorito_servicio']),
        ]
    
    def clean(self):
        """Validación personalizada"""
        from django.core.exceptions import ValidationError
        
        if self.tipo_favorito == 'usuario' and not self.favorito_usuario:
            raise ValidationError('Debe especificar el usuario favorito')
        elif self.tipo_favorito == 'servicio' and not self.favorito_servicio:
            raise ValidationError('Debe especificar el servicio favorito')
        
        if self.tipo_favorito == 'usuario' and self.favorito_servicio:
            raise ValidationError('No puede tener servicio y usuario favorito al mismo tiempo')
        elif self.tipo_favorito == 'servicio' and self.favorito_usuario:
            raise ValidationError('No puede tener usuario y servicio favorito al mismo tiempo')
            
        # No puede marcarse a sí mismo como favorito
        if self.tipo_favorito == 'usuario' and self.usuario_id == self.favorito_usuario:
            raise ValidationError('No puedes marcarte a ti mismo como favorito')
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        if self.tipo_favorito == 'usuario':
            return f"{self.usuario_id.nombre_completo} -> Usuario: {self.favorito_usuario.nombre_completo}"
        else:
            return f"{self.usuario_id.nombre_completo} -> Servicio: {self.favorito_servicio.nombre_servicio}"
    
    @property
    def favorito_nombre(self):
        """Obtiene el nombre del favorito independientemente del tipo"""
        if self.tipo_favorito == 'usuario':
            return self.favorito_usuario.nombre_completo if self.favorito_usuario else None
        else:
            return self.favorito_servicio.nombre_servicio if self.favorito_servicio else None