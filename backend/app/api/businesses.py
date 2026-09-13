import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessOut, WhatsAppNumberRequest

router = APIRouter(prefix="/businesses", tags=["businesses"])


class BusinessUpdate(BaseModel):
    name: str
    phone: Optional[str] = None
    business_type: Optional[str] = None


@router.post("/", response_model=BusinessOut)
def create_business(business: BusinessCreate, db: Session = Depends(get_db)):
    existing = db.query(Business).filter(Business.email == business.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="A business with this email already exists")

    new_business = Business(
        name=business.name,
        email=business.email,
        business_type=business.business_type,
    )
    db.add(new_business)
    db.commit()
    db.refresh(new_business)
    return new_business


@router.get("/", response_model=list[BusinessOut])
def list_businesses(db: Session = Depends(get_db)):
    return db.query(Business).all()


@router.get("/{business_id}", response_model=BusinessOut)
def get_business(business_id: uuid.UUID, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.put("/{business_id}", response_model=BusinessOut)
def update_business(business_id: uuid.UUID, update: BusinessUpdate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    business.name = update.name
    business.phone = update.phone
    business.business_type = update.business_type
    db.commit()
    db.refresh(business)
    return business


@router.post("/{business_id}/whatsapp-request", response_model=BusinessOut)
def request_whatsapp_number(
    business_id: uuid.UUID, request: WhatsAppNumberRequest, db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    business.whatsapp_requested_number = request.whatsapp_requested_number
    business.whatsapp_request_status = "pending"
    db.commit()
    db.refresh(business)
    return business