import uuid
from datetime import datetime
from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    business_id: uuid.UUID
    customer_id: uuid.UUID
    service: str
    scheduled_at: datetime


class AppointmentOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    customer_id: uuid.UUID
    service: str
    scheduled_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True