from django.db import models

class Categoria(models.Model):
    categoria_id = models.BigAutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)
    descripcion_categoria = models.TextField(null=True, blank=True)

    class Meta:
        app_label = 'proX'
        db_table = 'categoria'
        managed = True

    def __str__(self):
        return self.nombre_categoria

class Usuario(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100)
    correo_electronico = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=200)
    cedula = models.CharField(max_length=100)
    codigo_verificacion = models.IntegerField()
    codigo_fecha_generacion = models.DateTimeField(null=True, blank=True)
    tipo_usuario = models.CharField(max_length=50, choices=[('proveedor', 'Proveedor'), ('arrendador', 'Arrendador')])

    class Meta:
        app_label = 'proX'
        db_table = 'usuario'
        managed = True

    def __str__(self):
        return self.nombre_completo

class Servicio(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_servicio = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    imagen_url = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        app_label = 'proX'
        db_table = 'servicios'
        managed = True

    def __str__(self):
        return self.nombre_servicio

class Favorito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='favoritos')
    favorito = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='es_favorito_de')

    class Meta:
        app_label = 'proX'
        db_table = 'favoritos'
        unique_together = ('usuario', 'favorito')

    def __str__(self):
        return f'{self.usuario.nombre_completo} -> {self.favorito.nombre_completo}'

class Comentario(models.Model):
    comentario_id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usuario_fk')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, db_column='servicio_fk')
    mensaje = models.TextField()

    class Meta:
        app_label = 'proX'
        db_table = 'comentarios'
        managed = True

    def __str__(self):
        return f'Comentario de {self.usuario.nombre_completo} sobre {self.servicio.nombre_servicio}'
