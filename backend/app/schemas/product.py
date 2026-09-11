import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    business_id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: Decimal
    is_available: bool = True


class ProductOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: Decimal
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True