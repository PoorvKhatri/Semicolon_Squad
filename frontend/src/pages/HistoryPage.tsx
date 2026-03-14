import Layout from "../components/Layout";
import Card from "../components/ui/Card";

export default function HistoryPage() {
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Move History</h1>
        <p className="mt-1 text-sm text-secondary-300">Review all stock movement history across warehouses and locations.</p>
      </header>

      <Card>
        <div className="p-6">
          <p className="text-sm text-secondary-300">
            A full ledger of receipts, deliveries, transfers, and adjustments will be displayed here.
          </p>
        </div>
      </Card>
    </Layout>
  );
}
