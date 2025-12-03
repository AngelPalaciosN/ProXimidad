"""
WSGI config for ProXimidad App2 (Private API).

Exposes the WSGI callable as a module-level variable named ``application``.
Only includes proximidad_app2 routes.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ.setdefault('PROXIMIDAD_APP_MODE', 'app2')

application = get_wsgi_application()
