from app.core.database import SessionLocal
from app.models.business import Business
import uuid

db = SessionLocal()
business = db.query(Business).filter(Business.id == uuid.UUID("2d9b0232-8981-4f26-add8-2bac69af65fd")).first()
if business:
    business.whatsapp_phone_number_id = "1349730078227023"
    db.commit()
    print(f"Updated {business.name} with WhatsApp number ID.")
else:
    print("Business not found.")
db.close()