"""
Configuración de Gunicorn para ProXimidad Backend
"""
import multiprocessing
import os

# Dirección y puerto donde escuchará Gunicorn
bind = "127.0.0.1:8000"

# Número de workers (procesos)
# Recomendación: (2 x núcleos CPU) + 1
# Para Raspberry Pi, ajusta según tu modelo (2-4 workers típicamente)
workers = multiprocessing.cpu_count() * 2 + 1
# Si tu Raspberry es antigua (Pi 3 o menor), usa: workers = 2

# Tipo de worker
worker_class = "sync"

# Timeout en segundos (aumenta si tienes operaciones lentas)
timeout = 120

# Número máximo de requests por worker antes de reiniciarlo
max_requests = 1000
max_requests_jitter = 50

# Nivel de logging
loglevel = "info"

# Archivos de log
accesslog = "-"  # Log a stdout
errorlog = "-"   # Log a stderr

# Para producción, puedes usar archivos:
# accesslog = "/var/log/gunicorn/proximidad_access.log"
# errorlog = "/var/log/gunicorn/proximidad_error.log"

# Daemon mode (no recomendado, mejor usar systemd)
daemon = False

# Usuario y grupo (opcional, para mayor seguridad)
# user = "www-data"
# group = "www-data"

# PID file
pidfile = "/tmp/gunicorn_proximidad.pid"

# Preload de la aplicación
preload_app = True

# Keep-alive
keepalive = 5
