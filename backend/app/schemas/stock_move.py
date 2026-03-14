from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ===== RECEIPT SCHEMAS =====
class ReceiptItemCreate(BaseModel):
    product_id: int
    location_id: int
    quantity: float = Field(gt=0)


class ReceiptCreate(BaseModel):
    reference: str
    supplier: str
    items: List[ReceiptItemCreate]


class ReceiptOut(BaseModel):
    id: int
    reference: str
    supplier: str
    status: str
    created_at: datetime
    items: Optional[List[dict]] = None

    class Config:
        from_attributes = True


# ===== DELIVERY SCHEMAS =====
class DeliveryItemCreate(BaseModel):
    product_id: int
    location_id: int
    quantity: float = Field(gt=0)


class DeliveryCreate(BaseModel):
    reference: str
    customer: Optional[str] = None
    items: List[DeliveryItemCreate]


class DeliveryOut(BaseModel):
    id: int
    reference: str
    customer: Optional[str] = None
    status: str
    created_at: datetime
    items: Optional[List[dict]] = None

    class Config:
        from_attributes = True


# ===== TRANSFER SCHEMAS =====
class TransferCreate(BaseModel):
    reference: str
    product_id: int
    source_location_id: int
    dest_location_id: int
    quantity: float = Field(gt=0)


class TransferOut(BaseModel):
    id: int
    reference: str
    product_id: int
    source_location_id: int
    dest_location_id: int
    quantity: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ===== ADJUSTMENT SCHEMAS =====
class AdjustmentCreate(BaseModel):
    reference: str
    product_id: int
    location_id: int
    actual_quantity: float = Field(ge=0)
    reason: Optional[str] = None


class AdjustmentOut(BaseModel):
    id: int
    reference: str
    product_id: int
    location_id: int
    system_quantity: float
    actual_quantity: float
    adjustment_quantity: float
    reason: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ===== LEGACY SCHEMAS (for backward compatibility) =====
class ReceiptCreateLegacy(BaseModel):
    product_id: int
    quantity: float
    destination_location_id: int
    reference: Optional[str] = None
    supplier: Optional[str] = None


class DeliveryCreateLegacy(BaseModel):
    product_id: int
    quantity: float
    source_location_id: int
    reference: Optional[str] = None


class TransferCreateLegacy(BaseModel):
    product_id: int
    quantity: float
    source_location_id: int
    dest_location_id: int
    reference: Optional[str] = None


class AdjustmentCreateLegacy(BaseModel):
    product_id: int
    quantity: float
    location_id: int
    reference: Optional[str] = None
