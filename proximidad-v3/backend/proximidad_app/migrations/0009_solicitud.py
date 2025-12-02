# Generated manually for Solicitud model
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proximidad_app', '0008_remove_favoritos_unique_usuario_favorito_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Solicitud',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('estado', models.CharField(
                    choices=[
                        ('pendiente', 'Pendiente'), 
                        ('aceptado', 'Aceptado'), 
                        ('en_proceso', 'En Proceso'), 
                        ('completado', 'Completado'), 
                        ('rechazado', 'Rechazado'), 
                        ('cancelado', 'Cancelado')
                    ], 
                    db_index=True, 
                    default='pendiente', 
                    max_length=20
                )),
                ('precio_acordado', models.DecimalField(
                    blank=True, 
                    decimal_places=2, 
                    help_text='Precio acordado entre cliente y proveedor', 
                    max_digits=10, 
                    null=True
                )),
                ('descripcion_personalizada', models.TextField(
                    help_text='Descripción detallada del proyecto solicitado por el cliente'
                )),
                ('urgencia', models.CharField(
                    choices=[('baja', 'Baja'), ('media', 'Media'), ('alta', 'Alta')], 
                    default='media', 
                    max_length=10
                )),
                ('fecha_preferida', models.DateField(
                    blank=True, 
                    help_text='Fecha preferida de inicio del proyecto', 
                    null=True
                )),
                ('presupuesto_maximo', models.DecimalField(
                    blank=True, 
                    decimal_places=2, 
                    help_text='Presupuesto máximo del cliente', 
                    max_digits=10, 
                    null=True
                )),
                ('comentarios_adicionales', models.TextField(
                    blank=True, 
                    help_text='Comentarios adicionales del cliente'
                )),
                ('respuesta_proveedor', models.TextField(
                    blank=True, 
                    help_text='Respuesta o propuesta del proveedor'
                )),
                ('fecha_respuesta', models.DateTimeField(
                    blank=True, 
                    help_text='Fecha en que el proveedor respondió', 
                    null=True
                )),
                ('fecha_solicitud', models.DateTimeField(
                    db_index=True, 
                    default=django.utils.timezone.now
                )),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('fecha_inicio', models.DateTimeField(
                    blank=True, 
                    help_text='Fecha de inicio del trabajo', 
                    null=True
                )),
                ('fecha_completado', models.DateTimeField(
                    blank=True, 
                    help_text='Fecha de finalización del trabajo', 
                    null=True
                )),
                ('notificado_cliente', models.BooleanField(
                    default=False, 
                    help_text='Email enviado al cliente'
                )),
                ('notificado_proveedor', models.BooleanField(
                    default=False, 
                    help_text='Email enviado al proveedor'
                )),
                ('cliente', models.ForeignKey(
                    db_column='cliente_id', 
                    on_delete=django.db.models.deletion.CASCADE, 
                    related_name='solicitudes_realizadas', 
                    to='proximidad_app.usuario'
                )),
                ('proveedor', models.ForeignKey(
                    db_column='proveedor_id', 
                    on_delete=django.db.models.deletion.CASCADE, 
                    related_name='solicitudes_recibidas', 
                    to='proximidad_app.usuario'
                )),
                ('servicio', models.ForeignKey(
                    db_column='servicio_id', 
                    on_delete=django.db.models.deletion.CASCADE, 
                    related_name='solicitudes', 
                    to='proximidad_app.servicios'
                )),
            ],
            options={
                'db_table': 'solicitudes',
                'ordering': ['-fecha_solicitud'],
                'indexes': [
                    models.Index(fields=['cliente', 'estado'], name='solicitudes_cliente_idx'),
                    models.Index(fields=['proveedor', 'estado'], name='solicitudes_proveedor_idx'),
                    models.Index(fields=['servicio'], name='solicitudes_servicio_idx'),
                    models.Index(fields=['estado', 'fecha_solicitud'], name='solicitudes_estado_fecha_idx'),
                    models.Index(fields=['fecha_solicitud'], name='solicitudes_fecha_idx'),
                ],
            },
        ),
    ]
