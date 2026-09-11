import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceOut

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("/", response_model=List[InvoiceOut])
def list_invoices(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Invoice).filter(Invoice.business_id == business_id).all()