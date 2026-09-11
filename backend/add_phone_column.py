from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone VARCHAR;"))
    conn.commit()
    print("phone column added (or already existed).")