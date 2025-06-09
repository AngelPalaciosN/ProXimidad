from django.db import models

class usuarios (models.Model):
    id = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=50)
    correo_electronico = models.EmailField()
    telefono = models.BigIntegerField()
    direccion = models.CharField(max_length=50)
    cedula = models.BigIntegerField()
    codigo_verificacion = models.IntegerField(null=True)
    class tipos(models.TextChoices):
        PROVEEDOR = "Proveedor","Proveedor"
        ARRENDADOR = "Arrendador", "Arrendador"
    
    tipo_usuario = models.CharField(
        max_length=50, choices=tipos.choices, default=tipos.PROVEEDOR
    )

    def db_type(self, connection):
        return "ENUM('Proveedor', 'Arrendador)"


class categorias (models.Model):
    categoria_id = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=50)
    descripcion_categoria = models.TextField()


class servicios (models.Model):
    id = models.AutoField(primary_key=True)
    nombre_servicio = models.CharField(max_length=50)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.CharField(max_length=255)
    categoria = models.ForeignKey(categorias, on_delete=models.CASCADE)
    proveedor = models.ForeignKey(usuarios, on_delete=models.CASCADE)

    def get_categoria(self):
        return f"{self.categoria.nombre_categoria}: {self.categoria.descripcion_categoria}"
    
    def get_proveedor(self):
        return f"{self.proveedor.nombre_completo}"


class favoritos (models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(usuarios, on_delete=models.CASCADE)
    servicio = models.ForeignKey(servicios, on_delete=models.CASCADE)


class comentarios (models.Model):
    comentario_id = models.AutoField(primary_key=True)
    mensaje = models.TextField()
    servicio = models.ForeignKey(servicios, on_delete=models.CASCADE)
    usuario = models.ForeignKey(usuarios, on_delete=models.CASCADE)

    def get_servicio(self):
        return f"{self.servicio.nombre_servicio}"
    
    def get_usuario(self):
        return f"{self.usuario.nombre_completo}"