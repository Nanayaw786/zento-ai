from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS plan VARCHAR NOT NULL DEFAULT 'free';"))
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ai_replies_this_month INTEGER NOT NULL DEFAULT 0;"))
    conn.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS usage_reset_month VARCHAR;"))
    conn.commit()
    print("Plan and usage columns added (or already existed).")