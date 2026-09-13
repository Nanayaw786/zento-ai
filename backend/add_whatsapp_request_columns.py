from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS whatsapp_requested_number VARCHAR;"))
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS whatsapp_request_status VARCHAR;"))
    conn.commit()
    print("WhatsApp request columns added (or already existed).")