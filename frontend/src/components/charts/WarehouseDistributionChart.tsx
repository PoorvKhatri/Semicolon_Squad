import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const defaultData = [
  { warehouse: "Main", stock: 650 },
  { warehouse: "Production", stock: 420 },
  { warehouse: "External", stock: 250 },
];

export default function WarehouseDistributionChart({ data = defaultData }: { data?: any[] }) {
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

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={isDark ? "#ffffff22" : "#00000011"} strokeDasharray="3 3" />
        <XAxis dataKey="warehouse" stroke={isDark ? "#94a3b8" : "#94a3b8"} tick={{ fontSize: 12 }} />
        <YAxis stroke={isDark ? "#94a3b8" : "#94a3b8"} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(248, 250, 252, 0.95)",
            border: isDark ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: 12,
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        />
        <Bar dataKey="stock" fill="#38bdf8" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
