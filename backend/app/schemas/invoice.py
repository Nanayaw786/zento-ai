import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from typing import Optional


class InvoiceOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    customer_id: uuid.UUID
    order_id: Optional[uuid.UUID] = None
    amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True