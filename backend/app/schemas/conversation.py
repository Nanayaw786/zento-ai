import uuid
from datetime import datetime
from pydantic import BaseModel


class ConversationCreate(BaseModel):
    business_id: uuid.UUID
    customer_id: uuid.UUID
    last_message: str
    channel: str = "WhatsApp"


class ConversationOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    customer_id: uuid.UUID
    last_message: str
    channel: str
    created_at: datetime

    class Config:
        from_attributes = True