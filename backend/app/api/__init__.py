from fastapi import APIRouter

from app.api import health, auth, products, warehouses, stats

router = APIRouter()
router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(products.router, prefix="/products", tags=["products"])
router.include_router(warehouses.router, prefix="/warehouses", tags=["warehouses"])
router.include_router(stats.router, prefix="/stats", tags=["stats"])
