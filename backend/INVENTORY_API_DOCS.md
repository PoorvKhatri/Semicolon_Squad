# CoreInventory API Documentation

## Overview
Complete REST API for managing inventory operations including receipts, deliveries, internal transfers, and stock adjustments with real-time ledger tracking.

---

## Authentication
All endpoints require JWT token authentication via the `Authorization: Bearer <token>` header.

---

## Data Models

### Stock Model
```
Stock:
  id: int
  product_id: int (FK)
  location_id: int (FK)
  quantity: decimal
  updated_at: datetime
```

### Operation Models
All operations support Draft → Completed workflow.

**Receipt** (Incoming Goods):
- reference: str (unique)
- supplier: str
- status: draft | pending | completed | cancelled
- items: List[ReceiptItem]

**Delivery** (Outgoing Goods):
- reference: str (unique)
- customer: str
- status: draft | pending | completed | cancelled
- items: List[DeliveryItem]

**Transfer** (Internal):
- reference: str (unique)
- product_id: int
- source_location_id: int
- dest_location_id: int
- quantity: decimal
- status: draft | pending | completed | cancelled

**Adjustment** (Stock Correction):
- reference: str (unique)
- product_id: int
- location_id: int
- system_quantity: decimal
- actual_quantity: decimal
- adjustment_quantity: decimal
- reason: str
- status: draft | pending | completed | cancelled

---

## API Endpoints

### RECEIPTS (Incoming Stock)

#### Create Receipt
```http
POST /api/stock-moves/receipts
Content-Type: application/json
Authorization: Bearer <token>

{
  "reference": "REC-2026-001",
  "supplier": "ABC Supplier Co.",
  "items": [
    {
      "product_id": 1,
      "location_id": 5,
      "quantity": 100
    },
    {
      "product_id": 2,
      "location_id": 5,
      "quantity": 50
    }
  ]
}

Response: 201 Created
{
  "id": 1,
  "reference": "REC-2026-001",
  "supplier": "ABC Supplier Co.",
  "status": "draft",
  "created_at": "2026-03-14T10:00:00",
  "items": []
}
```

#### List Receipts
```http
GET /api/stock-moves/receipts?skip=0&limit=10&status_filter=draft
Response: 200 OK
[
  {
    "id": 1,
    "reference": "REC-2026-001",
    "supplier": "ABC Supplier Co.",
    "status": "draft",
    "items_count": 2,
    "total_quantity": 150,
    "created_at": "2026-03-14T10:00:00",
    "created_by": "John Doe"
  }
]
```

#### Get Receipt Details
```http
GET /api/stock-moves/receipts/{receipt_id}
Response: 200 OK
{
  "id": 1,
  "reference": "REC-2026-001",
  "supplier": "ABC Supplier Co.",
  "status": "draft",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Steel Rod",
      "location_id": 5,
      "location_name": "Main Warehouse",
      "quantity": 100
    }
  ]
}
```

#### Validate Receipt (Confirm & Update Stock)
```http
POST /api/stock-moves/receipts/{receipt_id}/validate
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "message": "Receipt validated and stock updated"
}
```

#### Delete Receipt
```http
DELETE /api/stock-moves/receipts/{receipt_id}
Authorization: Bearer <token>

Response: 204 No Content
```

---

### DELIVERIES (Outgoing Stock)

#### Create Delivery
```http
POST /api/stock-moves/deliveries
Content-Type: application/json
Authorization: Bearer <token>

{
  "reference": "DEL-2026-001",
  "customer": "Customer XYZ",
  "items": [
    {
      "product_id": 1,
      "location_id": 5,
      "quantity": 20
    }
  ]
}

Response: 201 Created
{
  "id": 1,
  "reference": "DEL-2026-001",
  "customer": "Customer XYZ",
  "status": "draft",
  "created_at": "2026-03-14T11:00:00"
}
```

**Validation**: System checks if sufficient stock exists before creating delivery.

