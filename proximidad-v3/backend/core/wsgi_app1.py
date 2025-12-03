"""
WSGI config for ProXimidad App1 (Public API).

Exposes the WSGI callable as a module-level variable named ``application``.
Only includes proximidad_app routes.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ.setdefault('PROXIMIDAD_APP_MODE', 'app1')

application = get_wsgi_application()
