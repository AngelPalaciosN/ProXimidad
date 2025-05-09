# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Categoria(models.Model):
    categoria_id = models.BigAutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)
    descripcion_categoria = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categoria'


class Comentarios(models.Model):
    comentario_id = models.BigAutoField(primary_key=True)
    mensaje = models.TextField()
    servicio_fk = models.ForeignKey('Servicios', models.DO_NOTHING, db_column='servicio_fk')
    usuario_fk = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='usuario_fk')

    class Meta:
        managed = False
        db_table = 'comentarios'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Favoritos(models.Model):
    id = models.BigAutoField(primary_key=True)
    favorito = models.ForeignKey('Usuario', models.DO_NOTHING)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING, related_name='favoritos_usuario_set')

    class Meta:
        managed = False
        db_table = 'favoritos'


class Servicios(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_servicio = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    imagen_url = models.CharField(max_length=255, blank=True, null=True)
    categoria = models.ForeignKey(Categoria, models.DO_NOTHING, blank=True, null=True)
    proveedor = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servicios'


class Usuario(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=100)
    correo_electronico = models.EmailField(unique=True, max_length=100)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=200)
    cedula = models.CharField(max_length=100)
    codigo_verificacion = models.IntegerField(blank=True, null=True)  # Make this optional
    
    TIPO_USUARIO_CHOICES = [
        ('admin', 'Administrador'),
        ('cliente', 'Cliente'),
        ('vendedor', 'Vendedor'),
        ('proveedor', 'Proveedor'),  # Add proveedor type
        ('arrendador', 'Arrendador'),  # Add arrendador type
    ]
    tipo_usuario = models.CharField(max_length=50, choices=TIPO_USUARIO_CHOICES)
    
    imagen = models.ImageField(upload_to='usuarios/', blank=True, null=True)

    def __str__(self):
        return self.nombre_completo  # Fixed from nombre_d to nombre_completo

    class Meta:
        managed = False
        db_table = 'usuario'