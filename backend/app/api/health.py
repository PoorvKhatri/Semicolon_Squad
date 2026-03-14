from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/", summary="Health check")
async def health_check():
    return {"status": "ok", "service": "CoreInventory API"}

@router.get("/db", summary="Database connectivity")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
