from app.core.database import SessionLocal
from app.models.business import Business
import uuid

db = SessionLocal()
business = db.query(Business).filter(Business.id == uuid.UUID("6f5eb5a1-f6be-4693-b10a-e1a23b732076")).first()
if business:
    business.whatsapp_phone_number_id = "1365309253328270"
    db.commit()
    print(f"Updated {business.name} with WhatsApp number ID.")
else:
    print("Business not found.")
db.close()