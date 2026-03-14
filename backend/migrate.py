import os
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:123456@localhost:5432/coreinventory')
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN initial_stock NUMERIC(12, 3) DEFAULT 0;"))
        print("Added initial_stock to products")
    except Exception as e:
        print(f"Error migrating initial_stock: {e}")

    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN reorder_point NUMERIC(12, 3) DEFAULT 0;"))
        print("Added reorder_point to products")
    except Exception as e:
        print(f"Error migrating reorder_point: {e}")

    try:
        conn.execute(text("ALTER TABLE stock_moves ADD COLUMN status VARCHAR(32) DEFAULT 'Done';"))
        print("Added status to stock_moves")
    except Exception as e:
        print(f"Error migrating status: {e}")

    conn.commit()
print("Migration completed.")
