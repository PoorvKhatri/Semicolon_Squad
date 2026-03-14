import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Mon", stock: 320 },
  { date: "Tue", stock: 410 },
  { date: "Wed", stock: 380 },
  { date: "Thu", stock: 450 },
  { date: "Fri", stock: 420 },
  { date: "Sat", stock: 480 },
  { date: "Sun", stock: 500 },
];

export default function InventoryMovementChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradientStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.75} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ffffff22" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 12,
            color: "#e2e8f0",
          }}
        />
        <Area type="monotone" dataKey="stock" stroke="#38bdf8" fill="url(#gradientStock)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
