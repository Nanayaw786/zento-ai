import os
import httpx
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")


def send_whatsapp_message(to: str, message: str, from_phone_number_id: str) -> dict:
    url = f"https://graph.facebook.com/v21.0/{from_phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": message},
    }
    response = httpx.post(url, headers=headers, json=payload)
    return response.json()