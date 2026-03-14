# CoreInventory Quick Start Guide

## System Architecture

The inventory system is organized around 4 core operations:

```
Products + Locations + Stock
          ↓
   Inventory Operations
          ↓
   Receipts → Deliveries
   Transfers ← Adjustments
          ↓
   Stock Ledger (Audit Trail)
```

---

## Quick Examples

### 1. Receiving Goods from Vendor

**Step 1: Create a receipt**
```bash
curl -X POST http://localhost:8000/api/stock-moves/receipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "REC-2026-0001",
    "supplier": "Acme Manufacturing",
    "items": [
      {
        "product_id": 1,
        "location_id": 1,
        "quantity": 100
      }
    ]
  }'
```

**Step 2: Validate receipt (updates stock)**
```bash
curl -X POST http://localhost:8000/api/stock-moves/receipts/1/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Result**: Stock at Location 1 for Product 1 increased by 100 units.

---

### 2. Delivering Goods to Customer

**Step 1: Create delivery (validates stock exists)**
```bash
curl -X POST http://localhost:8000/api/stock-moves/deliveries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "DEL-2026-0001",
    "customer": "ABC Corporation",
    "items": [
      {
        "product_id": 1,
        "location_id": 1,
        "quantity": 20
      }
    ]
  }'
```

**Step 2: Validate delivery (updates stock)**
```bash
curl -X POST http://localhost:8000/api/stock-moves/deliveries/1/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Result**: Stock at Location 1 for Product 1 decreased by 20 units.

---

### 3. Moving Stock Between Locations

**Create and validate transfer**
```bash
# Create transfer
curl -X POST http://localhost:8000/api/stock-moves/transfers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "TRF-2026-0001",
    "product_id": 1,
    "source_location_id": 1,
    "dest_location_id": 2,
    "quantity": 30
  }'

# Validate transfer
curl -X POST http://localhost:8000/api/stock-moves/transfers/1/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Result**: 
- Location 1: -30 units
- Location 2: +30 units

---

### 4. Correcting Stock Discrepancies

**Physical count shows 97 units but system shows 100**

```bash
# Create adjustment
curl -X POST http://localhost:8000/api/stock-moves/adjustments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "ADJ-2026-0001",
    "product_id": 1,
    "location_id": 1,
    "actual_quantity": 97,
    "reason": "3 units damaged during inventory count"
  }'

# Validate adjustment
curl -X POST http://localhost:8000/api/stock-moves/adjustments/1/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Result**: Stock decreased by 3 units (auto-calculated)

---

### 5. Viewing Stock Movement History

```bash
# Get all movements
curl http://localhost:8000/api/stock-moves/ledger \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by product
curl http://localhost:8000/api/stock-moves/ledger?product_id=1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by movement type
curl http://localhost:8000/api/stock-moves/ledger?move_type=receipt \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Checking Low Stock Items

```bash
curl http://localhost:8000/api/stock-moves/low-stock \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Returns**: All products where current stock ≤ reorder_point

---

## API Response Examples

### Successful Receipt Creation (201)
```json
{
  "id": 1,
  "reference": "REC-2026-0001",
  "supplier": "Acme Manufacturing",
  "status": "draft",
  "created_at": "2026-03-14T10:30:00",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 100,
      "location_id": 1
    }
  ]
}
```

### Insufficient Stock Error (400)
```json
{
  "detail": "Insufficient stock for product 1 at location 1. Available: 10, Requested: 20"
}
```

### Stock Ledger Entry
```json
{
  "id": 1,
  "date": "2026-03-14T10:30:00",
  "move_type": "receipt",
  "product_id": 1,
  "product_name": "Steel Rod",
  "quantity": 100,
  "source_location": null,
  "dest_location": "Main Warehouse",
  "reference": "REC-2026-0001",
  "created_by": "John Manager"
}
```

---

## Key Concepts

### Draft Workflow
All operations start in "draft" state. This allows review before committing:
1. Create operation (draft)
2. Review details
3. Validate operation (commits changes)
4. Or delete if needed

### Stock Delta
Stock changes are tracked as deltas:
- **Receipt**: +quantity
- **Delivery**: -quantity
- **Transfer**: -quantity (source), +quantity (dest)
- **Adjustment**: ±quantity (calculated)

### Ledger Entry
Every operation creates an immutable StockMove entry for audit purposes. Cannot edit/delete completed operations.

### Multi-Location
Each product can have different stock quantities at multiple locations. Track the same product across warehouses.

---

## Testing the System

### 1. Setup Test Data
```bash
# Create a product
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "category_id": 1,
    "uom": "pcs",
    "reorder_point": 10
  }'

# Create warehouses and locations (if not exists)
# Then use their IDs in operations above
```

### 2. Test Workflow
```
1. Create Receipt → Validate
2. Create Delivery → Validate
3. Create Transfer → Validate
4. Check Ledger
5. Create Adjustment if needed
```

### 3. Verify Results
```bash
# Check final stock by loading product from products endpoint
curl http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer TOKEN"

# Check ledger to see all movements
curl http://localhost:8000/api/stock-moves/ledger?product_id=1 \
  -H "Authorization: Bearer TOKEN"
```

---

## Common Operations

| Try This | Expected Result |
|----------|-----------------|
| Receive 100 units | Stock +100 |
| Deliver 20 units (from 100) | Stock -20 → 80 remaining |
| Transfer 30 to another location | Source -30, Dest +30 |
| Physical count is 75, adjust from 80 | -5 automatic adjustment |
| Deliver 100 units (stock is 75) | ERROR: Insufficient stock |
| Create receipt, don't validate | No stock change (still draft) |

---

## Database Tables Created

- `stocks` - Current stock per product-location
- `receipts` - Incoming goods orders
- `receipt_items` - Line items in receipts
- `deliveries` - Outgoing goods orders
- `delivery_items` - Line items in deliveries
- `transfers` - Internal transfers
- `adjustments` - Stock corrections
- `stock_moves` - Ledger (immutable audit trail)

---

## Important Notes

✅ **Always validate operations** to update stock  
✅ **Check stock ledger** for complete audit trail  
✅ **Use references** for document identification  
✅ **Review before validating** while in draft  
✅ **Cannot delete completed** operations  
✅ **All timestamps in UTC** (ISO 8601 format)  
✅ **Stock quantities are decimals** (supports partial units)  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Product not found" | Verify product_id exists |
| "Location not found" | Verify location_id exists |
| "Insufficient stock" | Check current stock before delivery |
| "Can only delete draft" | Must be in draft status |
| "Reference already exists" | Use unique reference per operation |

---

## Performance Tips

- Use pagination: `limit=50&skip=0`
- Filter ledger by date range in application
- Cache low-stock alerts (recompute periodically)
- Batch operations where possible
