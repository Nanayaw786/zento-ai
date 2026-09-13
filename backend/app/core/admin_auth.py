import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import HTTPException, Header

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"


def verify_admin_credentials(username: str, password: str) -> bool:
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def create_admin_token() -> str:
    expire = datetime.utcnow() + timedelta(hours=12)
    return jwt.encode({"admin": True, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def verify_admin_token(authorization: str = Header(...)) -> bool:
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("admin"):
            raise HTTPException(status_code=403, detail="Not an admin token")
        return True
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired admin token")