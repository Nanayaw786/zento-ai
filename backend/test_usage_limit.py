from datetime import datetime
from app.core.database import SessionLocal
from app.models.business import Business
import uuid

db = SessionLocal()
business = db.query(Business).filter(Business.id == uuid.UUID("6f5eb5a1-f6be-4693-b10a-e1a23b732076")).first()
if business:
    business.plan = "free"
    business.ai_replies_this_month = 49
    business.usage_reset_month = datetime.utcnow().strftime("%Y-%m")
    db.commit()
    print(f"Set {business.name} to free plan with 49/50 replies used")
db.close()