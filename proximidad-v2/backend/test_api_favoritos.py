#!/usr/bin/env python
import requests
import json

BASE_URL = "http://192.168.0.100:8000/api"

def test_favoritos_api():
    print("🧪 Probando API de favoritos...")
    
    # Test 1: POST agregar favorito
    print("\n1. Probando POST /api/favoritos/")
    data = {
        'usuario_id': 1,
        'favorito_id': 2,
        'tipo': 'usuario'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/favoritos/", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: GET favoritos
    print("\n2. Probando GET /api/favoritos/1/?tipo=usuario")
    try:
        response = requests.get(f"{BASE_URL}/favoritos/1/?tipo=usuario")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_favoritos_api()