#### List Deliveries
```http
GET /api/stock-moves/deliveries?status_filter=completed
Response: 200 OK
[
  {
    "id": 1,
    "reference": "DEL-2026-001",
    "customer": "Customer XYZ",
    "status": "completed",
    "items_count": 1,
    "total_quantity": 20,
    "created_at": "2026-03-14T11:00:00",
    "created_by": "Jane Doe"
  }
]
```

#### Get Delivery Details
```http
GET /api/stock-moves/deliveries/{delivery_id}
```

#### Validate Delivery (Confirm & Update Stock)
```http
POST /api/stock-moves/deliveries/{delivery_id}/validate
```

#### Delete Delivery
```http
DELETE /api/stock-moves/deliveries/{delivery_id}
```

---

### TRANSFERS (Internal Stock Movement)

#### Create Transfer
```http
POST /api/stock-moves/transfers
Content-Type: application/json
Authorization: Bearer <token>

{
  "reference": "TRF-2026-001",
  "product_id": 1,
  "source_location_id": 5,
  "dest_location_id": 6,
  "quantity": 30
}

Response: 201 Created
{
  "id": 1,
  "reference": "TRF-2026-001",
  "product_id": 1,
  "source_location_id": 5,
  "dest_location_id": 6,
  "quantity": 30,
  "status": "draft",
  "created_at": "2026-03-14T12:00:00"
}
```

**Logic**: 
- Decreases stock at source location
- Increases stock at destination location
- Creates two ledger entries for audit trail

#### List Transfers
```http
GET /api/stock-moves/transfers?status_filter=draft
```

#### Get Transfer Details
```http
GET /api/stock-moves/transfers/{transfer_id}
```

#### Validate Transfer (Confirm & Update Stock)
```http
POST /api/stock-moves/transfers/{transfer_id}/validate
```

#### Delete Transfer
```http
DELETE /api/stock-moves/transfers/{transfer_id}
```

---

### ADJUSTMENTS (Stock Corrections)

#### Create Adjustment
```http
POST /api/stock-moves/adjustments
Content-Type: application/json
Authorization: Bearer <token>

{
  "reference": "ADJ-2026-001",
  "product_id": 1,
  "location_id": 5,
  "actual_quantity": 97,
  "reason": "Physical count: 3 units damaged"
}

Response: 201 Created
{
  "id": 1,
  "reference": "ADJ-2026-001",
  "product_id": 1,
  "location_id": 5,
  "system_quantity": 100,
  "actual_quantity": 97,
  "adjustment_quantity": -3,
  "reason": "Physical count: 3 units damaged",
  "status": "draft",
  "created_at": "2026-03-14T13:00:00"
}
```

**Logic**:
- System automatically calculates difference
- adjustment_quantity = actual_quantity - system_quantity
- Can be positive (found extra) or negative (missing/damaged)

#### List Adjustments
```http
GET /api/stock-moves/adjustments
```

#### Get Adjustment Details
```http
GET /api/stock-moves/adjustments/{adjustment_id}
```

#### Validate Adjustment (Confirm & Update Stock)
```http
POST /api/stock-moves/adjustments/{adjustment_id}/validate
```

#### Delete Adjustment
```http
DELETE /api/stock-moves/adjustments/{adjustment_id}
```

---

### STOCK LEDGER (Audit Trail)

#### Get Stock Movement History
```http
GET /api/stock-moves/ledger?limit=50&move_type=receipt&product_id=1
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "date": "2026-03-14T10:00:00",
    "move_type": "receipt",
    "product_id": 1,
    "product_name": "Steel Rod",
    "quantity": 100,
    "source_location": null,
    "dest_location": "Main Warehouse",
    "reference": "REC-2026-001",
    "created_by": "John Doe"
  },
  {
    "id": 2,
    "date": "2026-03-14T12:00:00",
    "move_type": "transfer",
    "product_id": 1,
    "product_name": "Steel Rod",
    "quantity": -30,
    "source_location": "Main Warehouse",
    "dest_location": "Production Floor",
    "reference": "TRF-2026-001",
    "created_by": "Jane Doe"
  }
]
```

