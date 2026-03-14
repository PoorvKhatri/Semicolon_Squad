import { useEffect, useState } from "react";
import { Calendar, Layers, Package, Truck, Warehouse, ShoppingBag, ClipboardList, MoveLeft } from "lucide-react";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import FiltersPanel from "../components/FiltersPanel";
import ActivityTable, { type ActivityRow } from "../components/ActivityTable";
import OperationCard from "../components/OperationCard";
import InventoryMovementChart from "../components/charts/InventoryMovementChart";
import StockByCategoryChart from "../components/charts/StockByCategoryChart";
import WarehouseDistributionChart from "../components/charts/WarehouseDistributionChart";
import { getStats, getMoveHistory, getProducts, getWarehouses, getReceipts, getDeliveries, getTransfers, getAdjustments } from "../api";

type Kpi = { title: string; value: number; icon: JSX.Element; trend: { value: string; positive?: boolean } };
type FilterState = {
  category: string;
  warehouse: string;
  status: string;
  operation: string;
};

type OperationStats = {
  receipts: number;
  deliveries: number;
  transfers: number;
  adjustments: number;
};

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Kpi[]>([
    { title: "Total Products in Stock", value: 0, icon: <Layers size={24} />, trend: { value: "0%", positive: true } },
    { title: "Low Stock Items", value: 0, icon: <Package size={24} />, trend: { value: "0%", positive: false } },
    { title: "Pending Receipts", value: 0, icon: <Truck size={24} />, trend: { value: "0%", positive: true } },
    { title: "Pending Deliveries", value: 0, icon: <Warehouse size={24} />, trend: { value: "0%", positive: true } },
    { title: "Internal Transfers Scheduled", value: 0, icon: <Calendar size={24} />, trend: { value: "0%", positive: true } },
  ]);

  const [operations, setOperations] = useState<OperationStats>({
    receipts: 0,
    deliveries: 0,
    transfers: 0,
    adjustments: 0,
  });

  const [recentActivities, setRecentActivities] = useState<ActivityRow[]>([]);
  const [chartData, setChartData] = useState<any>({
    movementData: [],
    categoryData: [],
    warehouseData: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    warehouse: "All",
    status: "All",
    operation: "All",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsRes, historyRes, productsRes, warehousesRes, receiptsRes, deliveriesRes, transfersRes, adjustmentsRes] = await Promise.all([
          getStats().catch(err => {
            console.error("Stats API Error:", err.response?.status, err.response?.data);
            return { data: {} };
          }),
          getMoveHistory().catch(err => {
            console.error("History API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getProducts().catch(err => {
            console.error("Products API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getWarehouses().catch(err => {
            console.error("Warehouses API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getReceipts().catch(err => {
            console.error("Receipts API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getDeliveries().catch(err => {
            console.error("Deliveries API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getTransfers().catch(err => {
            console.error("Transfers API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          getAdjustments().catch(err => {
            console.error("Adjustments API Error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
        ]);

        // Update KPIs from stats
        const s = statsRes.data || {};
        console.log("Stats data received:", s);
        setKpis((prev) => [
          { ...prev[0], value: parseFloat(s.total_in_stock) || 0 },
          { ...prev[1], value: s.low_stock || 0 },
          { ...prev[2], value: s.pending_receipts || 0 },
          { ...prev[3], value: s.pending_deliveries || 0 },
          { ...prev[4], value: s.scheduled_transfers || 0 },
        ]);

        // Update operation counts
        setOperations({
          receipts: Array.isArray(receiptsRes.data) ? receiptsRes.data.length : 0,
          deliveries: Array.isArray(deliveriesRes.data) ? deliveriesRes.data.length : 0,
          transfers: Array.isArray(transfersRes.data) ? transfersRes.data.length : 0,
          adjustments: Array.isArray(adjustmentsRes.data) ? adjustmentsRes.data.length : 0,
        });

        // Process history data
        const historyData = historyRes.data || [];
        const activities = historyData.slice(0, 10).map((m: any) => ({
          id: String(m.id),
          date: dayjs(m.created_at || m.date).format("MMM D, YYYY"),
          product: m.product || "Unknown",
          operation: m.move_type ? m.move_type.charAt(0).toUpperCase() + m.move_type.slice(1) : "Unknown",
          quantity: m.quantity ? (m.quantity > 0 ? `+${m.quantity}` : `${m.quantity}`) : "0",
          warehouse: m.source_location || m.location || "System",
          status: "Completed",
          avatar: (
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              m.move_type === 'receipt' ? 'bg-info-500/20 text-info-100 dark:text-info-100' :
              m.move_type === 'delivery' ? 'bg-success-500/20 text-success-100 dark:text-success-100' :
              m.move_type === 'adjustment' ? 'bg-warning-500/20 text-warning-100 dark:text-warning-100' :
              'bg-primary-500/20 text-primary-100 dark:text-primary-100'
            }`}>
              {(m.product || "U").substring(0, 2).toUpperCase()}
            </div>
          ),
        }));
        setRecentActivities(activities);

        // Generate chart data from history
        const last7Days = generateLast7Days(historyData);
        const categoryDistribution = generateCategoryData(productsRes.data || []);
        const warehouseDistribution = generateWarehouseData(warehousesRes.data || [], historyData);

        setChartData({
          movementData: last7Days,
          categoryData: categoryDistribution,
          warehouseData: warehouseDistribution,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
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

      {/* Quick Access Operations Section */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Quick Access - Core Operations</h2>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">Manage incoming, outgoing, and internal inventory movements</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OperationCard
            title="Receipts"
            count={operations.receipts}
            icon={<ShoppingBag size={24} />}
            color="blue"
            actionLink="/receipts"
            actionLabel="New Receipt"
            status="Draft"
          />
          <OperationCard
            title="Deliveries"
            count={operations.deliveries}
            icon={<Truck size={24} />}
            color="green"
            actionLink="/deliveries"
            actionLabel="New Delivery"
            status="Ready"
          />
          <OperationCard
            title="Transfers"
            count={operations.transfers}
            icon={<MoveLeft size={24} />}
            color="orange"
            actionLink="/transfers"
            actionLabel="New Transfer"
            status="Pending"
          />
          <OperationCard
            title="Adjustments"
            count={operations.adjustments}
            icon={<ClipboardList size={24} />}
            color="purple"
            actionLink="/adjustments"
            actionLabel="New Adjustment"
            status="Pending"
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Inventory movement" subtitle="Units received vs dispatched (7d)">
            <InventoryMovementChart data={chartData.movementData} />
          </ChartCard>
        </div>
        <div className="grid gap-4">
          <ChartCard title="Stock by category">
            <StockByCategoryChart data={chartData.categoryData} />
          </ChartCard>
          <ChartCard title="Warehouse distribution">
            <WarehouseDistributionChart data={chartData.warehouseData} />
          </ChartCard>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityTable rows={recentActivities} />
        </div>
        <div>
          <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </section>
    </Layout>
  );
}

// Helper functions to generate dynamic data
function generateLast7Days(historyData: any[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = dayjs();

  return days.map((day, index) => {
    const targetDate = today.subtract(6 - index, "day");
    const dayData = historyData.filter((m) =>
      dayjs(m.created_at || m.date).isSame(targetDate, "day")
    );

    const received = dayData.filter((m) => m.move_type === "receipt").reduce((sum, m) => sum + (m.quantity || 0), 0);
    const dispatched = dayData.filter((m) => m.move_type === "delivery").reduce((sum, m) => sum + Math.abs(m.quantity || 0), 0);

    return {
      date: day,
      received,
      dispatched,
      stock: received - dispatched,
    };
  });
}

function generateCategoryData(products: any[]) {
  const categories: { [key: string]: number } = {};

  products.forEach((p) => {
    const cat = p.category_id ? `Category ${p.category_id}` : "Uncategorized";
    categories[cat] = (categories[cat] || 0) + (p.initial_stock || 0);
  });

  return Object.entries(categories).map(([name, value]) => ({ name, value }));
}

function generateWarehouseData(warehouses: any[], historyData: any[]) {
  const warehouseStock: { [key: string]: number } = {};

  warehouses.forEach((w) => {
    warehouseStock[w.name] = 0;
  });

  historyData.forEach((m) => {
    const location = m.source_location || m.location || "Unknown";
    if (warehouseStock[location] !== undefined) {
      if (m.move_type === "receipt") {
        warehouseStock[location] += m.quantity || 0;
      } else if (m.move_type === "delivery") {
        warehouseStock[location] -= Math.abs(m.quantity || 0);
      }
    }
  });

  return Object.entries(warehouseStock).map(([warehouse, stock]) => ({
    warehouse,
    stock: Math.max(0, stock),
  }));
}
