from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.models.base import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, nullable=False)
    description = Column(String(512), nullable=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), nullable=False, index=True)
    sku = Column(String(64), unique=True, nullable=False, index=True)
    uom = Column(String(32), nullable=False, default="pcs")
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    description = Column(String(512), nullable=True)

    category = relationship("Category", back_populates="products")
