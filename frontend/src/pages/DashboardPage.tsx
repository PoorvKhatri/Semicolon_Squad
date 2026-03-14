import { useEffect, useState } from "react";
import { Calendar, Layers, Package, Truck, Warehouse } from "lucide-react";

import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import FiltersPanel from "../components/FiltersPanel";
import ActivityTable, { type ActivityRow } from "../components/ActivityTable";
import InventoryMovementChart from "../components/charts/InventoryMovementChart";
import StockByCategoryChart from "../components/charts/StockByCategoryChart";
import WarehouseDistributionChart from "../components/charts/WarehouseDistributionChart";
import { getStats } from "../api";

type Kpi = { title: string; value: number; icon: JSX.Element; trend: { value: string; positive?: boolean } };

const ACTIVITY_ROWS: ActivityRow[] = [
  {
    id: "1",
    date: "Mar 14, 2026",
    product: "Steel Rods",
    operation: "Receipt",
    quantity: "+50",
    warehouse: "Main Warehouse",
    status: "Done",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info-500/20 text-xs font-semibold text-info-100">
        SR
      </div>
    ),
  },
  {
    id: "2",
    date: "Mar 13, 2026",
    product: "Aluminum Frames",
    operation: "Delivery",
    quantity: "-20",
    warehouse: "Production Floor",
    status: "Ready",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-500/20 text-xs font-semibold text-success-100">
        AF
      </div>
    ),
  },
  {
    id: "3",
    date: "Mar 12, 2026",
    product: "Plastic Covers",
    operation: "Adjustment",
    quantity: "-3",
    warehouse: "Main Warehouse",
    status: "Done",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-500/20 text-xs font-semibold text-warning-100">
        PC
      </div>
    ),
  },
  {
    id: "4",
    date: "Mar 10, 2026",
    product: "Glass Panels",
    operation: "Transfer",
    quantity: "+80",
    warehouse: "External Storage",
    status: "Waiting",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-100">
        GP
      </div>
    ),
  },
];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Kpi[]>([
    { title: "Total Products", value: 0, icon: <Layers size={24} />, trend: { value: "0%", positive: true } },
    { title: "Low Stock Items", value: 0, icon: <Package size={24} />, trend: { value: "0%", positive: false } },
    { title: "Total Moves", value: 0, icon: <Truck size={24} />, trend: { value: "0%", positive: true } },
    { title: "Warehouses", value: 0, icon: <Warehouse size={24} />, trend: { value: "0%", positive: true } },
    { title: "Internal Transfers", value: 0, icon: <Calendar size={24} />, trend: { value: "0%", positive: true } },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStats();
        const s = res.data || {};
        setKpis((prev) => [
          { ...prev[0], value: s.total_products ?? 0 },
          { ...prev[1], value: s.low_stock ?? 0 },
          { ...prev[2], value: s.total_moves ?? 0 },
          { ...prev[3], value: s.total_warehouses ?? 0 },
          prev[4],
        ]);
      } catch {
        // keep defaults; optionally show a toast
      }
    };
    load();
  }, []);
  return (
    <Layout>
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-300">
              Snapshot of inventory health, movement and recent activity.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-5">
        {kpis.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={card.value.toLocaleString()}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Inventory movement" subtitle="Units received vs dispatched (7d)">
            <InventoryMovementChart />
          </ChartCard>
        </div>
        <div className="grid gap-4">
          <ChartCard title="Stock by category">
            <StockByCategoryChart />
          </ChartCard>
          <ChartCard title="Warehouse distribution">
            <WarehouseDistributionChart />
          </ChartCard>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityTable rows={ACTIVITY_ROWS} />
        </div>
        <div>
          <FiltersPanel />
        </div>
      </section>
    </Layout>
  );
}
