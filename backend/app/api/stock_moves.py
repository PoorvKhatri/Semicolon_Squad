"""
Stock moves and inventory operations APIs.
Handles receipts, deliveries, transfers, and adjustments.
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.auth import get_current_user
from app.core.database import get_db
from app.api.inventory_service import InventoryService, StockValidationError
from app.models.user import User
from app.models.stock_move import StockMove, StockMoveType
from app.models.operations import (
    Receipt, ReceiptItem, Delivery, DeliveryItem, Transfer, Adjustment, OperationStatus
)
from app.schemas.stock_move import (
    ReceiptCreate, ReceiptOut,
    DeliveryCreate, DeliveryOut,
    TransferCreate, TransferOut,
    AdjustmentCreate, AdjustmentOut,
)

router = APIRouter()


# ===== RECEIPT ENDPOINTS =====

@router.post("/receipts", response_model=ReceiptOut, status_code=status.HTTP_201_CREATED)
def create_receipt(
    data: ReceiptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new receipt (incoming goods)."""
    try:
        receipt = InventoryService.create_receipt(
            db,
            reference=data.reference,
            supplier=data.supplier,
            items=data.items,
            created_by_id=current_user.id,
        )
        db.commit()
        db.refresh(receipt)
        return receipt
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/receipts", response_model=List[dict])
def list_receipts(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all receipts with optional filters."""
    query = db.query(Receipt).options(
        joinedload(Receipt.items).joinedload(ReceiptItem.product),
        joinedload(Receipt.items).joinedload(ReceiptItem.location),
        joinedload(Receipt.created_by)
    )

    if status_filter:
        try:
            query = query.filter(Receipt.status == OperationStatus(status_filter))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")

    receipts = query.offset(skip).limit(limit).all()

    return [
        {
            "id": r.id,
            "reference": r.reference,
            "supplier": r.supplier,
            "status": r.status.value,
            "items_count": len(r.items),
            "total_quantity": sum(float(item.quantity) for item in r.items),
            "quantity": sum(float(item.quantity) for item in r.items),
            "product_name": r.items[0].product.name if r.items else "Unknown",
            "warehouse_name": r.items[0].location.name if r.items else "Unknown",
            "created_at": r.created_at.isoformat(),
            "created_by": r.created_by.username if r.created_by else "Unknown",
        }
        for r in receipts
    ]


@router.get("/receipts/{receipt_id}")
def get_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get receipt details."""
    receipt = db.query(Receipt).options(
        joinedload(Receipt.items).joinedload(ReceiptItem.product),
        joinedload(Receipt.items).joinedload(ReceiptItem.location),
        joinedload(Receipt.created_by)
    ).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")

    return {
        "id": receipt.id,
        "reference": receipt.reference,
        "supplier": receipt.supplier,
        "status": receipt.status.value,
        "created_at": receipt.created_at.isoformat(),
        "created_by": receipt.created_by.username if receipt.created_by else "Unknown",
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "location_id": item.location_id,
                "location_name": item.location.name,
                "quantity": float(item.quantity),
            }
            for item in receipt.items
        ],
    }


@router.post("/receipts/{receipt_id}/validate")
def validate_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Validate and complete a receipt (update stock)."""
    try:
        receipt = InventoryService.complete_receipt(db, receipt_id, current_user.id)
        db.commit()
        db.refresh(receipt)
        return {"status": "success", "message": "Receipt validated and stock updated"}
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/receipts/{receipt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Delete a draft receipt."""
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")

    if receipt.status != OperationStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Can only delete draft receipts")

    db.delete(receipt)
    db.commit()


# ===== DELIVERY ENDPOINTS =====

