from django.db import models


class Categoria(models.Model):
    categoria_id = models.BigAutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)
    descripcion_categoria = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categoria'
        
    def __str__(self):
        return self.nombre_categoria


class Usuario(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100)
    correo_electronico = models.CharField(max_length=100, unique=True)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=200)
    cedula = models.CharField(max_length=100)
    codigo_verificacion = models.IntegerField()
    tipo_usuario = models.CharField(max_length=50)  # 'proveedor' o 'arrendador'
    imagen = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'usuario'
        
    def __str__(self):
        return self.nombre_completo


class Servicios(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_servicio = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    imagen_url = models.CharField(max_length=255, blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, db_column='categoria_id', blank=True, null=True)
    proveedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='proveedor_id', blank=True, null=True)

    class Meta:
        db_table = 'servicios'
        
    def __str__(self):
        return self.nombre_servicio


class Comentarios(models.Model):
    comentario_id = models.BigAutoField(primary_key=True)
    mensaje = models.TextField()
    servicio_fk = models.ForeignKey(Servicios, on_delete=models.CASCADE, db_column='servicio_fk')
    usuario_fk = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usuario_fk')

    class Meta:
        db_table = 'comentarios'
        
    def __str__(self):
        return f"Comentario de {self.usuario_fk.nombre_completo}"


class Favoritos(models.Model):
    id = models.BigAutoField(primary_key=True)
    favorito_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='favorito_id', related_name='favorito_usuario')
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usuario_id', related_name='usuario_favorito')

    class Meta:
        db_table = 'favoritos'
        unique_together = (('usuario_id', 'favorito_id'),)
        
    def __str__(self):
        return f"{self.usuario_id.nombre_completo} -> {self.favorito_id.nombre_completo}"