import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.conversation import Conversation
from app.schemas.conversation import ConversationCreate, ConversationOut

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("/", response_model=ConversationOut)
def create_conversation(conversation: ConversationCreate, db: Session = Depends(get_db)):
    new_conversation = Conversation(
        business_id=conversation.business_id,
        customer_id=conversation.customer_id,
        last_message=conversation.last_message,
        channel=conversation.channel,
    )
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    return new_conversation


@router.get("/", response_model=List[ConversationOut])
def list_conversations(business_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Conversation).filter(Conversation.business_id == business_id).all()