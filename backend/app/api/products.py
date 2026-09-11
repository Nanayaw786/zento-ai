import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(
        business_id=product.business_id,
        name=product.name,
        description=product.description,
        price=product.price,
        is_available=product.is_available,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.get("/", response_model=List[ProductOut])
def list_products(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.business_id == business_id).all()


@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: uuid.UUID, product: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == product.business_id,
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    existing.name = product.name
    existing.description = product.description
    existing.price = product.price
    existing.is_available = product.is_available
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{product_id}")
def delete_product(product_id: uuid.UUID, business_id: uuid.UUID, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == business_id,
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(existing)
    db.commit()
    return {"success": True}