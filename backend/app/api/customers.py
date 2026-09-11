import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerOut

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("/", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    new_customer = Customer(
        business_id=customer.business_id,
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer


@router.get("/", response_model=List[CustomerOut])
def list_customers(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Customer).filter(Customer.business_id == business_id).all()


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(customer_id: uuid.UUID, customer: CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.business_id == customer.business_id,
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")

    existing.name = customer.name
    existing.phone = customer.phone
    existing.email = customer.email
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{customer_id}")
def delete_customer(customer_id: uuid.UUID, business_id: uuid.UUID, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.business_id == business_id,
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(existing)
    db.commit()
    return {"success": True}