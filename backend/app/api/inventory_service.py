"""
Inventory service for managing stock operations.
Handles receipts, deliveries, transfers, and adjustments.
"""
from decimal import Decimal
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.stock import Stock
from app.models.product import Product
from app.models.warehouse import Location
from app.models.stock_move import StockMove, StockMoveType
from app.models.operations import (
    Receipt, ReceiptItem, Delivery, DeliveryItem, Transfer, Adjustment,
    OperationStatus
)


class StockValidationError(Exception):
    """Raised when stock validation fails."""
    pass


class InventoryService:
    """Service for managing inventory operations."""

    @staticmethod
    def get_stock_quantity(db: Session, product_id: int, location_id: int) -> Decimal:
        """Get current stock quantity for a product at a location."""
        stock = db.query(Stock).filter(
            and_(Stock.product_id == product_id, Stock.location_id == location_id)
        ).first()
        return stock.quantity if stock else Decimal(0)

    @staticmethod
    def update_stock(db: Session, product_id: int, location_id: int, quantity_change: Decimal) -> Stock:
        """Update stock quantity for a product at a location."""
        stock = db.query(Stock).filter(
            and_(Stock.product_id == product_id, Stock.location_id == location_id)
        ).first()

        if stock:
            new_quantity = stock.quantity + quantity_change
            if new_quantity < 0:
                raise StockValidationError(f"Insufficient stock. Current: {stock.quantity}, Requested: {abs(quantity_change)}")
            stock.quantity = new_quantity
        else:
            # Create new stock record
            if quantity_change < 0:
                raise StockValidationError(f"Cannot reduce stock for non-existent product-location combination")
            stock = Stock(
                product_id=product_id,
                location_id=location_id,
                quantity=quantity_change
            )
            db.add(stock)

        db.flush()
        return stock

    @staticmethod
    def create_stock_move(
        db: Session,
        move_type: StockMoveType,
        product_id: int,
        quantity: Decimal,
        source_location_id: Optional[int] = None,
        dest_location_id: Optional[int] = None,
        reference: Optional[str] = None,
        created_by_id: Optional[int] = None,
    ) -> StockMove:
        """Create a stock ledger entry."""
        move = StockMove(
            move_type=move_type,
            product_id=product_id,
            quantity=quantity,
            source_location_id=source_location_id,
            dest_location_id=dest_location_id,
            reference=reference,
            created_by_id=created_by_id,
            status="Done"
        )
        db.add(move)
        db.flush()
        return move

    @staticmethod
    def create_receipt(
        db: Session,
        reference: str,
        supplier: str,
        items: list,
        created_by_id: int,
    ) -> Receipt:
        """
        Create a receipt (incoming goods).
        Args:
            items: List of dicts with product_id, location_id, quantity
        """
        # Validate all products and locations exist
        for item in items:
            product = db.query(Product).filter(Product.id == item["product_id"]).first()
            if not product:
                raise StockValidationError(f"Product {item['product_id']} not found")

            location = db.query(Location).filter(Location.id == item["location_id"]).first()
            if not location:
                raise StockValidationError(f"Location {item['location_id']} not found")

        # Create receipt
        receipt = Receipt(
            reference=reference,
            supplier=supplier,
            status=OperationStatus.DRAFT,
            created_by_id=created_by_id,
        )
        db.add(receipt)
        db.flush()

        # Create receipt items
        for item in items:
            receipt_item = ReceiptItem(
                receipt_id=receipt.id,
                product_id=item["product_id"],
                location_id=item["location_id"],
                quantity=Decimal(str(item["quantity"])),
            )
            db.add(receipt_item)
        db.flush()

        return receipt

    @staticmethod
    def complete_receipt(db: Session, receipt_id: int, created_by_id: int) -> Receipt:
        """Complete a receipt and update stock."""
        receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
        if not receipt:
            raise StockValidationError(f"Receipt {receipt_id} not found")

        if receipt.status == OperationStatus.COMPLETED:
            raise StockValidationError("Receipt already completed")

        # Process each item
        for item in receipt.items:
            quantity = Decimal(str(item.quantity))

            # Update stock
            InventoryService.update_stock(
                db,
                item.product_id,
                item.location_id,
                quantity
            )

            # Create stock move ledger entry
            move = InventoryService.create_stock_move(
                db,
                StockMoveType.RECEIPT,
                item.product_id,
                quantity,
                dest_location_id=item.location_id,
                reference=receipt.reference,
                created_by_id=created_by_id,
            )
            item.stock_move_id = move.id

        receipt.status = OperationStatus.COMPLETED
        db.flush()
        return receipt

    @staticmethod
    def create_delivery(
        db: Session,
        reference: str,
        customer: Optional[str],
        items: list,
        created_by_id: int,
    ) -> Delivery:
        """
        Create a delivery order (outgoing goods).
        Args:
            items: List of dicts with product_id, location_id, quantity
        """
        # Validate all products and locations exist
        for item in items:
            product = db.query(Product).filter(Product.id == item["product_id"]).first()
            if not product:
                raise StockValidationError(f"Product {item['product_id']} not found")

            location = db.query(Location).filter(Location.id == item["location_id"]).first()
            if not location:
                raise StockValidationError(f"Location {item['location_id']} not found")

            # Validate stock availability
            current_stock = InventoryService.get_stock_quantity(db, item["product_id"], item["location_id"])
            if current_stock < Decimal(str(item["quantity"])):
                raise StockValidationError(
                    f"Insufficient stock for product {item['product_id']} at location {item['location_id']}. "
                    f"Available: {current_stock}, Requested: {item['quantity']}"
                )

        # Create delivery
        delivery = Delivery(
            reference=reference,
            customer=customer,
            status=OperationStatus.DRAFT,
            created_by_id=created_by_id,
        )
        db.add(delivery)
        db.flush()

        # Create delivery items
        for item in items:
            delivery_item = DeliveryItem(
                delivery_id=delivery.id,
                product_id=item["product_id"],
                location_id=item["location_id"],
                quantity=Decimal(str(item["quantity"])),
            )
            db.add(delivery_item)
        db.flush()

        return delivery

    @staticmethod
    def complete_delivery(db: Session, delivery_id: int, created_by_id: int) -> Delivery:
        """Complete a delivery and update stock."""
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        if not delivery:
            raise StockValidationError(f"Delivery {delivery_id} not found")

        if delivery.status == OperationStatus.COMPLETED:
            raise StockValidationError("Delivery already completed")

        # Process each item
        for item in delivery.items:
            quantity = Decimal(str(item.quantity))

            # Update stock
            InventoryService.update_stock(
                db,
                item.product_id,
                item.location_id,
                -quantity  # Negative for outgoing
            )

            # Create stock move ledger entry
            move = InventoryService.create_stock_move(
                db,
                StockMoveType.DELIVERY,
                item.product_id,
                -quantity,
                source_location_id=item.location_id,
                reference=delivery.reference,
                created_by_id=created_by_id,
            )
            item.stock_move_id = move.id

        delivery.status = OperationStatus.COMPLETED
        db.flush()
        return delivery

    @staticmethod
    def create_transfer(
        db: Session,
        reference: str,
        product_id: int,
        source_location_id: int,
        dest_location_id: int,
        quantity: float,
        created_by_id: int,
    ) -> Transfer:
        """
        Create an internal transfer.
        """
        # Validate product and locations exist
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise StockValidationError(f"Product {product_id} not found")

        source_location = db.query(Location).filter(Location.id == source_location_id).first()
        if not source_location:
            raise StockValidationError(f"Source location {source_location_id} not found")

        dest_location = db.query(Location).filter(Location.id == dest_location_id).first()
        if not dest_location:
            raise StockValidationError(f"Destination location {dest_location_id} not found")

        # Validate stock availability
        current_stock = InventoryService.get_stock_quantity(db, product_id, source_location_id)
        if current_stock < Decimal(str(quantity)):
            raise StockValidationError(
                f"Insufficient stock at source location. Available: {current_stock}, Requested: {quantity}"
            )

        # Create transfer
        transfer = Transfer(
            reference=reference,
            product_id=product_id,
            source_location_id=source_location_id,
            dest_location_id=dest_location_id,
            quantity=Decimal(str(quantity)),
            status=OperationStatus.DRAFT,
            created_by_id=created_by_id,
        )
        db.add(transfer)
        db.flush()

        return transfer

    @staticmethod
    def complete_transfer(db: Session, transfer_id: int, created_by_id: int) -> Transfer:
        """Complete a transfer and update stock."""
        transfer = db.query(Transfer).filter(Transfer.id == transfer_id).first()
        if not transfer:
            raise StockValidationError(f"Transfer {transfer_id} not found")

        if transfer.status == OperationStatus.COMPLETED:
            raise StockValidationError("Transfer already completed")

        quantity = Decimal(str(transfer.quantity))

        # Reduce from source
        InventoryService.update_stock(
            db,
            transfer.product_id,
            transfer.source_location_id,
            -quantity
        )

        # Increase at destination
        InventoryService.update_stock(
            db,
            transfer.product_id,
            transfer.dest_location_id,
            quantity
        )

        # Create ledger entries
        source_move = InventoryService.create_stock_move(
            db,
            StockMoveType.TRANSFER,
            transfer.product_id,
            -quantity,
            source_location_id=transfer.source_location_id,
            dest_location_id=transfer.dest_location_id,
            reference=transfer.reference,
            created_by_id=created_by_id,
        )
        transfer.source_move_id = source_move.id

        dest_move = InventoryService.create_stock_move(
            db,
            StockMoveType.TRANSFER,
            transfer.product_id,
            quantity,
            source_location_id=transfer.source_location_id,
            dest_location_id=transfer.dest_location_id,
            reference=transfer.reference,
            created_by_id=created_by_id,
        )
        transfer.dest_move_id = dest_move.id

        transfer.status = OperationStatus.COMPLETED
        db.flush()
        return transfer

    @staticmethod
    def create_adjustment(
        db: Session,
        reference: str,
        product_id: int,
        location_id: int,
        actual_quantity: float,
        reason: Optional[str],
        created_by_id: int,
    ) -> Adjustment:
        """
        Create an inventory adjustment.
        """
        # Validate product and location exist
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise StockValidationError(f"Product {product_id} not found")

        location = db.query(Location).filter(Location.id == location_id).first()
        if not location:
            raise StockValidationError(f"Location {location_id} not found")

        # Get system quantity
        system_quantity = InventoryService.get_stock_quantity(db, product_id, location_id)
        adjustment_quantity = Decimal(str(actual_quantity)) - system_quantity

        # Create adjustment
        adjustment = Adjustment(
            reference=reference,
            product_id=product_id,
            location_id=location_id,
            system_quantity=system_quantity,
            actual_quantity=Decimal(str(actual_quantity)),
            adjustment_quantity=adjustment_quantity,
            reason=reason,
            status=OperationStatus.DRAFT,
            created_by_id=created_by_id,
        )
        db.add(adjustment)
        db.flush()

        return adjustment

    @staticmethod
    def complete_adjustment(db: Session, adjustment_id: int, created_by_id: int) -> Adjustment:
        """Complete an adjustment and update stock."""
        adjustment = db.query(Adjustment).filter(Adjustment.id == adjustment_id).first()
        if not adjustment:
            raise StockValidationError(f"Adjustment {adjustment_id} not found")

        if adjustment.status == OperationStatus.COMPLETED:
            raise StockValidationError("Adjustment already completed")

        # Update stock
        InventoryService.update_stock(
            db,
            adjustment.product_id,
            adjustment.location_id,
            adjustment.adjustment_quantity
        )

        # Create ledger entry
        move = InventoryService.create_stock_move(
            db,
            StockMoveType.ADJUSTMENT,
            adjustment.product_id,
            adjustment.adjustment_quantity,
            source_location_id=adjustment.location_id,
            reference=f"{adjustment.reference} - {adjustment.reason or 'Inventory adjustment'}",
            created_by_id=created_by_id,
        )
        adjustment.stock_move_id = move.id

        adjustment.status = OperationStatus.COMPLETED
        db.flush()
        return adjustment

    @staticmethod
    def get_low_stock_items(db: Session, threshold_days: int = 7) -> list:
        """Get products with stock below reorder point."""
        items = []
        products = db.query(Product).filter(Product.reorder_point > 0).all()

        for product in products:
            stocks = db.query(Stock).filter(Stock.product_id == product.id).all()
            total_stock = sum(Decimal(str(s.quantity)) for s in stocks)

            if total_stock <= product.reorder_point:
                items.append({
                    "product_id": product.id,
                    "product_name": product.name,
                    "sku": product.sku,
                    "current_stock": float(total_stock),
                    "reorder_point": product.reorder_point,
                    "status": "out_of_stock" if total_stock == 0 else "low_stock"
                })

        return items
