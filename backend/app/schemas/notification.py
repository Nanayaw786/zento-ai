import uuid
from datetime import datetime
from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True