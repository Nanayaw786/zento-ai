from app.core.database import Base, engine
from app.models.business import Business
from app.models.customer import Customer
from app.models.order import Order
from app.models.conversation import Conversation
from app.models.appointment import Appointment
from app.models.product import Product
from app.models.invoice import Invoice
from app.models.notification import Notification

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done. Tables created (or already existed).")