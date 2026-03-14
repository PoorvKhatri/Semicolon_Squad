from typing import Optional

from pydantic import BaseModel


class WarehouseBase(BaseModel):
    name: str
    description: Optional[str] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class WarehouseOut(WarehouseBase):
    id: int

    class Config:
        orm_mode = True


class LocationBase(BaseModel):
    warehouse_id: int
    name: str
    description: Optional[str] = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class LocationOut(LocationBase):
    id: int

    class Config:
        orm_mode = True
