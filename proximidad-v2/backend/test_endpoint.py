import requests
import json

# Test the crear-usuario endpoint
url = "http://localhost:8000/api/crear-usuario/"

# Test data
data = {
    'nombre_completo': 'Test User',
    'correo_electronico': 'test@example.com',
    'telefono': '3123456789',
    'direccion': 'Test Address',
    'cedula': '12345678',
    'tipo_usuario': 'proveedor'
}

try:
    # Test GET request (should fail with 405)
    print("Testing GET request...")
    response = requests.get(url)
    print(f"GET Response: {response.status_code}")
    print(f"GET Response data: {response.text}")
except Exception as e:
    print(f"GET Error: {e}")

print("\n" + "="*50 + "\n")

try:
    # Test POST request (should work)
    print("Testing POST request...")
    response = requests.post(url, data=data)
    print(f"POST Response: {response.status_code}")
    print(f"POST Response data: {response.text}")
except Exception as e:
    print(f"POST Error: {e}")
