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
from app.models.customer import Customer
from app.models.conversation import Conversation
from app.core.usage_limits import check_and_increment_usage

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


def _get_or_create_customer(db: Session, business_id: uuid.UUID, phone: str, name: str = "WhatsApp Customer") -> Customer:
    customer = db.query(Customer).filter(
        Customer.business_id == business_id,
        Customer.phone == phone,
    ).first()
    if not customer:
        customer = Customer(business_id=business_id, name=name, phone=phone)
        db.add(customer)
        db.commit()
        db.refresh(customer)
    return customer


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
        sender_name = value.get("contacts", [{}])[0].get("profile", {}).get("name", "WhatsApp Customer")

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

        allowed, limit_message = check_and_increment_usage(db, business)
        if not allowed:
            print(f"Usage limit reached for {business.name}, sending upgrade message.", flush=True)
            send_whatsapp_message(
                to=from_number,
                message=limit_message,
                from_phone_number_id=receiving_phone_number_id,
            )
            return {"status": "limit_reached"}

        customer = _get_or_create_customer(db, business.id, from_number, sender_name)

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

        conversation_log = Conversation(
            business_id=business.id,
            customer_id=customer.id,
            last_message=f"Customer: {message_text}\nZento AI: {reply_text}",
            channel="WhatsApp",
        )
        db.add(conversation_log)
        db.commit()

    except Exception as e:
        print(f"WEBHOOK ERROR: {type(e).__name__}: {e}", flush=True)

    return {"status": "received"}