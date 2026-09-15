from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.business import Business
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(Business).filter(Business.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_business = Business(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        business_type=data.business_type,
        requested_plan=data.requested_plan,
    )
    db.add(new_business)
    db.commit()
    db.refresh(new_business)

    token = create_access_token({"sub": str(new_business.id)})
    return TokenResponse(
        access_token=token,
        business_id=str(new_business.id),
        business_name=new_business.name,
    )


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.email == data.email).first()
    if not business or not business.password_hash or not verify_password(data.password, business.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(business.id)})
    return TokenResponse(
        access_token=token,
        business_id=str(business.id),
        business_name=business.name,
    )