from django.core.management.base import BaseCommand
from proximidad_app.models import Usuario


class Command(BaseCommand):
    help = 'Elimina un usuario por su email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email del usuario a eliminar')

    def handle(self, *args, **options):
        email = options['email']
        
        try:
            usuario = Usuario.objects.get(correo_electronico=email)
            nombre = usuario.nombre_completo
            self.stdout.write(f'Usuario encontrado: {nombre} ({email})')
            usuario.delete()
            self.stdout.write(self.style.SUCCESS(f'✅ Usuario eliminado exitosamente'))
        except Usuario.DoesNotExist:
            self.stdout.write(self.style.WARNING(f'⚠ Usuario no encontrado: {email}'))
            self.stdout.write('\nUsuarios existentes:')
            for u in Usuario.objects.all():
                self.stdout.write(f'  - {u.correo_electronico} ({u.nombre_completo})')
