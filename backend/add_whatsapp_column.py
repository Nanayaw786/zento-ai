from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id VARCHAR UNIQUE;"))
    conn.commit()
    print("whatsapp_phone_number_id column added (or already existed).")