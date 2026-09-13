import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class BusinessCreate(BaseModel):
    name: str
    email: EmailStr
    business_type: Optional[str] = None


class BusinessOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    phone: Optional[str] = None
    business_type: Optional[str] = None
    whatsapp_phone_number_id: Optional[str] = None
    whatsapp_requested_number: Optional[str] = None
    whatsapp_request_status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class WhatsAppNumberRequest(BaseModel):
    whatsapp_requested_number: str