#!/bin/bash
# Build script for ProXimidad Backend

echo "🚀 Building ProXimidad Backend..."

# Activate virtual environment
echo "📦 Activating virtual environment..."
if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Windows activation
if [ "$OS" = "Windows_NT" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🔄 Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "📂 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if needed
echo "👤 Creating superuser..."
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@proximidad.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

echo "✅ Backend build completed!"
echo "🔗 Run: python manage.py runserver"
