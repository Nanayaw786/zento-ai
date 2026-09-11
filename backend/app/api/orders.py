import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderStatusUpdate(BaseModel):
    business_id: uuid.UUID
    status: str


@router.post("/", response_model=OrderOut)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    new_order = Order(
        business_id=order.business_id,
        customer_id=order.customer_id,
        total=order.total,
        status=order.status,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=List[OrderOut])
def list_orders(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.business_id == business_id).all()


@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: uuid.UUID, update: OrderStatusUpdate, db: Session = Depends(get_db)):
    existing = db.query(Order).filter(
        Order.id == order_id,
        Order.business_id == update.business_id,
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Order not found")

    existing.status = update.status
    db.commit()
    db.refresh(existing)
    return existing