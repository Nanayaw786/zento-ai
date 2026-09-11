import uuid
from typing import List, Literal
from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    business_id: uuid.UUID
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str