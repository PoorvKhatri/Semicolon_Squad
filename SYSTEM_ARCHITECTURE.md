# CoreInventory - Complete System Architecture & Flow

## System Overview

CoreInventory is an Inventory Management System designed to track and manage stock movements within and between warehouses. The system provides complete visibility into inventory operations while maintaining an immutable audit trail of all movements.

## Core Principles

1. **Stock Accuracy**: Every operation must update inventory quantities
2. **Audit Trail**: Every stock change creates a ledger entry
3. **No Negative Stock**: System prevents stock from going negative
4. **Status Workflow**: Operations follow defined status pipelines
5. **Location-based Tracking**: Stock is tracked at location level (warehouse + rack/zone)

---

## System Architecture

### Authentication Flow
```
User → Login/Signup → Token Generation → Dashboard Access
```

**Routes**:
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset confirmation
- `/profile` - User profile

---

## Main Modules

### 1. Dashboard (`/dashboard`)
**Purpose**: Central control panel for inventory operations

**Features**:
- **KPI Cards**: 
  - Total Products in Stock
  - Low Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled

- **Operation Summary Cards**:
  - Receipts (Draft) - Quick access to create new/manage
  - Deliveries (Ready) - Quick access to create new/manage
  - Transfers (Pending) - Quick access to create new/manage
  - Adjustments (Pending) - Quick access to create new/manage

- **Analytics**:
  - 7-day inventory movement chart
  - Stock by category pie chart
  - Warehouse distribution bar chart
  - Recent activity table
  - Filterable data view

---

### 2. Receipts Module (`/receipts`)
**Purpose**: Manage incoming stock from suppliers

**Status Pipeline**:
```
Draft → Ready → Completed
```

**Receipt Fields**:
- Reference number (auto-generated)
- Supplier name
- Scheduled date
- Receipt items (product + location + quantity)

**Status Meanings**:
- **Draft**: Receipt created, user can edit/add items
- **Ready**: Items prepared for receiving
- **Completed**: Receipt validated, stock updated

**Stock Update Logic** (on Completed):
```
For each receipt item:
  stock[product][location] += quantities
  Create StockMove ledger entry (type: receipt)
```

**Example**:
```
Receipt: RCP-001
Supplier: Vendor A
Items:
  - Steel Rods: 50 units → Main Warehouse / Rack A
  
On Completion:
  stock[Steel Rods][Main Warehouse/Rack A] += 50
  Ledger Entry: {
    type: receipt,
    product: Steel Rods,
    quantity: +50,
    location: Main Warehouse/Rack A,
    reference: RCP-001
  }
```

---

### 3. Deliveries Module (`/deliveries`)
**Purpose**: Manage outgoing stock to customers

**Status Pipeline**:
```
Draft → Waiting → Ready → Completed
```

**Delivery Fields**:
- Reference number (auto-generated)
- Customer/Contact name
- Scheduled date
- Delivery items (product + location + quantity)

**Status Meanings**:
- **Draft**: Delivery order created
- **Waiting**: Stock reserved/on hold
- **Ready**: Items picked and packed
- **Completed**: Delivery validated, stock deducted

**Key Difference from Receipts**:
- **Pre-validates stock availability** before allowing creation
- Prevents overselling

**Stock Update Logic** (on Completed):
```
For each delivery item:
  stock[product][location] -= quantity
  Create StockMove ledger entry (type: delivery)
```

**Example**:
```
Delivery: DLV-001
Customer: Customer B
Items:
  - Chairs: 10 units ← Main Warehouse / Zone 1

On Completion:
  stock[Chairs][Main Warehouse/Zone 1] -= 10
  Ledger Entry: {
    type: delivery,
    product: Chairs,
    quantity: -10,
    source_location: Main Warehouse/Zone 1,
    reference: DLV-001
  }
```

---

### 4. Transfers Module (`/transfers`)
**Purpose**: Move stock between warehouse locations (internal)