@router.post("/deliveries", response_model=DeliveryOut, status_code=status.HTTP_201_CREATED)
def create_delivery(
    data: DeliveryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new delivery order (outgoing goods)."""
    try:
        delivery = InventoryService.create_delivery(
            db,
            reference=data.reference,
            customer=data.customer,
            items=data.items,
            created_by_id=current_user.id,
        )
        db.commit()
        db.refresh(delivery)
        return delivery
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/deliveries", response_model=List[dict])
def list_deliveries(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all deliveries with optional filters."""
    query = db.query(Delivery).options(
        joinedload(Delivery.items).joinedload(DeliveryItem.product),
        joinedload(Delivery.items).joinedload(DeliveryItem.location),
        joinedload(Delivery.created_by)
    )

    if status_filter:
        try:
            query = query.filter(Delivery.status == OperationStatus(status_filter))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")

    deliveries = query.offset(skip).limit(limit).all()

    return [
        {
            "id": d.id,
            "reference": d.reference,
            "customer": d.customer or "Unknown",
            "status": d.status.value,
            "items_count": len(d.items),
            "total_quantity": sum(float(item.quantity) for item in d.items),
            "quantity": sum(float(item.quantity) for item in d.items),
            "product_name": d.items[0].product.name if d.items else "Unknown",
            "location_name": d.items[0].location.name if d.items else "Unknown",
            "created_at": d.created_at.isoformat(),
            "created_by": d.created_by.username if d.created_by else "Unknown",
        }
        for d in deliveries
    ]


@router.get("/deliveries/{delivery_id}")
def get_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get delivery details."""
    delivery = db.query(Delivery).options(
        joinedload(Delivery.items).joinedload(DeliveryItem.product),
        joinedload(Delivery.items).joinedload(DeliveryItem.location),
        joinedload(Delivery.created_by)
    ).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    return {
        "id": delivery.id,
        "reference": delivery.reference,
        "customer": delivery.customer,
        "status": delivery.status.value,
        "created_at": delivery.created_at.isoformat(),
        "created_by": delivery.created_by.username if delivery.created_by else "Unknown",
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "location_id": item.location_id,
                "location_name": item.location.name,
                "quantity": float(item.quantity),
            }
            for item in delivery.items
        ],
    }


@router.post("/deliveries/{delivery_id}/validate")
def validate_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Validate and complete a delivery (update stock)."""
    try:
        delivery = InventoryService.complete_delivery(db, delivery_id, current_user.id)
        db.commit()
        db.refresh(delivery)
        return {"status": "success", "message": "Delivery validated and stock updated"}
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/deliveries/{delivery_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Delete a draft delivery."""
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    if delivery.status != OperationStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Can only delete draft deliveries")

    db.delete(delivery)
    db.commit()


# ===== TRANSFER ENDPOINTS =====

@router.post("/transfers", response_model=TransferOut, status_code=status.HTTP_201_CREATED)
def create_transfer(
    data: TransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new internal transfer."""
    try:
        transfer = InventoryService.create_transfer(
            db,
            reference=data.reference,
            product_id=data.product_id,
            source_location_id=data.source_location_id,
            dest_location_id=data.dest_location_id,
            quantity=data.quantity,
            created_by_id=current_user.id,
        )
        db.commit()
        db.refresh(transfer)
        return transfer
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/transfers", response_model=List[dict])
def list_transfers(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all transfers with optional filters."""
    query = db.query(Transfer).options(
        joinedload(Transfer.product),
        joinedload(Transfer.source_location),
        joinedload(Transfer.dest_location),
        joinedload(Transfer.created_by)
    )

    if status_filter:
        try:
            query = query.filter(Transfer.status == OperationStatus(status_filter))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")

    transfers = query.offset(skip).limit(limit).all()

    return [
        {
            "id": t.id,
            "reference": t.reference,
            "product_id": t.product_id,
            "product_name": t.product.name,
            "source_location": t.source_location.name,
            "dest_location": t.dest_location.name,
            "quantity": float(t.quantity),
            "status": t.status.value,
            "created_at": t.created_at.isoformat(),
            "created_by": t.created_by.username if t.created_by else "Unknown",
        }
        for t in transfers
    ]


@router.get("/transfers/{transfer_id}")
def get_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get transfer details."""
    transfer = db.query(Transfer).options(
        joinedload(Transfer.product),
        joinedload(Transfer.source_location),
        joinedload(Transfer.dest_location),
        joinedload(Transfer.created_by)
    ).filter(Transfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    return {
        "id": transfer.id,
        "reference": transfer.reference,
        "product_id": transfer.product_id,
        "product_name": transfer.product.name,
        "source_location_id": transfer.source_location_id,
        "source_location_name": transfer.source_location.name,
        "dest_location_id": transfer.dest_location_id,
        "dest_location_name": transfer.dest_location.name,
        "quantity": float(transfer.quantity),
        "status": transfer.status.value,
        "created_at": transfer.created_at.isoformat(),
        "created_by": transfer.created_by.username if transfer.created_by else "Unknown",
    }


@router.post("/transfers/{transfer_id}/validate")
def validate_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Validate and complete a transfer (update stock)."""
    try:
        transfer = InventoryService.complete_transfer(db, transfer_id, current_user.id)
        db.commit()
        db.refresh(transfer)
        return {"status": "success", "message": "Transfer validated and stock updated"}
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/transfers/{transfer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Delete a draft transfer."""
    transfer = db.query(Transfer).filter(Transfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    if transfer.status != OperationStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Can only delete draft transfers")

    db.delete(transfer)
    db.commit()


# ===== ADJUSTMENT ENDPOINTS =====

@router.post("/adjustments", response_model=AdjustmentOut, status_code=status.HTTP_201_CREATED)
def create_adjustment(
    data: AdjustmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new inventory adjustment."""
    try:
        adjustment = InventoryService.create_adjustment(
            db,
            reference=data.reference,
            product_id=data.product_id,
            location_id=data.location_id,
            actual_quantity=data.actual_quantity,
            reason=data.reason,
            created_by_id=current_user.id,
        )
        db.commit()
        db.refresh(adjustment)
        return adjustment
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/adjustments", response_model=List[dict])
def list_adjustments(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all adjustments with optional filters."""
    query = db.query(Adjustment).options(
        joinedload(Adjustment.product),
        joinedload(Adjustment.location),
        joinedload(Adjustment.created_by)
    )

    if status_filter:
        try:
            query = query.filter(Adjustment.status == OperationStatus(status_filter))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")

    adjustments = query.offset(skip).limit(limit).all()

    return [
        {
            "id": a.id,
            "reference": a.reference,
            "product_id": a.product_id,
            "product_name": a.product.name,
            "location_name": a.location.name,
            "system_quantity": float(a.system_quantity),
            "actual_quantity": float(a.actual_quantity),
            "adjustment_quantity": float(a.adjustment_quantity),
            "reason": a.reason or "No reason provided",
            "status": a.status.value,
            "created_at": a.created_at.isoformat(),
            "created_by": a.created_by.username if a.created_by else "Unknown",
        }
        for a in adjustments
    ]


@router.get("/adjustments/{adjustment_id}")
def get_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get adjustment details."""
    adjustment = db.query(Adjustment).options(
        joinedload(Adjustment.product),
        joinedload(Adjustment.location),
        joinedload(Adjustment.created_by)
    ).filter(Adjustment.id == adjustment_id).first()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Adjustment not found")

    return {
        "id": adjustment.id,
        "reference": adjustment.reference,
        "product_id": adjustment.product_id,
        "product_name": adjustment.product.name,
        "location_id": adjustment.location_id,
        "location_name": adjustment.location.name,
        "system_quantity": float(adjustment.system_quantity),
        "actual_quantity": float(adjustment.actual_quantity),
        "adjustment_quantity": float(adjustment.adjustment_quantity),
        "reason": adjustment.reason,
        "status": adjustment.status.value,
        "created_at": adjustment.created_at.isoformat(),
        "created_by": adjustment.created_by.username if adjustment.created_by else "Unknown",
    }


@router.post("/adjustments/{adjustment_id}/validate")
def validate_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Validate and complete an adjustment (update stock)."""
    try:
        adjustment = InventoryService.complete_adjustment(db, adjustment_id, current_user.id)
        db.commit()
        db.refresh(adjustment)
        return {"status": "success", "message": "Adjustment validated and stock updated"}
    except StockValidationError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/adjustments/{adjustment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Delete a draft adjustment."""
    adjustment = db.query(Adjustment).filter(Adjustment.id == adjustment_id).first()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Adjustment not found")

    if adjustment.status != OperationStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Can only delete draft adjustments")

    db.delete(adjustment)
    db.commit()


# ===== STOCK LEDGER ENDPOINTS =====

@router.get("/ledger", description="Get stock movement ledger")
def get_stock_ledger(
    skip: int = 0,
    limit: int = 100,
    move_type: Optional[str] = None,
    product_id: Optional[int] = None,
    location_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get stock movement ledger (audit trail)."""
    query = db.query(StockMove).options(
        joinedload(StockMove.product),
        joinedload(StockMove.source_location),
        joinedload(StockMove.dest_location),
        joinedload(StockMove.created_by)
    )

    if move_type:
        try:
            query = query.filter(StockMove.move_type == StockMoveType(move_type))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid move type: {move_type}")

    if product_id:
        query = query.filter(StockMove.product_id == product_id)

    if location_id:
        query = query.filter(
            (StockMove.source_location_id == location_id) |
            (StockMove.dest_location_id == location_id)
        )

    moves = query.order_by(StockMove.created_at.desc()).offset(skip).limit(limit).all()

    return [
        {
            "id": m.id,
            "date": m.created_at.isoformat(),
            "move_type": m.move_type.value,
            "product_id": m.product_id,
            "product_name": m.product.name if m.product else "Unknown",
            "quantity": float(m.quantity),
            "source_location": m.source_location.name if m.source_location else None,
            "dest_location": m.dest_location.name if m.dest_location else None,
            "reference": m.reference or "",
            "created_by": m.created_by.username if m.created_by else "Unknown",
        }
        for m in moves
    ]


@router.get("/history")
def get_move_history(
    skip: int = 0,
    limit: int = 100,
    move_type: Optional[str] = None,
    product_id: Optional[int] = None,
    location_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get stock movement history (alias for ledger)."""
    query = db.query(StockMove).options(
        joinedload(StockMove.product),
        joinedload(StockMove.source_location),
        joinedload(StockMove.dest_location),
        joinedload(StockMove.created_by)
    )

    if move_type:
        try:
            query = query.filter(StockMove.move_type == StockMoveType(move_type))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid move type: {move_type}")

    if product_id:
        query = query.filter(StockMove.product_id == product_id)

    if location_id:
        query = query.filter(
            (StockMove.source_location_id == location_id) |
            (StockMove.dest_location_id == location_id)
        )

    moves = query.order_by(StockMove.created_at.desc()).offset(skip).limit(limit).all()

    return [
        {
            "id": m.id,
            "date": m.created_at.isoformat(),
            "move_type": m.move_type.value,
            "product_id": m.product_id,
            "product_name": m.product.name if m.product else "Unknown",
            "quantity": float(m.quantity),
            "source_location": m.source_location.name if m.source_location else None,
            "dest_location": m.dest_location.name if m.dest_location else None,
            "reference": m.reference or "",
            "created_by": m.created_by.username if m.created_by else "Unknown",
        }
        for m in moves
    ]


@router.get("/low-stock")
def get_low_stock_items(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get low stock alert items."""
    items = InventoryService.get_low_stock_items(db)
    return {
        "total_items": len(items),
        "items": items,
    }
