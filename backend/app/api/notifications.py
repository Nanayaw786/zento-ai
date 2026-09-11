import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationOut

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=List[NotificationOut])
def list_notifications(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return (
        db.query(Notification)
        .filter(Notification.business_id == business_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


@router.put("/{notification_id}/read", response_model=NotificationOut)
def mark_as_read(notification_id: uuid.UUID, business_id: uuid.UUID, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.business_id == business_id,
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.put("/mark-all-read")
def mark_all_read(business_id: uuid.UUID, db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.business_id == business_id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"success": True}