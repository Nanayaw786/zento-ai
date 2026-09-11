from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.businesses import router as businesses_router
from app.api.customers import router as customers_router
from app.api.orders import router as orders_router
from app.api.conversations import router as conversations_router
from app.api.appointments import router as appointments_router
from app.api.auth import router as auth_router
from app.api.products import router as products_router
from app.api.agent import router as agent_router
from app.api.whatsapp import router as whatsapp_router
from app.api.invoices import router as invoices_router
from app.api.notifications import router as notifications_router

app = FastAPI(title="Zento AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(businesses_router)
app.include_router(customers_router)
app.include_router(orders_router)
app.include_router(conversations_router)
app.include_router(appointments_router)
app.include_router(products_router)
app.include_router(agent_router)
app.include_router(whatsapp_router)
app.include_router(invoices_router)
app.include_router(notifications_router)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Zento AI backend is running"}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"database": "connected"}