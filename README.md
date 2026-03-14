# CoreInventory (Semicolon_Squad)

A starter full-stack Inventory Management System (IMS) scaffold using **React + Tailwind** for the frontend and **FastAPI + SQLAlchemy** for the backend.

---

## 📚 **START HERE: Complete Documentation**

| Document | Description |
|----------|-------------|
| **[📖 README_COMPREHENSIVE.md](README_COMPREHENSIVE.md)** | **FULL PROJECT GUIDE** - System overview, architecture, all features, workflows, API reference, troubleshooting |
| **[⚡ README_QUICK_REFERENCE.md](README_QUICK_REFERENCE.md)** | **QUICK START** - Fast setup instructions, key workflows, common issues |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Technical architecture details |

👉 **New to the project? Start with [README_COMPREHENSIVE.md](README_COMPREHENSIVE.md)**  
⚡ **Just want to run it? See [README_QUICK_REFERENCE.md](README_QUICK_REFERENCE.md)**

---

## 📁 Workspace Structure

- `frontend/` - React + Vite UI application (dashboard, products, receipts, deliveries, transfers, adjustments)
- `backend/` - FastAPI backend (authentication, product APIs, data models)

## 🚀 Getting Started

### 1) Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file (optional, defaults are provided):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coreinventory
JWT_SECRET=super-secret-change-me
```

Run database migrations / create tables:

```bash
python -m app.init_db
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The API should be available at `http://localhost:8000/api`.

### 2) Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` by default.

## 🧭 What’s Included

### ✅ Backend
- FastAPI server with CORS support
- JWT auth scaffolding (login/register + bearer token)
- SQLAlchemy models for users, products, warehouses, locations, and stock movements
- Basic `products` CRUD endpoints

### ✅ Frontend
- React + Vite starter app
- TailwindCSS styling
- React Router navigation between core pages
- Placeholder screens for key IMS workflows:
  - Dashboard
  - Products
  - Receipts
  - Delivery Orders
  - Internal Transfers
  - Inventory Adjustments
  - Settings

## 🧩 Next Steps / Expansion Ideas

- Implement full product list UI + CRUD + inventory counts
- Build receipts/delivery/transfer workflows + stock ledger
- Connect frontend to backend using Axios + authentication
- Add OTP-based password reset (email/SMS)
- Add low-stock alerts + notifications
- Add multi-warehouse / location reporting + filters

---

> This workspace is scaffolded to help you build a modular, real-time Inventory Management System.
