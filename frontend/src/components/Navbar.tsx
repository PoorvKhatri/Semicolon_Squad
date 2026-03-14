import { useEffect, useMemo, useState } from "react";
import { Bell, Moon, Search, Sun, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Button from "./ui/Button";
import { navItems } from "./Sidebar";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const stored = window.localStorage.getItem("coreinventory-theme");
    const preferDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(preferDark);
    document.documentElement.classList.toggle("dark", preferDark);
  }, []);

  const themeIcon = useMemo(() => (dark ? <Sun size={18} /> : <Moon size={18} />), [dark]);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("coreinventory-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-secondary-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, orders..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-11 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-11 w-11 rounded-xl"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {themeIcon}
            </Button>
            <Button variant="ghost" className="h-11 w-11 rounded-xl" aria-label="Notifications">
              <Bell size={18} />
            </Button>
            <Link to="/profile" aria-label="Account">
              <Button variant="ghost" className="h-11 w-11 rounded-xl">
                <User size={18} />
              </Button>
            </Link>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-3">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-secondary-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
