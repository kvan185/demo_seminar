import urllib.request
import json

url = "http://localhost:5000/predict"
data = json.dumps({"text": "this movie is absolutely amazing"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode('utf-8')
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {json.dumps(json.loads(res_data), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
