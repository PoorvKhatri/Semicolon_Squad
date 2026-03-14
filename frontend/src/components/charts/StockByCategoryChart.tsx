import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const defaultData = [
  { name: "Category 1", value: 45 },
  { name: "Category 2", value: 30 },
  { name: "Category 3", value: 25 },
];

const COLORS = ["#38bdf8", "#fbbf24", "#34d399"];

export default function StockByCategoryChart({ data = defaultData }: { data?: any[] }) {
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
      <PieChart>
        <Tooltip
          contentStyle={{
            background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(248, 250, 252, 0.95)",
            border: isDark ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: 12,
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
