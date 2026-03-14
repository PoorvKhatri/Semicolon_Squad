from sqlalchemy import Column, ForeignKey, Integer, Numeric, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Stock(Base):
    """Tracks current stock quantity for each product-location combination."""
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Numeric(12, 3), nullable=False, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product")
    location = relationship("Location")

    __table_args__ = (UniqueConstraint("product_id", "location_id", name="uq_product_location"),)
