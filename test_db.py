import sys
import os

sys.path.append(r"C:\Users\kpoor\OneDrive\Documents\GitHub\Semicolon_Squad\backend")

from sqlalchemy.orm import sessionmaker
from app.core.database import engine
from app.models.operations import Delivery, Receipt, Transfer, Adjustment
from app.models.user import User

Session = sessionmaker(bind=engine)
session = Session()

try:
    print("Users:")
    users = session.query(User).all()
    for u in users:
        print("User:", u.username)
        # also print first user token basically if we want but it's fine

    print("Listing receipts...")
    receipts = session.query(Receipt).offset(0).limit(10).all()
    print("Receipts count:", len(receipts))
    
    print("Listing deliveries...")
    deliveries = session.query(Delivery).offset(0).limit(10).all()
    print("Deliveries count:", len(deliveries))
    
    print("Listing transfers...")
    transfers = session.query(Transfer).offset(0).limit(10).all()
    print("Transfers count:", len(transfers))

    print("Listing adjustments...")
    adjusts = session.query(Adjustment).offset(0).limit(10).all()
    print("Adjusts count:", len(adjusts))
except Exception as e:
    import traceback
    traceback.print_exc()
