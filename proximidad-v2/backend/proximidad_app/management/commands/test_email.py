from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Prueba el envío de correos electrónicos'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email de destino')

    def handle(self, *args, **options):
        email_destino = options['email']
        
        self.stdout.write("="*60)
        self.stdout.write(self.style.SUCCESS('🧪 PRUEBA DE ENVIO DE EMAIL'))
        self.stdout.write("="*60)
        
        self.stdout.write(f"\n📧 Configuración actual:")
        self.stdout.write(f"   Backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"   Host: {settings.EMAIL_HOST}")
        self.stdout.write(f"   Puerto: {settings.EMAIL_PORT}")
        self.stdout.write(f"   TLS: {settings.EMAIL_USE_TLS}")
        self.stdout.write(f"   Usuario: {settings.EMAIL_HOST_USER}")
        self.stdout.write(f"   Password: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'NO CONFIGURADO'}")
        self.stdout.write(f"   From: {settings.DEFAULT_FROM_EMAIL}")
        
        self.stdout.write(f"\n📤 Enviando email de prueba a: {email_destino}")
        
        try:
            resultado = send_mail(
                'Prueba de Email - ProXimidad',
                'Este es un correo de prueba desde ProXimidad.\n\nSi recibes esto, la configuración funciona correctamente.',
                settings.EMAIL_HOST_USER,
                [email_destino],
                fail_silently=False,
            )
            
            self.stdout.write(self.style.SUCCESS(f'\n✅ Email enviado exitosamente!'))
            self.stdout.write(f'   Resultado: {resultado}')
            self.stdout.write(f'   Revisa la bandeja de {email_destino}')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error al enviar email:'))
            self.stdout.write(self.style.ERROR(f'   {type(e).__name__}: {str(e)}'))
            
            import traceback
            self.stdout.write('\n📋 Traceback:')
            traceback.print_exc()
        
        self.stdout.write("\n" + "="*60 + "\n")
