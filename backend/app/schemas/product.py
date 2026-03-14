from typing import Optional

from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str
    sku: str
    uom: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    initial_stock: Optional[float] = 0
    reorder_point: Optional[float] = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    uom: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None


class ProductOut(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
