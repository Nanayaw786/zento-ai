from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS requested_plan VARCHAR;"))
    conn.commit()
    print("requested_plan column added (or already existed).")