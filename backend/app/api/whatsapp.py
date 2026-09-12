import os
import uuid
from fastapi import APIRouter, Request, Query, HTTPException, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.core.database import get_db
from app.api.agent import run_agent
from app.agents.whatsapp_client import send_whatsapp_message
from app.models.business import Business

load_dotenv()

router = APIRouter(prefix="/webhook", tags=["webhook"])

VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")


@router.get("/whatsapp")
def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return PlainTextResponse(content=hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/whatsapp")
async def receive_message(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    print("=== WEBHOOK PAYLOAD RECEIVED ===", flush=True)
    print(payload, flush=True)

    try:
        entry = payload["entry"][0]
        change = entry["changes"][0]
        value = change["value"]
        messages = value.get("messages")

        if not messages:
            print("No 'messages' key found, ignoring.", flush=True)
            return {"status": "ignored"}

        receiving_phone_number_id = value["metadata"]["phone_number_id"]
        message = messages[0]
        from_number = message["from"]
        message_text = message.get("text", {}).get("body", "")

        print(f"Receiving number ID: {receiving_phone_number_id}", flush=True)
        print(f"From: {from_number}, Text: {message_text}", flush=True)

        if not message_text:
            print("Empty message text, ignoring.", flush=True)
            return {"status": "ignored"}

        business = db.query(Business).filter(
            Business.whatsapp_phone_number_id == receiving_phone_number_id
        ).first()

        if not business:
            print(f"No business found for phone_number_id {receiving_phone_number_id}, ignoring.", flush=True)
            return {"status": "no_business_found"}

        print(f"Routed to business: {business.name} ({business.id})", flush=True)

        reply_text = run_agent(
            db=db,
            business_id=business.id,
            message=message_text,
        )
        print(f"Agent reply: {reply_text}", flush=True)

        send_result = send_whatsapp_message(
            to=from_number,
            message=reply_text,
            from_phone_number_id=receiving_phone_number_id,
        )
        print(f"Send result: {send_result}", flush=True)

    except Exception as e:
        print(f"WEBHOOK ERROR: {type(e).__name__}: {e}", flush=True)

    return {"status": "received"}