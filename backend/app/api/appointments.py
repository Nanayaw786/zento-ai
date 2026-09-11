import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("/", response_model=AppointmentOut)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    new_appointment = Appointment(
        business_id=appointment.business_id,
        customer_id=appointment.customer_id,
        service=appointment.service,
        scheduled_at=appointment.scheduled_at,
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment


@router.get("/", response_model=List[AppointmentOut])
def list_appointments(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.business_id == business_id).all()