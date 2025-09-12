#!/usr/bin/env python3
import subprocess
import json

def test_endpoint():
    # Test POST request
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
        # Convert data to form format
        form_data = []
        for key, value in data.items():
            form_data.extend(['-F', f'{key}={value}'])
        
        # Execute curl command
        cmd = ['curl', '-X', 'POST'] + form_data + [url]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        
        print("Status code:", result.returncode)
        print("Output:", result.stdout)
        if result.stderr:
            print("Error:", result.stderr)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_endpoint()
