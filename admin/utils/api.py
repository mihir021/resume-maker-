import requests

BASE_URL = "http://127.0.0.1:5000/api/admin"

def get(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=5)
    r.raise_for_status()
    return r.json()
