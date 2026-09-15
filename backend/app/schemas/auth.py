from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    business_type: Optional[str] = None
    requested_plan: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    business_id: str
    business_name: str