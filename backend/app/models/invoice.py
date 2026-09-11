import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False, default="unpaid")
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", backref="invoices")
    customer = relationship("Customer", backref="invoices")
    order = relationship("Order", backref="invoices")