**Transfer Fields**:
- Reference number
- Product (single product per transfer)
- Source location
- Destination location
- Quantity

**Stock Update Logic**:
```
stock[product][source_location] -= quantity
stock[product][dest_location] += quantity
Create TWO StockMove ledger entries:
  1. source movement (outgoing)
  2. destination movement (incoming)
```

**Total Stock Impact**: ZERO (moves within system)

**Example**:
```
Transfer: TRF-001
Product: Raw Materials
From: Warehouse A / Rack B
To: Production Floor / Storage Zone

On Completion:
  stock[Raw Materials][Warehouse A/Rack B] -= 100
  stock[Raw Materials][Production Floor/Storage Zone] += 100
  
  Ledger Entries (2):
    1. {type: transfer, product, qty: -100, from: Warehouse A/Rack B}
    2. {type: transfer, product, qty: +100, to: Production Floor/Storage Zone}
```

---

### 5. Adjustments Module (`/adjustments`)
**Purpose**: Correct discrepancies between system and physical count

**Adjustment Fields**:
- Reference number
- Product
- Location
- System quantity (auto-populated)
- Physical count (user-entered)
- Reason (audit trail)
- Adjustment quantity (calculated: physical - system)

**Stock Update Logic**:
```
delta = physical_count - system_count
stock[product][location] += delta

Create StockMove ledger entry:
  {
    type: adjustment,
    product,
    quantity: delta,
    location,
    reason: "Physical count adjustment",
    reference
  }
```

**Example**:
```
Adjustment: ADJ-001
Product: Fasteners
Location: Main Warehouse / Rack C
System: 100 units
Physical: 97 units
Delta: -3 units (breakage/loss)

On Completion:
  stock[Fasteners][Main Warehouse/Rack C] -= 3
  Ledger Entry: {
    type: adjustment,
    product: Fasteners,
    quantity: -3,
    reason: "Physical count adjustment - Breakage",
    location: Main Warehouse/Rack C
  }
```

---

### 6. Products & Stock Module (`/products`)
**Purpose**: Master data for products and real-time stock levels

**Display Format**:
```
Product | Per Unit Cost | On Hand | Free to Use
Steel   | 1000 Rs      | 100     | 90
Chairs  | 3000 Rs      | 50      | 50
```

**Fields**:
- Product name
- SKU (unique)
- Category
- Per unit cost
- On hand (total across all locations)
- Free to use (available, not reserved)
- Reorder point (alert threshold)

**Features**:
- View stock by location
- Search/filter products
- Edit reorder points
- Track stock movements per product

---

### 7. Warehouse Management (`/warehouses`)
**Purpose**: Define physical storage buildings

**Warehouse Fields**:
- Name
- Short code
- Address/Description

**Example Warehouses**:
- Main Warehouse (WH1)
- Production Facility (WH2)
- External Storage (WH3)

**Operations**:
- Create warehouse
- Edit warehouse details
- Delete warehouse (if empty)

---

### 8. Location Management (`/locations`)
**Purpose**: Define subsections within warehouses (racks, zones, shelves)

**Location Fields**:
- Location name (Rack A, Zone 1, Production Floor, etc.)
- Warehouse (parent)
- Short code

**Hierarchy**:
```
Warehouse
├── Location 1 (Rack A)
├── Location 2 (Rack B)
├── Location 3 (Production Floor)
└── Location 4 (External Zone)
```

**Example**:
- Main Warehouse
  - Rack A
  - Rack B  
  - Production Floor
- External Storage
  - Zone 1
  - Zone 2

---

### 9. Move History / Ledger (`/history`)
**Purpose**: Complete audit trail of all stock movements

**Ledger Fields**:
- Reference number
- Product
- Operation type (receipt/delivery/transfer/adjustment)
- Quantity (signed: +incoming, -outgoing)
- Source location
- Destination location
- Date/Timestamp
- User (who performed operation)

