"""Utility script to create database tables."""

from app.core.database import engine
from app.models.base import Base
from app.models import product, user, warehouse, stock_move, password_reset, stock, operations


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created.")
