import requests

BASE_URL = "http://localhost:6543/api"

order_data = {
    "user_id": 2,
    "total_amount": 43998,
    "status": "pending",
    "items": [
        {
            "menu_item_id": 4,
            "quantity": 2,
            "price": 21999
        }
    ]
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(f"{BASE_URL}/orders", json=order_data, headers=headers)
print("Status:", response.status_code)
print("Response:", response.json())

menu_id = order_data["items"][0]["menu_item_id"]
menu_response = requests.get(f"{BASE_URL}/menu/{menu_id}")
print("Menu after order:", menu_response.json())