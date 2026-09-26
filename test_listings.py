import urllib.request
import json

url = 'http://localhost:8000/api/v1/listings'

try:
    with urllib.request.urlopen(url) as response:
        print("Status:", response.status)
        data = json.loads(response.read().decode())
        if 'data' in data:
            print("Total items:", len(data['data']))
        else:
            print("Total items:", len(data))
except urllib.error.HTTPError as e:
    print("Error:", e.code)
    print(e.read().decode())
