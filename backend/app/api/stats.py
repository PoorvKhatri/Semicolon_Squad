from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.product import Product
from app.models.warehouse import Warehouse
from app.models.stock_move import StockMove

router = APIRouter()


@router.get("/")
def get_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_warehouses = db.query(func.count(Warehouse.id)).scalar() or 0
    total_moves = db.query(func.count(StockMove.id)).scalar() or 0
    # low_stock is domain-specific; placeholder for now
    low_stock = 0
    return {
        "total_products": total_products,
        "total_warehouses": total_warehouses,
        "total_moves": total_moves,
        "low_stock": low_stock,
    }
