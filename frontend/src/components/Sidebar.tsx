import { Link, useLocation } from "react-router-dom";
import {
  Box,
  ChevronLeft,
  ClipboardList,
  LayoutGrid,
  LogOut,
  MoveLeft,
  PackageOpen,
  ShoppingBag,
  Truck,
  Warehouse,
  MapPin,
  User,
  Settings,
} from "lucide-react";

// Main Navigation Items - Organized by System Flow
export const navItems = [
  // Core Dashboard
  { label: "Dashboard", to: "/dashboard", icon: <LayoutGrid size={18} /> },
  
  // Inventory Operations Section
  { label: "Receipts", to: "/receipts", icon: <ShoppingBag size={18} /> },
  { label: "Deliveries", to: "/deliveries", icon: <Truck size={18} /> },
  { label: "Transfers", to: "/transfers", icon: <MoveLeft size={18} /> },
  { label: "Adjustments", to: "/adjustments", icon: <ClipboardList size={18} /> },
  
  // Master Data
  { label: "Products & Stock", to: "/products", icon: <Box size={18} /> },
  
  // Warehouse Management
  { label: "Warehouses", to: "/warehouses", icon: <Warehouse size={18} /> },
  { label: "Locations", to: "/locations", icon: <MapPin size={18} /> },
  
  // Tracking & Analysis
  { label: "Move History", to: "/history", icon: <PackageOpen size={18} /> },
  
  // Settings
  { label: "Settings", to: "/settings", icon: <Settings size={18} /> },
];

export default function Sidebar({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: () => void;
}) {
  const location = useLocation();

  return (
    <aside
      className={`flex h-screen flex-col border-r border-secondary-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {collapsed ? (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary-100 dark:bg-white/5">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover object-left" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="CoreInventory Logo" className="h-10 w-auto object-contain" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-secondary-200 dark:border-white/10 bg-secondary-100 dark:bg-white/5 text-secondary-900 dark:text-white transition hover:bg-secondary-200 dark:hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={18} className={`${collapsed ? "rotate-180" : ""} transition`} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-secondary-100 dark:hover:bg-white/10 ${
                active
                  ? "bg-secondary-100 dark:bg-white/10 text-secondary-900 dark:text-white"
                  : "text-secondary-600 dark:text-slate-200 hover:text-secondary-900 dark:hover:text-white"
              }`}
            >
              <span className="text-secondary-600 dark:text-slate-200 transition group-hover:text-secondary-900 dark:group-hover:text-white">
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="mt-auto border-t border-secondary-200 dark:border-white/10 pt-4 flex flex-col gap-1">
          <Link
            to="/profile"
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-secondary-600 dark:text-slate-200 transition hover:bg-secondary-100 dark:hover:bg-white/10 hover:text-secondary-900 dark:hover:text-white"
          >
            <User size={18} />
            {!collapsed && <span>My Profile</span>}
          </Link>
          <Link
            to="/logout"
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-secondary-600 dark:text-slate-200 transition hover:bg-secondary-100 dark:hover:bg-white/10 hover:text-secondary-900 dark:hover:text-white"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
