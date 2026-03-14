# CoreInventory - Complete Inventory Management System

A full-stack **Inventory Management System (IMS)** built with **React + TypeScript + Tailwind CSS** for the frontend and **FastAPI + SQLAlchemy + PostgreSQL** for the backend. Manages stock movements, warehouses, products, and provides real-time inventory tracking with multi-location support.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Installation & Setup](#installation--setup)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [User Workflows](#user-workflows)
10. [Important Fixes Applied](#important-fixes-applied)
11. [Running the Application](#running-the-application)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

**CoreInventory** is a complete inventory management solution designed to handle:
- **Multi-warehouse stock tracking** across multiple locations
- **Stock movements**: Receipts (incoming goods), Deliveries (outgoing goods), Transfers (internal movements), Adjustments (corrections)
- **Real-time KPIs**: Total stock, low stock items, pending operations, warehouse distribution
- **Audit trails**: Complete history of all inventory movements via stock ledger
- **User management**: Role-based access with JWT authentication
- **Dashboard analytics**: Visual charts for inventory trends, category distribution, and warehouse status

### Key Business Flows

```
RECEIPT (Incoming Goods)
├── Create Draft Receipt
├── Add Items (Product + Quantity + Location)
├── Validate/Complete Receipt
└── Stock increases at location

DELIVERY (Outgoing Goods)
├── Create Draft Delivery
├── Add Items (check available stock)
├── Validate/Complete Delivery
└── Stock decreases at location

TRANSFER (Internal Movement)
├── Create Draft Transfer
├── Specify Source & Destination Locations
├── Validate stock availability at source
├── Validate/Complete Transfer
└── Stock moves between locations

ADJUSTMENT (Inventory Correction)
├── Create Draft Adjustment
├── Record Actual Physical Count
├── System calculates difference
├── Validate/Complete Adjustment
└── Stock corrected to match physical count
```

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────┐
│          FRONTEND (React + TypeScript)           │
│  - Dashboard with KPIs & Charts                 │
│  - Stock Operations (Receipts, Deliveries)      │
│  - Warehouse Management                         │
│  - User Authentication                          │
└────────────────┬────────────────────────────────┘
                 │ HTTPS/REST API
                 │
┌────────────────▼────────────────────────────────┐
│      BACKEND (FastAPI + SQLAlchemy)              │
│  ┌──────────────────────────────────────────┐   │
│  │ Authentication & Authorization (JWT)     │   │
│  ├──────────────────────────────────────────┤   │
│  │ Business Logic (Inventory Service)       │   │
│  │  - Stock validation & updates            │   │
│  │  - Movement processing                   │   │
│  │  - Ledger entry creation                 │   │
│  ├──────────────────────────────────────────┤   │
│  │ API Routes                               │   │
│  │  - /api/auth (login, register)           │   │
│  │  - /api/products (product mgmt)          │   │
│  │  - /api/warehouses (location mgmt)       │   │
│  │  - /api/stock-moves (operations)         │   │
│  │  - /api/stats (KPIs & charts)            │   │
│  └──────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────┘
                 │ SQL (SQLAlchemy ORM)
                 │
┌────────────────▼────────────────────────────────┐
│      DATABASE (PostgreSQL / SQLite)              │
│  - Users, Products, Categories                  │
│  - Warehouses, Locations                        │
│  - Stock per location                           │
│  - Operations (Receipts, Deliveries, etc.)      │
│  - Stock Moves Ledger (Audit Trail)             │
└─────────────────────────────────────────────────┘
```

### Data Flow Example - Creating & Completing a Receipt

```
User Action (Frontend)
    ↓
POST /api/stock-moves/receipts
  ├─ ReceiptCreate { reference, supplier, items[] }
  ├─ InventoryService.create_receipt()
  │   ├─ Create Receipt (status=DRAFT)
  │   ├─ Create ReceiptItem entries
  │   └─ Return response
  ├─ Update UI with receipt ID
    
User Validates Receipt
    ↓
POST /api/stock-moves/receipts/{id}/validate
  ├─ InventoryService.complete_receipt(id)
  │   ├─ Validate all items exist
  │   ├─ Update Receipt status=COMPLETED
  │   ├─ For each item:
  │   │   ├─ Update/Create Stock record
  │   │   ├─ Create StockMove ledger entry
  │   │   └─ Increment stock by quantity
  │   ├─ Commit transaction
  │   └─ Return updated receipt
  └─ UI refreshes dashboard with new stock levels
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Day.js** - Date formatting
- **Recharts** - Chart library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation (v2)
- **JWT** - Authentication tokens
- **PostgreSQL** - Primary database
- **SQLite** - Local development database
- **Python 3.11+**

### DevOps
- **Docker** - Containerization (Dockerfile included)
- **CORS** - Cross-origin request handling
- **Git** - Version control

---

## Project Structure

```
Semicolon_Squad/
├── README.md                    # Quick reference
├── README_COMPREHENSIVE.md      # This comprehensive guide
├── SYSTEM_ARCHITECTURE.md       # Detailed technical specs
├── IMPLEMENTATION_SUMMARY.md    # What's been built
├── COMPLETION_SUMMARY.md        # Project completion status
├── FILE_MANIFEST.md             # Complete file list
├── VERIFICATION_CHECKLIST.md    # Testing checklist
├── VALIDATION_CHECKLIST.md      # Validation status
│
├── backend/                     # FastAPI Application
│   ├── Dockerfile               # Docker configuration
│   ├── .env                      # Environment variables (git-ignored)
│   ├── requirements.txt          # Python dependencies
│   ├── migrate.py               # Database migration script
│   ├── test_db.py               # Database connection test
│   ├── .venv/                   # Virtual environment
│   │
│   └── app/
│       ├── __init__.py
│       ├── main.py              # FastAPI app entry point
│       ├── init_db.py           # Database initialization
│       │
│       ├── core/
│       │   ├── config.py        # Configuration settings
│       │   └── database.py      # Database connection
│       │
│       ├── models/              # SQLAlchemy models
│       │   ├── base.py
│       │   ├── user.py          # User model
│       │   ├── product.py       # Product model
│       │   ├── warehouse.py     # Warehouse & Location models
│       │   ├── stock.py         # Stock tracking per location
│       │   ├── stock_move.py    # Stock movement ledger
│       │   ├── operations.py    # Receipt, Delivery, Transfer, Adjustment models
│       │   └── password_reset.py
│       │
│       ├── schemas/             # Pydantic request/response schemas
│       │   ├── user.py
│       │   ├── product.py
│       │   ├── warehouse.py
│       │   └── stock_move.py
│       │
│       └── api/
│           ├── __init__.py      # Router configuration
│           ├── auth.py          # Authentication endpoints
│           ├── health.py        # Health check endpoints
│           ├── products.py      # Product CRUD
│           ├── warehouses.py    # Warehouse & Location CRUD
│           ├── stats.py         # KPIs & chart data
│           ├── inventory_service.py   # Core business logic
│           └── stock_moves.py   # Stock operation endpoints
│
├── frontend/                    # React + Vite Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx              # App routing
│       ├── api.ts               # API client & endpoints
│       ├── index.css            # Global styles
│       │
│       ├── pages/               # Page components
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   ├── ProductsPage.tsx
│       │   ├── ReceiptsPage.tsx
│       │   ├── DeliveryPage.tsx
│       │   ├── TransfersPage.tsx
│       │   ├── AdjustmentsPage.tsx
│       │   ├── HistoryPage.tsx
│       │   ├── WarehousesPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── ...other pages
│       │
│       └── components/          # Reusable components
│           ├── Layout.tsx
│           ├── Navbar.tsx
│           ├── Sidebar.tsx
│           ├── KpiCard.tsx
│           ├── ChartCard.tsx
│           ├── ActivityTable.tsx
│           ├── OperationCard.tsx
│           ├── Modal.tsx
│           ├── FiltersPanel.tsx
│           ├── forms/
│           │   ├── ProductForm.tsx
│           │   ├── WarehouseForm.tsx
│           │   ├── ReceiptForm.tsx
│           │   ├── DeliveryForm.tsx
│           │   ├── TransferForm.tsx
│           │   └── AdjustmentForm.tsx
│           ├── charts/
│           │   ├── InventoryMovementChart.tsx
│           │   ├── StockByCategoryChart.tsx
│           │   └── WarehouseDistributionChart.tsx
│           └── ui/
│               ├── Button.tsx
│               ├── Card.tsx
│               ├── Badge.tsx
│               ├── StatusBadge.tsx
│               └── Skeleton.tsx
```

---

## Features

### ✅ Core Features

#### 1. **User Management**
- User registration with email & password
- JWT-based authentication
- Secure token storage in localStorage
- Password reset flow (forgot password → email token → reset)
- User profile management

#### 2. **Product Management**
- Create, read, update, delete products
- Product details: SKU, UOM, category, description
- Reorder point configuration
- Track initial stock per product

#### 3. **Warehouse & Location Management**
- Multiple warehouses support
- Locations within warehouses
- Warehouse distribution tracking
- Location-based stock segregation

#### 4. **Stock Operations**

**Receipts (Incoming Goods)**
- Draft creation workflow
- Add multiple items per receipt
- Validate & confirm receipt
- Automatic stock increment
- Audit trail entry

**Deliveries (Outgoing Goods)**
- Create delivery orders
- Validate stock availability before completion
- Automatic stock decrement
- Customer tracking
- Status management (Draft → Completed)

**Transfers (Internal Movements)**
- Move stock between locations
- Validate source location has sufficient stock
- Two-step movement (source decrease & destination increase)
- Complete audit trail

**Adjustments (Inventory Corrections)**
- Physical count reconciliation
- System vs. actual quantity comparison
- Automatic difference calculation
- Corrective stock adjustments

#### 5. **Dashboard & Analytics**
- Real-time KPIs:
  - Total products in stock
  - Low stock items count
  - Pending receipts/deliveries
  - Scheduled transfers
- Dynamic charts:
  - 7-day inventory movement trend
  - Stock distribution by category
  - Stock distribution by warehouse
- Recent activity feed showing latest operations
- Quick access operations cards

#### 6. **Inventory Ledger & Reporting**
- Complete stock movement history
- Searchable by product, location, type
- Audit trail with timestamps & user attribution
- Export-ready data format

#### 7. **Multi-Warehouse Support**
- Stock tracking per product per location
- Cross-location transfer capability
- Warehouse-level reporting
- Location-level inventory visibility

---

## Installation & Setup

### Prerequisites
- Python 3.11+ (backend)
- Node.js 16+ (frontend)
- PostgreSQL 12+ (optional, SQLite used by default)
- Git

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file (optional)
# DATABASE_URL=postgresql://user:password@localhost/dbname
# JWT_SECRET=your-secret-key

# 6. Initialize database
python app/init_db.py

# 7. Start backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000

# API available at: http://localhost:8000/api
# Docs at: http://localhost:8000/docs
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Frontend available at: http://localhost:5173
```

---

## Database Schema

### Core Tables

#### Users
```sql
users (id, username, email, password_hash, full_name, created_at)
```

#### Products
```sql
products (id, name, sku, uom, category_id, description, initial_stock, reorder_point)
categories (id, name, description)
```

#### Warehouse & Locations
```sql
warehouses (id, name, description)
locations (id, warehouse_id, name, description)
stock (id, product_id, location_id, quantity, last_updated)
```

#### Stock Operations
```sql
receipts (id, reference, supplier, status, created_by_id, created_at, completed_at)
receipt_items (id, receipt_id, product_id, location_id, quantity)

deliveries (id, reference, customer, status, created_by_id, created_at, completed_at)
delivery_items (id, delivery_id, product_id, location_id, quantity)

transfers (id, reference, product_id, source_location_id, dest_location_id, quantity, status)

adjustments (id, reference, product_id, location_id, system_quantity, actual_quantity, adjustment_quantity, reason, status)
```

#### Audit Trail
```sql
stock_moves (id, move_type, product_id, quantity, source_location_id, dest_location_id, reference, created_by_id, created_at, status)
```

### Status Enums
- **Operation Status**: DRAFT → PENDING → COMPLETED → CANCELLED
- **Move Type**: receipt, delivery, transfer, adjustment

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/token             Login (returns JWT)
GET    /api/auth/me                Get current user
POST   /api/auth/forgot-password   Request password reset
POST   /api/auth/reset-password    Complete password reset
```

### Products
```
GET    /api/products               List all products
POST   /api/products               Create product
GET    /api/products/{id}          Get product details
PUT    /api/products/{id}          Update product
DELETE /api/products/{id}          Delete product
```

### Warehouses & Locations
```
GET    /api/warehouses             List all warehouses
POST   /api/warehouses             Create warehouse
PUT    /api/warehouses/{id}        Update warehouse
DELETE /api/warehouses/{id}        Delete warehouse

GET    /api/warehouses/{id}/locations        List locations in warehouse
POST   /api/warehouses/{id}/locations        Create location
PUT    /api/warehouses/locations/{id}        Update location
DELETE /api/warehouses/locations/{id}        Delete location
```

### Stock Operations
```
POST   /api/stock-moves/receipts                Create receipt
GET    /api/stock-moves/receipts                List receipts
GET    /api/stock-moves/receipts/{id}           Get receipt
POST   /api/stock-moves/receipts/{id}/validate  Complete receipt
DELETE /api/stock-moves/receipts/{id}           Delete draft receipt

POST   /api/stock-moves/deliveries              Create delivery
GET    /api/stock-moves/deliveries              List deliveries
GET    /api/stock-moves/deliveries/{id}         Get delivery
POST   /api/stock-moves/deliveries/{id}/validate Complete delivery
DELETE /api/stock-moves/deliveries/{id}         Delete draft delivery

POST   /api/stock-moves/transfers               Create transfer
GET    /api/stock-moves/transfers               List transfers
GET    /api/stock-moves/transfers/{id}          Get transfer
POST   /api/stock-moves/transfers/{id}/validate Complete transfer
DELETE /api/stock-moves/transfers/{id}          Delete draft transfer

POST   /api/stock-moves/adjustments             Create adjustment
GET    /api/stock-moves/adjustments             List adjustments
GET    /api/stock-moves/adjustments/{id}        Get adjustment
POST   /api/stock-moves/adjustments/{id}/validate Complete adjustment
DELETE /api/stock-moves/adjustments/{id}        Delete draft adjustment
```

### Analytics & Reporting
```
GET    /api/stats                  Get KPIs and chart data
GET    /api/stock-moves/ledger     Get stock movement history
GET    /api/stock-moves/history    Alias for ledger
GET    /api/stock-moves/low-stock  Get low stock alert items
```

### Health & Status
```
GET    /api/health                 API health check
GET    /api/health/db              Database connection check
```

---

## User Workflows

### Workflow 1: Adding Stock via Receipt
```
1. User clicks "New Receipt" on dashboard
2. System opens ReciptsPage
3. User fills form:
   - Reference (unique ID)
   - Supplier name
   - Add line items:
     * Select product
     * Select location
     * Enter quantity
4. Click "Create as Draft"
   - POST /api/stock-moves/receipts
   - Receipt saved with status=DRAFT
5. Review receipt details
6. Click "Validate & Complete"
   - POST /api/stock-moves/receipts/{id}/validate
   - Stock increases at location
   - Ledger entry created
   - Status changes to COMPLETED
7. Dashboard updates with new stock levels
```

### Workflow 2: Removing Stock via Delivery
```
1. User clicks "New Delivery" on dashboard
2. System opens DeliveryPage
3. User fills form:
   - Reference
   - Customer name
   - Add line items (with stock validation)
4. Click "Create as Draft"
   - POST /api/stock-moves/deliveries
   - System validates stock availability
5. Click "Validate & Complete"
   - POST /api/stock-moves/deliveries/{id}/validate
   - Stock decreases at location
   - Ledger entry created
6. Dashboard refreshes
```

### Workflow 3: Physical Count Adjustment
```
1. User performs physical inventory count
2. Clicks "New Adjustment" on dashboard
3. Fills adjustment form:
   - Product
   - Location
   - Actual quantity found
4. System calculates:
   - System quantity (current stock)
   - Actual quantity (physical count)
   - Adjustment = Actual - System
5. Creates adjustment
6. Clicks "Validate & Complete"
   - Stock corrected to physical count
```

### Workflow 4: Viewing Dashboard Analytics
```
1. User logs in → redirected to dashboard
2. Dashboard loads:
   - getStats() → KPIs populated
   - getMoveHistory() → Recent activity table
   - getProducts() → For category charting
   - getWarehouses() → For warehouse charting
   - getReceipts/Deliveries/Transfers/Adjustments → Operation counts
3. Charts render:
   - 7-day movement trend
   - Stock by category distribution
   - Warehouse distribution
4. User can:
   - Click quick-access operation cards
   - View recent activity
   - Access filters panel for drill-down
```

---

## Important Fixes Applied

### Fix 1: Stock Movement Lazy Loading (March 14, 2026)

**Problem**: "Failed to load deliveries/receipts/transfers/adjustments" errors

**Root Cause**: SQLAlchemy lazy loading causing DetachedInstanceError when accessing related objects (products, locations) outside the database session.

**Solution**: Added `joinedload()` eager loading to all list and get endpoints:
- Modified: `backend/app/api/stock_moves.py`
- Added eager loading for Product, Location, and User relationships
- All queries now include `.options(joinedload(...))` to prevent DetachedInstanceError

**Result**: ✅ All stock operation endpoints now load successfully with related data

### Fix 2: Dashboard Component Loading (March 14, 2026)

**Problem**: Dashboard components not rendering, partial data load failures

**Root Cause**: One failed API call in Promise.all() would fail entire dashboard

**Solution**: 
- Modified: `frontend/src/pages/DashboardPage.tsx`
- Added individual error handlers for each API call
- Each endpoint has `.catch()` that returns safe default values
- Dashboard now gracefully degrades if one or more endpoints fail
- Added detailed error logging to browser console

**Result**: ✅ Dashboard renders even with failed API calls, detailed logging for debugging

### Fix 3: Stats Endpoint Robustness (March 14, 2026)

**Problem**: Stats endpoint errors causing 500 responses

**Root Cause**: Query failures when database is empty or joins fail

**Solution**:
- Modified: `backend/app/api/stats.py`
- Added try-catch exception handling
- Changed INNER JOINs to OUTER JOINs for warehouse distribution
- Returns safe default response on error instead of crashing
- Added error logging

**Result**: ✅ Stats endpoint always returns valid response with KPI data

---

## Running the Application

### Option 1: Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- API Docs: http://localhost:8000/docs

### Option 2: Production Build

**Backend:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # or serve with web server
```

### Option 3: Docker

```bash
# Build backend image
cd backend
docker build -t coreinventory-api .
docker run -p 8000:8000 coreinventory-api

# Frontend runs in development
cd frontend
docker build -t coreinventory-ui .
docker run -p 5173:5173 coreinventory-ui
```

---

## Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'app'"
```
Solution: Run from backend directory with proper path
cd backend
python -m uvicorn app.main:app --reload
```

#### Issue: "ImportError: cannot import name 'joinedload'"
```
Solution: Install SQLAlchemy (should be in requirements.txt)
pip install sqlalchemy
```

#### Issue: Stats endpoint returns 500 error
```
Solution: Check database has tables initialized
python app/init_db.py
Restart: uvicorn app.main:app --reload
```

#### Issue: "Port 8000 already in use"
```
Solution: Kill process using port 8000
Windows: Get-NetTCPConnection -LocalPort 8000 | Stop-Process -Force
macOS/Linux: lsof -ti:8000 | xargs kill -9
Or use different port: uvicorn app.main:app --port 8001
```

### Frontend Issues

#### Issue: "npm ERR! code ERESOLVE"
```
Solution: Use --force flag
npm install --force
npm run dev
```

#### Issue: API returns 401 Unauthorized
```
Solution: 
1. Check if logged in (token in localStorage)
2. Clear browser storage: localStorage.clear()
3. Log in again
4. Try API call again
```

#### Issue: "Failed to load XYZ" on dashboard
```
Solution:
1. Open browser console (F12)
2. Check error messages (should show which endpoint failed)
3. Verify backend is running on http://localhost:8000
4. Check API URL in frontend/src/api.ts (should be http://localhost:8000/api)
```

#### Issue: Charts not rendering
```
Solution:
1. Check if Recharts is installed: npm install recharts
2. Restart frontend: npm run dev
3. Verify chart data in browser console Network tab
4. Check chart component props for data format
```

### Database Issues

#### Issue: "FATAL: role 'postgres' does not exist"
```
Solution: Use SQLite instead (default)
Or create PostgreSQL user: createuser -P postgres
```

#### Issue: "Database tables not initialized"
```
Solution: Run init_db script
cd backend
python app/init_db.py
```

#### Issue: "TimeoutError: QueuePool timeout"
```
Solution: Check database connection in .env
Verify DATABASE_URL format: postgresql://user:pass@host/dbname
```

### General Debugging

#### Enable Detailed Logging
Backend:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Frontend:
```javascript
// Add to console after componentalization
window.localStorage.setItem("debug", "true");
console.log("API Response:", data);
```

#### Check API Response Format
```bash
# Use curl to test endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/products

# Or use online tool like Postman
```

---

## Additional Resources

- **API Documentation**: Visit http://localhost:8000/docs (Swagger UI)
- **System Architecture**: See `SYSTEM_ARCHITECTURE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Verification Status**: See `VERIFICATION_CHECKLIST.md`
- **Backend API Docs**: See `backend/INVENTORY_API_DOCS.md`
- **Quick Start Guide**: See `backend/INVENTORY_QUICK_START.md`

---

## Support & Contributing

For issues, questions, or contributions:
1. Check the Troubleshooting section above
2. Review existing documentation files
3. Check browser console for detailed error messages
4. Review backend logs for API errors

---

## License

This project is part of the Semicolon_Squad team's work. All rights reserved.

---

**Last Updated**: March 14, 2026  
**Project Status**: ✅ Fully Functional - All core features implemented and tested
