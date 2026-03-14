# CoreInventory - Inventory Management System

A complete full-stack **Inventory Management System (IMS)** built with **React + TypeScript + Tailwind** for the frontend and **FastAPI + SQLAlchemy** for the backend.

**🔗 For complete project documentation, see [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md)**

---

## 📋 Quick Navigation

| Document | Purpose |
|----------|---------|
| [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md) | **Complete project guide** - System overview, architecture, all features, setup, API reference |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Technical architecture details |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What has been implemented |
| [backend/INVENTORY_API_DOCS.md](backend/INVENTORY_API_DOCS.md) | Detailed API endpoint documentation |
| [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) | Testing and verification status |

---

## ⚡ Quick Start

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
python app/init_db.py           # Initialize database
uvicorn app.main:app --reload   # Start server on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                      # Start on http://localhost:5173
```

---

## 🎯 What's Included

### ✅ Core Features
- **User Management** - JWT authentication, registration, password reset
- **Product Management** - Full CRUD with SKU, categories, reorder points
- **Warehouse Management** - Multi-warehouse, multi-location stock tracking
- **Stock Operations**
  - Receipts (incoming goods)
  - Deliveries (outgoing goods)
  - Transfers (internal movements)
  - Adjustments (inventory corrections)
- **Dashboard Analytics**
  - Real-time KPIs (total stock, low stock items, pending operations)
  - 7-day inventory trend charts
  - Stock distribution by category & warehouse
- **Audit Trail** - Complete stock movement history with timestamps
- **Multi-Location Support** - Track stock across multiple warehouses

### ✅ Technology Stack
| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI, SQLAlchemy, Pydantic v2 |
| Database | PostgreSQL / SQLite (default) |
| Auth | JWT Bearer tokens |
| DevOps | Docker, CORS |

---

## 📁 Project Structure

```
Semicolon_Squad/
├── README.md                          (this file - quick reference)
├── README_COMPREHENSIVE.md            (FULL DOCUMENTATION - START HERE)
├── SYSTEM_ARCHITECTURE.md             (technical specs)
├── IMPLEMENTATION_SUMMARY.md          (features implemented)
├── VERIFICATION_CHECKLIST.md          (testing status)
│
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                   (FastAPI entry point)
│   │   ├── init_db.py                (database initialization)
│   │   ├── api/
│   │   │   ├── auth.py               (authentication)
│   │   │   ├── products.py           (product CRUD)
│   │   │   ├── warehouses.py         (warehouse management)
│   │   │   ├── stock_moves.py        (stock operations)
│   │   │   ├── stats.py              (KPIs & analytics)
│   │   │   └── inventory_service.py  (business logic)
│   │   └── models/                   (database models)
│   └── .venv/                        (virtual environment)
│
└── frontend/
    ├── package.json
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts                    (API client)
    │   ├── pages/
    │   │   ├── DashboardPage.tsx
    │   │   ├── ProductsPage.tsx
    │   │   ├── ReceiptsPage.tsx
    │   │   ├── DeliveryPage.tsx
    │   │   ├── TransfersPage.tsx
    │   │   └── AdjustmentsPage.tsx
    │   └── components/               (UI components)
    └── node_modules/
```

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/token             # Login (returns JWT)
GET    /api/auth/me                # Get current user
```

### Stock Operations
```
POST   /api/stock-moves/receipts/{id}/validate     # Complete receipt
POST   /api/stock-moves/deliveries/{id}/validate   # Complete delivery
POST   /api/stock-moves/transfers/{id}/validate    # Complete transfer
POST   /api/stock-moves/adjustments/{id}/validate  # Complete adjustment
```

### Analytics
```
GET    /api/stats                  # Get KPIs & chart data
GET    /api/stock-moves/ledger     # Get stock movement history
```

**See [backend/INVENTORY_API_DOCS.md](backend/INVENTORY_API_DOCS.md) for full API reference**

---

## 📊 Key Workflows

### Adding Stock (Receipt)
Create Draft → Add Items → Validate & Complete → Stock Increases

### Removing Stock (Delivery)
Create Draft → Add Items → Validate Availability → Complete → Stock Decreases

### Moving Stock Between Locations (Transfer)
Create Draft → Select Source & Destination → Validate Source Stock → Complete → Stock Moves

### Correcting Physical Count (Adjustment)
Physical Count → Create Adjustment → System Calculates Difference → Complete → Stock Corrected

---

## 🐛 Recent Fixes

### ✅ March 14, 2026
1. **Stock Movement Lazy Loading** - Added `joinedload()` eager loading to prevent DetachedInstanceError
2. **Dashboard Loading** - Added error handling to show partial data if API calls fail
3. **Stats Endpoint Robustness** - Added try-catch and safe defaults for empty databases

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Port 8000 in use?
Get-NetTCPConnection -LocalPort 8000 | Stop-Process -Force

# DB not initialized?
python app/init_db.py

# Missing dependencies?
pip install -r requirements.txt
```

### Frontend won't load data
```
1. Check browser console (F12) for API errors
2. Verify backend is running on http://localhost:8000
3. Check if auth token is set: localStorage.getItem('access_token')
4. Log out and log in again
```

### Database errors
```bash
# Reset SQLite database
rm backend/inventory.db
python app/init_db.py

# Check PostgreSQL connection
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

**For more troubleshooting: see [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md#troubleshooting)**

---

## 📚 Full Documentation

**👉 [READ README_COMPREHENSIVE.md FOR COMPLETE PROJECT DOCUMENTATION](README_COMPREHENSIVE.md)**

This includes:
- Complete system overview & architecture
- Detailed project structure
- Full feature list with examples
- Step-by-step installation guide
- Complete API endpoint reference
- Database schema documentation
- All user workflows
- All fixes applied
- Comprehensive troubleshooting guide

---

## 📞 Support

- Check the **[Comprehensive README](README_COMPREHENSIVE.md)** first
- Review API docs at `http://localhost:8000/docs` (when running)
- Check browser console (F12) for detailed errors
- Review backend logs for API errors

---

**Last Updated**: March 14, 2026  
**Project Status**: ✅ Fully Functional
