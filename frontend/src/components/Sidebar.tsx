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
  BarChart2,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutGrid size={18} /> },
  { label: "Products", to: "/products", icon: <Box size={18} /> },
  { label: "Receipts", to: "/receipts", icon: <ShoppingBag size={18} /> },
  { label: "Delivery Orders", to: "/deliveries", icon: <Truck size={18} /> },
  { label: "Internal Transfers", to: "/transfers", icon: <MoveLeft size={18} /> },
  { label: "Inventory Adjustment", to: "/adjustments", icon: <ClipboardList size={18} /> },
  { label: "Move History", to: "/history", icon: <PackageOpen size={18} /> },
  { label: "Warehouse", to: "/settings", icon: <Warehouse size={18} /> },
  { label: "Reports", to: "/reports", icon: <BarChart2 size={18} /> },
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
      className={`flex h-screen flex-col border-r border-white/10 bg-black/40 backdrop-blur transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-info-500 to-accent-400 shadow-lg">
            <span className="text-lg font-semibold text-white">CI</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-white">CoreInventory</p>
              <p className="text-xs text-slate-300">Inventory dashboard</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
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
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              <span className="text-slate-200 transition group-hover:text-white">
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="mt-auto border-t border-white/10 pt-4">
          <Link
            to="/logout"
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
