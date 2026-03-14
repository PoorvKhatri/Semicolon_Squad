from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.warehouse import Warehouse, Location
from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseOut,
    WarehouseUpdate,
    LocationCreate,
    LocationOut,
    LocationUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[WarehouseOut])
def list_warehouses(db: Session = Depends(get_db), _=Depends(get_current_user)) -> List[WarehouseOut]:
    return db.query(Warehouse).all()


@router.post("/", response_model=WarehouseOut)
def create_warehouse(wh_in: WarehouseCreate, db: Session = Depends(get_db), _=Depends(get_current_user)) -> WarehouseOut:
    wh = Warehouse(**wh_in.dict())
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh


@router.put("/{warehouse_id}", response_model=WarehouseOut)
def update_warehouse(
    warehouse_id: int,
    wh_in: WarehouseUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
) -> WarehouseOut:
    wh = db.get(Warehouse, warehouse_id)
    if not wh:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    data = wh_in.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(wh, field, value)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh


@router.delete("/{warehouse_id}", status_code=204)
def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)) -> None:
    wh = db.get(Warehouse, warehouse_id)
    if not wh:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    db.delete(wh)
    db.commit()


@router.get("/{warehouse_id}/locations", response_model=List[LocationOut])
def list_locations(warehouse_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)) -> List[LocationOut]:
    return db.query(Location).filter(Location.warehouse_id == warehouse_id).all()


@router.post("/{warehouse_id}/locations", response_model=LocationOut)
def create_location(warehouse_id: int, loc_in: LocationCreate, db: Session = Depends(get_db), _=Depends(get_current_user)) -> LocationOut:
    # Ensure path warehouse_id matches body
    payload = loc_in.dict()
    payload["warehouse_id"] = warehouse_id
    loc = Location(**payload)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc


@router.put("/locations/{location_id}", response_model=LocationOut)
def update_location(location_id: int, loc_in: LocationUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)) -> LocationOut:
    loc = db.get(Location, location_id)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    data = loc_in.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(loc, field, value)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc


@router.delete("/locations/{location_id}", status_code=204)
def delete_location(location_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)) -> None:
    loc = db.get(Location, location_id)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(loc)
    db.commit()

