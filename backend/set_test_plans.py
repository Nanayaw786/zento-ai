from app.core.database import SessionLocal
from app.models.business import Business
import uuid

db = SessionLocal()
for bid in ["2d9b0232-8981-4f26-add8-2bac69af65fd", "6f5eb5a1-f6be-4693-b10a-e1a23b732076"]:
    business = db.query(Business).filter(Business.id == uuid.UUID(bid)).first()
    if business:
        business.plan = "pro"
        print(f"Set {business.name} to pro plan")
db.commit()
db.close()