from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.models.base import Base


class OperationStatus(str, PyEnum):
    DRAFT = "draft"
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Receipt(Base):
    """Incoming goods receipt."""
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(256), unique=True, nullable=False, index=True)
    supplier = Column(String(256), nullable=False)
    status = Column(Enum(OperationStatus), default=OperationStatus.DRAFT, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    created_by = relationship("User")
    items = relationship("ReceiptItem", back_populates="receipt", cascade="all, delete-orphan")


class ReceiptItem(Base):
    """Line items in a receipt."""
    __tablename__ = "receipt_items"

    id = Column(Integer, primary_key=True, index=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Numeric(12, 3), nullable=False)
    stock_move_id = Column(Integer, ForeignKey("stock_moves.id"), nullable=True)

    receipt = relationship("Receipt", back_populates="items")
    product = relationship("Product")
    location = relationship("Location")
    stock_move = relationship("StockMove")


class Delivery(Base):
    """Outgoing goods delivery order."""
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(256), unique=True, nullable=False, index=True)
    customer = Column(String(256), nullable=True)
    status = Column(Enum(OperationStatus), default=OperationStatus.DRAFT, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    created_by = relationship("User")
    items = relationship("DeliveryItem", back_populates="delivery", cascade="all, delete-orphan")


class DeliveryItem(Base):
    """Line items in a delivery order."""
    __tablename__ = "delivery_items"

    id = Column(Integer, primary_key=True, index=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Numeric(12, 3), nullable=False)
    stock_move_id = Column(Integer, ForeignKey("stock_moves.id"), nullable=True)

    delivery = relationship("Delivery", back_populates="items")
    product = relationship("Product")
    location = relationship("Location")
    stock_move = relationship("StockMove")


class Transfer(Base):
    """Internal stock transfer between locations."""
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(256), unique=True, nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    source_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    dest_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Numeric(12, 3), nullable=False)
    status = Column(Enum(OperationStatus), default=OperationStatus.DRAFT, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    source_move_id = Column(Integer, ForeignKey("stock_moves.id"), nullable=True)
    dest_move_id = Column(Integer, ForeignKey("stock_moves.id"), nullable=True)

    product = relationship("Product")
    source_location = relationship("Location", foreign_keys=[source_location_id])
    dest_location = relationship("Location", foreign_keys=[dest_location_id])
    created_by = relationship("User")
    source_move = relationship("StockMove", foreign_keys=[source_move_id])
    dest_move = relationship("StockMove", foreign_keys=[dest_move_id])


class Adjustment(Base):
    """Stock adjustment to correct inventory discrepancies."""
    __tablename__ = "adjustments"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(256), unique=True, nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    system_quantity = Column(Numeric(12, 3), nullable=False)
    actual_quantity = Column(Numeric(12, 3), nullable=False)
    adjustment_quantity = Column(Numeric(12, 3), nullable=False)
    reason = Column(String(512), nullable=True)
    status = Column(Enum(OperationStatus), default=OperationStatus.DRAFT, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    stock_move_id = Column(Integer, ForeignKey("stock_moves.id"), nullable=True)

    product = relationship("Product")
    location = relationship("Location")
    created_by = relationship("User")
    stock_move = relationship("StockMove")
