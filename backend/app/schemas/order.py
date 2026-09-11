import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class OrderCreate(BaseModel):
    business_id: uuid.UUID
    customer_id: uuid.UUID
    total: Decimal
    status: str = "pending"


class OrderOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    customer_id: uuid.UUID
    total: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True