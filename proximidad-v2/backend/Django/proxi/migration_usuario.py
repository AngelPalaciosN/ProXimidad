# Script de migración para actualizar campo imagen en Usuario

"""
NOTA: Ejecutar los siguientes comandos para aplicar las migraciones:

1. Crear las migraciones:
   python manage.py makemigrations proxiApp

2. Aplicar las migraciones:
   python manage.py migrate

3. Si hay problemas con las migraciones, puedes aplicar manualmente en MySQL:
"""

# SQL manual para actualizar la tabla usuario (si es necesario):
sql_manual = """
-- Actualizar el campo imagen en la tabla usuario para ser compatible con ImageField
-- Solo ejecutar si las migraciones de Django no funcionan

-- La tabla ya debería estar bien configurada según el SQL actual
-- pero si necesitas verificar:
DESCRIBE usuario;

-- El campo imagen debería ser varchar(100) que es compatible con ImageField
-- Si por alguna razón no está, puedes ejecutar:
-- ALTER TABLE usuario MODIFY COLUMN imagen VARCHAR(100) DEFAULT NULL;
"""

print("Recuerda ejecutar:")
print("1. python manage.py makemigrations proxiApp")
print("2. python manage.py migrate")
print("3. python manage.py runserver")
print("\nEsto actualizará el modelo Usuario para usar ImageField correctamente.")