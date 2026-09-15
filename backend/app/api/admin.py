from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.core.database import get_db
from app.core.admin_auth import verify_admin_credentials, create_admin_token, verify_admin_token
from app.models.business import Business
from app.models.customer import Customer
from app.models.order import Order
from app.models.appointment import Appointment
from app.models.conversation import Conversation

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    access_token: str


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(data: AdminLoginRequest):
    if not verify_admin_credentials(data.username, data.password):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return AdminLoginResponse(access_token=create_admin_token())


@router.get("/stats")
def get_platform_stats(db: Session = Depends(get_db), _: bool = Depends(verify_admin_token)):
    return {
        "total_businesses": db.query(func.count(Business.id)).scalar(),
        "total_customers": db.query(func.count(Customer.id)).scalar(),
        "total_orders": db.query(func.count(Order.id)).scalar(),
        "total_appointments": db.query(func.count(Appointment.id)).scalar(),
        "total_conversations": db.query(func.count(Conversation.id)).scalar(),
        "businesses_with_whatsapp": db.query(func.count(Business.id))
        .filter(Business.whatsapp_phone_number_id.isnot(None))
        .scalar(),
        "pending_whatsapp_requests": db.query(func.count(Business.id))
        .filter(Business.whatsapp_request_status == "pending")
        .scalar(),
    }


@router.get("/businesses")
def list_all_businesses(db: Session = Depends(get_db), _: bool = Depends(verify_admin_token)):
    businesses = db.query(Business).order_by(Business.created_at.desc()).all()
    result = []
    for b in businesses:
        order_count = db.query(func.count(Order.id)).filter(Order.business_id == b.id).scalar()
        customer_count = db.query(func.count(Customer.id)).filter(Customer.business_id == b.id).scalar()
        result.append({
            "id": str(b.id),
            "name": b.name,
            "email": b.email,
            "business_type": b.business_type,
            "phone": b.phone,
            "whatsapp_connected": b.whatsapp_phone_number_id is not None,
            "whatsapp_phone_number_id": b.whatsapp_phone_number_id,
            "whatsapp_requested_number": b.whatsapp_requested_number,
            "whatsapp_request_status": b.whatsapp_request_status,
            "plan": b.plan,
            "requested_plan": b.requested_plan,
            "order_count": order_count,
            "customer_count": customer_count,
            "created_at": b.created_at.isoformat(),
        })
    return result