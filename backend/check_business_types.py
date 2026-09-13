from app.core.database import SessionLocal
from app.models.business import Business

db = SessionLocal()
businesses = db.query(Business).all()
for b in businesses:
    print(f"{b.name}: business_type = {repr(b.business_type)}")
db.close()