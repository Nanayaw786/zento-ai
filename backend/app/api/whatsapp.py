import os
import uuid
from fastapi import APIRouter, Request, Query, HTTPException, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.core.database import get_db
from app.api.agent import run_agent
from app.agents.whatsapp_client import send_whatsapp_message

load_dotenv()

router = APIRouter(prefix="/webhook", tags=["webhook"])

VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
LINKED_BUSINESS_ID = os.getenv("WHATSAPP_LINKED_BUSINESS_ID")


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

    try:
        entry = payload["entry"][0]
        change = entry["changes"][0]
        value = change["value"]
        messages = value.get("messages")

        if not messages:
            return {"status": "ignored"}

        message = messages[0]
        from_number = message["from"]
        message_text = message.get("text", {}).get("body", "")

        if not message_text:
            return {"status": "ignored"}

        reply_text = run_agent(
            db=db,
            business_id=uuid.UUID(LINKED_BUSINESS_ID),
            message=message_text,
        )

        send_whatsapp_message(to=from_number, message=reply_text)

    except (KeyError, IndexError):
        pass

    return {"status": "received"}