# Generated by Django 5.2.2 on 2025-06-09 01:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='categorias',
            fields=[
                ('categoria_id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_categoria', models.CharField(max_length=50)),
                ('descripcion_categoria', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='usuarios',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_completo', models.CharField(max_length=50)),
                ('correo_electronico', models.EmailField(max_length=254)),
                ('telefono', models.BigIntegerField()),
                ('direccion', models.CharField(max_length=50)),
                ('cedula', models.BigIntegerField()),
                ('codigo_verificacion', models.IntegerField(null=True)),
                ('tipo_usuario', models.CharField(choices=[('Proveedor', 'Proveedor'), ('Administrador', 'Administrador')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='servicios',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_servicio', models.CharField(max_length=50)),
                ('descripcion', models.TextField()),
                ('precio_base', models.DecimalField(decimal_places=2, max_digits=10)),
                ('image_url', models.CharField(max_length=255)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.categorias')),
                ('proveedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.usuarios')),
            ],
        ),
        migrations.CreateModel(
            name='favoritos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('servicio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.servicios')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.usuarios')),
            ],
        ),
        migrations.CreateModel(
            name='comentarios',
            fields=[
                ('comentario_id', models.AutoField(primary_key=True, serialize=False)),
                ('mensaje', models.TextField()),
                ('servicio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.servicios')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proxiApp.usuarios')),
            ],
        ),
    ]
