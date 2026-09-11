from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS password_hash VARCHAR;"))
    conn.commit()
    print("password_hash column added (or already existed).")