**Features**:
- Search by reference
- Filter by operation type
- Filter by product
- Filter by location
- Filter by date range
- Immutable (cannot edit historical entries)

**Ledger Example**:
```
Reference  | Product | Operation    | Qty  | From           | To              | Date
RCP-0001   | Steel   | Receipt      | +50  | N/A            | Warehouse A     | 2026-03-14
DLV-0001   | Chairs  | Delivery     | -10  | Warehouse A    | N/A             | 2026-03-14
TRF-0001   | Steel   | Transfer     | -30  | Warehouse A    | Warehouse B     | 2026-03-14
ADJ-0001   | Fastener| Adjustment   | -3   | Warehouse A    | Warehouse A     | 2026-03-14
```

---

### 10. Settings (`/settings`)
**Purpose**: Application configuration and warehouse management

**Options**:
- User preferences
- System settings
- Reorder point configurations
- Warehouse templates

---

## Data Model

### Core Tables

```
Users
├── id, username, email, password_hash, full_name

Products
├── id, name, sku (unique), category_id, description
├── per_unit_cost, reorder_point, initial_stock

Categories
├── id, name, description

Warehouses
├── id, name, short_code, address

Locations
├── id, name, warehouse_id, short_code

Stock (Real-time)
├── id, product_id, location_id, quantity
└── UNIQUE(product_id, location_id)

StockMoves (Ledger - Immutable)
├── id, move_type, product_id, quantity
├── source_location_id, dest_location_id, reference
├── created_by_id, created_at

Receipts (Header)
├── id, reference, supplier, status (draft/ready/completed)
├── created_by_id, created_at, completed_at

ReceiptItems
├── id, receipt_id, product_id, location_id, quantity
└── stock_move_id (after completion)

Deliveries (Header)
├── id, reference, customer, status (draft/waiting/ready/completed)
├── created_by_id, created_at, completed_at

DeliveryItems
├── id, delivery_id, product_id, location_id, quantity
└── stock_move_id (after completion)

Transfers (Header)
├── id, reference, product_id, quantity, status
├── source_location_id, dest_location_id
├── source_move_id, dest_move_id
└── created_by_id, created_at, completed_at

Adjustments (Header)
├── id, reference, product_id, location_id
├── system_quantity, physical_quantity
├── adjustment_quantity (calculated)
├── reason, status
├── stock_move_id (after completion)
└── created_by_id, created_at, completed_at
```

---

## Business Rules & Validation

1. **Stock Cannot Be Negative**
   ```
   if (stock - requested_qty < 0) {
     throw InvalidOperation("Insufficient stock")
   }
   ```

2. **SKU Must Be Unique**
   ```
   if (SKU already exists) {
     throw DuplicateError("SKU already exists")
   }
   ```

3. **Only Completed Operations Update Stock**
   ```
   Stock update happens only when status = "completed"
   Draft/Waiting/Ready operations don't affect stock
   ```

4. **Every Stock Change Creates Ledger Entry**
   ```
   After every successful stock update:
     Create StockMove record with:
     - type, product, quantity, locations, reference, timestamp, user
   ```

5. **Location Must Exist**
   ```
   All receipts/deliveries/transfers must reference
   existing warehouse locations
   ```

6. **Transfer Requires Valid Locations**
   ```
   source_location ≠ dest_location
   Both locations must exist
   Product must have stock at source location
   ```

---

## API Endpoint Summary