**Query Parameters**:
- `move_type`: receipt | delivery | transfer | adjustment
- `product_id`: Filter by product
- `location_id`: Filter by warehouse location
- `limit`: Max results per query
- `skip`: Pagination offset

---

### LOW STOCK ALERTS

#### Get Low Stock Items
```http
GET /api/stock-moves/low-stock
Authorization: Bearer <token>

Response: 200 OK
{
  "total_items": 2,
  "items": [
    {
      "product_id": 5,
      "product_name": "Fasteners Box",
      "sku": "FAST-001",
      "current_stock": 5,
      "reorder_point": 10,
      "status": "low_stock"
    },
    {
      "product_id": 8,
      "product_name": "Lubricant",
      "sku": "LUB-001",
      "current_stock": 0,
      "reorder_point": 20,
      "status": "out_of_stock"
    }
  ]
}
```

---

## System Rules & Business Logic

1. **Stock Validation**
   - Stock cannot go negative
   - Deliveries validate available stock before creation
   - Transfers validate source location stock

2. **Workflow**
   - All operations start as Draft
   - Validation (POST /validate) updates stock and creates ledger entries
   - Cannot revert completed operations (delete only works on draft)

3. **Ledger Tracking**
   - Every stock change creates StockMove entry
   - Ledger is immutable audit trail
   - Useful for compliance and traceability

4. **SKU Uniqueness**
   - Product SKUs must be unique
   - References (receipt/delivery/transfer/adjustment) must be unique

5. **Multi-Location Support**
   - Each product can have stock at multiple locations
   - Transfers move between locations without changing total

---

## Workflow Example

### Scenario: Receive goods, move to production, deliver to customer

**Step 1: Create Receipt**
```
POST /receipts
{
  "reference": "REC-001",
  "supplier": "Vendor A",
  "items": [{"product_id": 1, "location_id": 1, "quantity": 100}]
}
Status: draft (nothing updated yet)
```

**Step 2: Validate Receipt**
```
POST /receipts/1/validate
→ Stock at Location 1 increased by 100
→ Ledger entry created: receipt +100
```

**Step 3: Create Transfer**
```
POST /transfers
{
  "reference": "TRF-001",
  "product_id": 1,
  "source_location_id": 1,
  "dest_location_id": 2,
  "quantity": 80
}
Status: draft
```

**Step 4: Validate Transfer**
```
POST /transfers/1/validate
→ Location 1 stock: -80
→ Location 2 stock: +80
→ Two ledger entries created
```

**Step 5: Create Delivery**
```
POST /deliveries
{
  "reference": "DEL-001",
  "customer": "Customer X",
  "items": [{"product_id": 1, "location_id": 2, "quantity": 50}]
}
Status: draft (validated stock check passes)
```

**Step 6: Validate Delivery**
```
POST /deliveries/1/validate
→ Location 2 stock: -50
→ Ledger entry created: delivery -50
```

**Final State**:
- Location 1: 100 - 80 = 20
- Location 2: 80 - 50 = 30
- Total: 50 units in system
- Complete ledger trail showing all movements

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error
  - Example: Insufficient stock
  - Example: Product not found
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Example error response:
```json
{
  "detail": "Insufficient stock for product 1 at location 5. Available: 20, Requested: 30"
}
```

---

## Summary

This inventory system provides:

✅ **Complete Stock Operations**: Receipts, Deliveries, Transfers, Adjustments
✅ **Real-time Stock Tracking**: Automatic updates on validation
✅ **Immutable Audit Trail**: Full ledger of all movements
✅ **Business Rule Enforcement**: No negative stock, SKU uniqueness, etc.
✅ **Low Stock Alerts**: Automatic reorder point checking
✅ **Multi-warehouse Support**: Track stock across locations
✅ **Draft Workflow**: Create and review before committing
✅ **Transaction Safety**: Rollback on errors

All operations are fully implemented and production-ready.
