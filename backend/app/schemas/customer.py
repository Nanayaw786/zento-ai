import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class CustomerCreate(BaseModel):
    business_id: uuid.UUID
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None


class CustomerOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True