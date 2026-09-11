import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import anthropic

from app.core.database import get_db
from app.agents.tools import (
    get_products,
    get_business_information,
    check_product_availability,
    calculate_order_total,
    get_customer_history,
    send_notification,
    book_appointment,
    cancel_appointment,
    create_order,
    get_order_status,
    create_invoice,
)
from app.models.business import Business
from app.schemas.agent import ChatRequest, ChatResponse

load_dotenv()

router = APIRouter(prefix="/agent", tags=["agent"])

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

TOOLS = [
    {
        "name": "get_business_information",
        "description": "Get basic information about this business, such as its name and type.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "check_product_availability",
        "description": "Check whether a specific product/service is currently available, and get its price.",
        "input_schema": {
            "type": "object",
            "properties": {"product_name": {"type": "string"}},
            "required": ["product_name"],
        },
    },
    {
        "name": "calculate_order_total",
        "description": "Calculate the total cost for one or more products/services, given quantities.",
        "input_schema": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "product_name": {"type": "string"},
                            "quantity": {"type": "integer"},
                        },
                        "required": ["product_name", "quantity"],
                    },
                },
            },
            "required": ["items"],
        },
    },
    {
        "name": "get_customer_history",
        "description": "Look up a returning customer's past orders and appointments using their phone number.",
        "input_schema": {
            "type": "object",
            "properties": {"customer_phone": {"type": "string"}},
            "required": ["customer_phone"],
        },
    },
    {
        "name": "send_notification",
        "description": "Send a notification to the business owner about something important. Note: new orders and appointments already trigger notifications automatically.",
        "input_schema": {
            "type": "object",
            "properties": {"message": {"type": "string"}},
            "required": ["message"],
        },
    },
    {
        "name": "book_appointment",
        "description": "Book an appointment for a customer for a specific service at a specific date and time. Only call this once you have the customer's name, phone number, the service they want, and a specific date/time.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_name": {"type": "string"},
                "customer_phone": {"type": "string"},
                "service": {"type": "string"},
                "scheduled_at": {
                    "type": "string",
                    "description": "ISO 8601 format, e.g. 2026-09-15T14:00:00",
                },
            },
            "required": ["customer_name", "customer_phone", "service", "scheduled_at"],
        },
    },
    {
        "name": "cancel_appointment",
        "description": "Cancel an existing appointment. Requires the appointment ID.",
        "input_schema": {
            "type": "object",
            "properties": {"appointment_id": {"type": "string"}},
            "required": ["appointment_id"],
        },
    },
    {
        "name": "create_order",
        "description": "Create an order for a customer for a specific product/service from the catalog.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_name": {"type": "string"},
                "customer_phone": {"type": "string"},
                "product_name": {"type": "string"},
            },
            "required": ["customer_name", "customer_phone", "product_name"],
        },
    },
    {
        "name": "get_order_status",
        "description": "Check the status of an existing order. Requires the order ID.",
        "input_schema": {
            "type": "object",
            "properties": {"order_id": {"type": "string"}},
            "required": ["order_id"],
        },
    },
    {
        "name": "create_invoice",
        "description": "Create an invoice for an existing order. Only call this if the customer explicitly asks for one.",
        "input_schema": {
            "type": "object",
            "properties": {"order_id": {"type": "string"}},
            "required": ["order_id"],
        },
    },
]

TOOL_FUNCTIONS = {
    "get_business_information": get_business_information,
    "check_product_availability": check_product_availability,
    "calculate_order_total": calculate_order_total,
    "get_customer_history": get_customer_history,
    "send_notification": send_notification,
    "book_appointment": book_appointment,
    "cancel_appointment": cancel_appointment,
    "create_order": create_order,
    "get_order_status": get_order_status,
    "create_invoice": create_invoice,
}


def run_agent(db: Session, business_id, message: str, history: list[dict] | None = None) -> str:
    business = db.query(Business).filter(Business.id == business_id).first()
    business_name = business.name if business else "the business"

    products = get_products(db, business_id)
    if products:
        catalog_text = "\n".join(
            f"- {p['name']}: {p['description'] or 'No description'} (GHS {p['price']})"
            for p in products
        )
    else:
        catalog_text = "No products or services are currently listed."

    system_prompt = f"""You are a helpful AI assistant for {business_name}, a business using Zento AI.
You help customers with questions, check product availability, calculate totals, book appointments, place orders, cancel appointments, check order status, create invoices, and look up returning customers.
Be friendly, concise, and professional.

Here is the current catalog for {business_name}:
{catalog_text}

Rules:
- Before booking an appointment, collect: name, phone, service, date/time.
- Before creating an order, collect: name, phone, and the exact product name from the catalog.
- If a customer wants multiple items or quantities, use calculate_order_total first to confirm the total before creating the order.
- To cancel an appointment or check an order status, ask the customer for the ID if they haven't given it.
- Only create an invoice if the customer explicitly asks for one, and only for an existing order.
- If a customer mentions being a returning customer, you may look up their history using their phone number.
- Never make up information that isn't in the catalog above."""

    messages = list(history) if history else []
    messages.append({"role": "user", "content": message})

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=500,
        system=system_prompt,
        tools=TOOLS,
        messages=messages,
    )

    while response.stop_reason == "tool_use":
        tool_use_block = next(b for b in response.content if b.type == "tool_use")
        tool_function = TOOL_FUNCTIONS.get(tool_use_block.name)

        if tool_function:
            result = tool_function(db=db, business_id=business_id, **tool_use_block.input)
        else:
            result = {"success": False, "error": "Unknown tool"}

        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_block.id,
                    "content": json.dumps(result),
                }
            ],
        })

        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=500,
            system=system_prompt,
            tools=TOOLS,
            messages=messages,
        )

    return next(b.text for b in response.content if b.type == "text")


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    history = [{"role": m.role, "content": m.content} for m in request.history]
    reply_text = run_agent(db, request.business_id, request.message, history)
    return ChatResponse(reply=reply_text)