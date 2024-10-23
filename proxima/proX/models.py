from django.db import models

class Usuario(models.Model):
    id = models.BigAutoField(primary_key=True)  
    nombre_completo = models.CharField(max_length=100)
    correo_electronico = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=200)
    cedula = models.CharField(max_length=100)
    codigo_verificacion = models.IntegerField()
    tipo_usuario = models.CharField(max_length=50, choices=[
        ('proveedor', 'Proveedor'),
        ('arrendador', 'Arrendador')
    ])

    class Meta:
        app_label = 'proX'
        db_table = 'usuario' 
        managed = False  

    def __str__(self):
        return self.nombre_completo
