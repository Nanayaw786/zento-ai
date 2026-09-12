import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.customer import Customer
from app.models.appointment import Appointment
from app.models.order import Order
from app.models.invoice import Invoice
from app.models.business import Business
from app.models.notification import Notification
from app.agents.whatsapp_client import send_whatsapp_message


def get_products(db: Session, business_id: uuid.UUID) -> list[dict]:
    products = db.query(Product).filter(
        Product.business_id == business_id,
        Product.is_available == True,
    ).all()
    return [
        {"name": p.name, "description": p.description, "price": str(p.price)}
        for p in products
    ]


def get_business_information(db: Session, business_id: uuid.UUID) -> dict:
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return {"success": False, "error": "Business not found"}
    return {
        "success": True,
        "name": business.name,
        "business_type": business.business_type,
        "email": business.email,
    }


def check_product_availability(db: Session, business_id: uuid.UUID, product_name: str) -> dict:
    product = db.query(Product).filter(
        Product.business_id == business_id,
        Product.name.ilike(product_name),
    ).first()

    if not product:
        return {"success": False, "error": f"Product '{product_name}' not found"}

    return {
        "success": True,
        "name": product.name,
        "price": str(product.price),
        "is_available": product.is_available,
    }


def calculate_order_total(db: Session, business_id: uuid.UUID, items: list[dict]) -> dict:
    breakdown = []
    total = 0.0

    for item in items:
        product = db.query(Product).filter(
            Product.business_id == business_id,
            Product.name.ilike(item["product_name"]),
            Product.is_available == True,
        ).first()

        if not product:
            return {"success": False, "error": f"Product '{item['product_name']}' not found or unavailable"}

        quantity = item.get("quantity", 1)
        subtotal = float(product.price) * quantity
        total += subtotal
        breakdown.append({
            "product_name": product.name,
            "unit_price": str(product.price),
            "quantity": quantity,
            "subtotal": str(round(subtotal, 2)),
        })

    return {"success": True, "breakdown": breakdown, "total": str(round(total, 2))}


def _get_or_create_customer(db: Session, business_id: uuid.UUID, name: str, phone: str) -> Customer:
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


def get_customer_history(db: Session, business_id: uuid.UUID, customer_phone: str) -> dict:
    customer = db.query(Customer).filter(
        Customer.business_id == business_id,
        Customer.phone == customer_phone,
    ).first()

    if not customer:
        return {"success": False, "error": "No customer found with that phone number"}

    orders = db.query(Order).filter(Order.customer_id == customer.id).all()
    appointments = db.query(Appointment).filter(Appointment.customer_id == customer.id).all()

    return {
        "success": True,
        "customer_name": customer.name,
        "orders": [
            {"order_id": str(o.id), "total": str(o.total), "status": o.status}
            for o in orders
        ],
        "appointments": [
            {
                "appointment_id": str(a.id),
                "service": a.service,
                "scheduled_at": a.scheduled_at.isoformat(),
            }
            for a in appointments
        ],
    }


def send_notification(db: Session, business_id: uuid.UUID, message: str) -> dict:
    notification = Notification(business_id=business_id, message=message)
    db.add(notification)
    db.commit()
    db.refresh(notification)

    business = db.query(Business).filter(Business.id == business_id).first()
    whatsapp_sent = False
    if business and business.phone:
        try:
            result = send_whatsapp_message(to=business.phone, message=f"[Zento AI] {message}", from_phone_number_id=business.whatsapp_phone_number_id)
            print("WhatsApp send result:", result)
            whatsapp_sent = True
        except Exception as e:
            print("WhatsApp send FAILED:", e)
            whatsapp_sent = False
    else:
        print("No phone number on business, skipping WhatsApp notification.")

    return {
        "success": True,
        "notification_id": str(notification.id),
        "whatsapp_sent": whatsapp_sent,
    }


def book_appointment(
    db: Session,
    business_id: uuid.UUID,
    customer_name: str,
    customer_phone: str,
    service: str,
    scheduled_at: str,
) -> dict:
    customer = _get_or_create_customer(db, business_id, customer_name, customer_phone)

    appointment = Appointment(
        business_id=business_id,
        customer_id=customer.id,
        service=service,
        scheduled_at=datetime.fromisoformat(scheduled_at),
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    friendly_time = datetime.fromisoformat(scheduled_at).strftime("%B %d, %Y at %I:%M %p")
    send_notification(db, business_id, f"New appointment booked: {customer.name} for {service} on {friendly_time}")

    return {
        "success": True,
        "appointment_id": str(appointment.id),
        "customer_name": customer.name,
        "service": service,
        "scheduled_at": scheduled_at,
    }


def cancel_appointment(db: Session, business_id: uuid.UUID, appointment_id: str) -> dict:
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.business_id == business_id,
    ).first()

    if not appointment:
        return {"success": False, "error": "Appointment not found"}

    db.delete(appointment)
    db.commit()

    return {"success": True, "appointment_id": appointment_id}


def create_order(
    db: Session,
    business_id: uuid.UUID,
    customer_name: str,
    customer_phone: str,
    product_name: str,
) -> dict:
    customer = _get_or_create_customer(db, business_id, customer_name, customer_phone)

    product = db.query(Product).filter(
        Product.business_id == business_id,
        Product.name.ilike(product_name),
        Product.is_available == True,
    ).first()

    if not product:
        return {"success": False, "error": f"Product '{product_name}' not found or unavailable"}

    order = Order(
        business_id=business_id,
        customer_id=customer.id,
        total=product.price,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    send_notification(db, business_id, f"New order: {customer.name} ordered {product.name} (GHS {product.price})")

    return {
        "success": True,
        "order_id": str(order.id),
        "customer_name": customer.name,
        "product_name": product.name,
        "total": str(order.total),
        "status": order.status,
    }


def get_order_status(db: Session, business_id: uuid.UUID, order_id: str) -> dict:
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.business_id == business_id,
    ).first()

    if not order:
        return {"success": False, "error": "Order not found"}

    return {"success": True, "order_id": str(order.id), "status": order.status, "total": str(order.total)}


def create_invoice(db: Session, business_id: uuid.UUID, order_id: str) -> dict:
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.business_id == business_id,
    ).first()

    if not order:
        return {"success": False, "error": "Order not found"}

    invoice = Invoice(
        business_id=business_id,
        customer_id=order.customer_id,
        order_id=order.id,
        amount=order.total,
        status="unpaid",
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return {
        "success": True,
        "invoice_id": str(invoice.id),
        "amount": str(invoice.amount),
        "status": invoice.status,
    }