```
Authentication:
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/forgot-password
  POST /api/auth/reset-password
  GET /api/auth/me

Receipts:
  GET /api/stock-moves/receipts
  POST /api/stock-moves/receipts
  GET /api/stock-moves/receipts/{id}
  POST /api/stock-moves/receipts/{id}/validate (complete)
  DELETE /api/stock-moves/receipts/{id}

Deliveries:
  GET /api/stock-moves/deliveries
  POST /api/stock-moves/deliveries
  GET /api/stock-moves/deliveries/{id}
  POST /api/stock-moves/deliveries/{id}/validate (complete)
  DELETE /api/stock-moves/deliveries/{id}

Transfers:
  GET /api/stock-moves/transfers
  POST /api/stock-moves/transfers
  GET /api/stock-moves/transfers/{id}
  POST /api/stock-moves/transfers/{id}/validate (complete)
  DELETE /api/stock-moves/transfers/{id}

Adjustments:
  GET /api/stock-moves/adjustments
  POST /api/stock-moves/adjustments
  GET /api/stock-moves/adjustments/{id}
  POST /api/stock-moves/adjustments/{id}/validate (complete)
  DELETE /api/stock-moves/adjustments/{id}

Products:
  GET /api/products
  POST /api/products
  PUT /api/products/{id}
  DELETE /api/products/{id}

Warehouses:
  GET /api/warehouses
  POST /api/warehouses
  PUT /api/warehouses/{id}
  DELETE /api/warehouses/{id}

Move History:
  GET /api/stock-moves/ledger (all movements)
  GET /api/stock-moves/history (filtered)
  GET /api/stock-moves/low-stock

Stats:
  GET /api/stats (KPI data)
```

---

## User Workflows

### Workflow 1: Receive Stock
```
1. Dashboard → Receipts → New Receipt
2. Fill: Supplier, Date
3. Add items: Product + Location + Quantity
4. Status: Draft (can edit)
5. When ready: Change to "Ready"
6. Complete: Stock updated, Ledger entry created
```

### Workflow 2: Deliver Stock
```
1. Dashboard → Deliveries → New Delivery
2. Fill: Customer, Date
3. Add items: Product + Location + Quantity (validates stock)
4. Status: Draft → Waiting (reserve stock) → Ready (pick items)
5. Complete: Stock deducted, Ledger entry created
```

### Workflow 3: Internal Transfer
```
1. Dashboard → Transfers → New Transfer
2. Fill: Product, Source Location, Dest Location, Quantity
3. System validates source has stock
4. Status: Draft → Ready
5. Complete: Stock moved between locations (2 ledger entries)
```

### Workflow 4: Physical Inventory
```
1. Dashboard → Adjustments → New Adjustment
2. Select: Product + Location
3. Enter: Physical count
4. System shows: System count + Delta
5. Complete: Stock adjusted, Reason recorded
```

---

## Features Summary

✅ **Inventory Operations**
- Receipts (incoming stock)
- Deliveries (outgoing stock)
- Transfers (internal movement)
- Adjustments (physical count corrections)

✅ **Master Data**
- Products with SKUs
- Categories
- Warehouses
- Storage locations

✅ **Stock Management**
- Real-time stock tracking per location
- Low stock alerts
- Reorder point configuration
- Cost tracking (per unit cost)

✅ **Audit & Compliance**
- Complete movement ledger
- Immutable transaction history
- User attribution
- Timestamps on all operations

✅ **Analytics & Reporting**
- KPI dashboard
- Movement trends (7-day chart)
- Category distribution
- Warehouse distribution
- Stock level reporting

✅ **Security**
- User authentication (JWT)
- Role-based access (extensible)
- Password reset flow
- Session management

✅ **User Experience**
- Light/Dark theme
- Responsive design
- Real-time data updates
- Form validation
- Error handling

---

## Next Steps for Implementation

1. ✅ Verify all API endpoints match specification
2. ✅ Test status pipelines (Draft → Ready → Completed)
3. ✅ Validate stock update logic for all operations
4. ✅ Confirm ledger entries created correctly
5. ✅ Test pre-validations for deliveries
6. ✅ Implement forms for all operations
7. ✅ Create comprehensive UI for each module
8. ✅ Add filtering and search to all lists
9. ✅ Generate reports and analytics
10. ✅ Performance optimization

---

**System Designed**: March 14, 2026
**Version**: 1.0
**Status**: Complete Specification
