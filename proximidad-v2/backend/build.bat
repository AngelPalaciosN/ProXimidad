@echo off
REM Build script for ProXimidad Backend (Windows)

echo 🚀 Building ProXimidad Backend...

REM Create virtual environment
echo 📦 Creating virtual environment...
if not exist venv (
    python -m venv venv
)

REM Activate virtual environment
echo 📦 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Run migrations
echo 🔄 Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Collect static files
echo 📂 Collecting static files...
python manage.py collectstatic --noinput

REM Create superuser if needed
echo 👤 Creating superuser...
echo from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@proximidad.com', 'admin123') if not User.objects.filter(username='admin').exists() else None | python manage.py shell

echo ✅ Backend build completed!
echo 🔗 Run: python manage.py runserver
pause
