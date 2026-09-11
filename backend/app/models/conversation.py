import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    last_message = Column(String, nullable=False)
    channel = Column(String, nullable=False, default="WhatsApp")
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", backref="conversations")
    customer = relationship("Customer", backref="conversations")