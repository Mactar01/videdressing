import urllib.request
import json

url = 'http://localhost:8000/api/v1/auth/register'
data = json.dumps({
    "name": "Test User",
    "email": "test99@vdressing.fr",
    "password": "password",
    "phone": "+221779999999"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'Accept': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("Error:", e.code)
    print(e.read().decode())
