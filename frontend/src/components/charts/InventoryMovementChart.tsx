import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const defaultData = [
  { date: "Mon", received: 120, dispatched: 80, stock: 40 },
  { date: "Tue", received: 150, dispatched: 100, stock: 50 },
  { date: "Wed", received: 100, dispatched: 90, stock: 10 },
  { date: "Thu", received: 200, dispatched: 120, stock: 80 },
  { date: "Fri", received: 180, dispatched: 150, stock: 30 },
  { date: "Sat", received: 90, dispatched: 60, stock: 30 },
  { date: "Sun", received: 110, dispatched: 70, stock: 40 },
];

export default function InventoryMovementChart({ data = defaultData }: { data?: any[] }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data || defaultData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradientStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.75} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={isDark ? "#ffffff22" : "#00000011"} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={isDark ? "#94a3b8" : "#94a3b8"} tick={{ fontSize: 12 }} />
        <YAxis stroke={isDark ? "#94a3b8" : "#94a3b8"} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(248, 250, 252, 0.95)",
            border: isDark ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: 12,
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        />
        <Area type="monotone" dataKey="stock" stroke="#38bdf8" fill="url(#gradientStock)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
