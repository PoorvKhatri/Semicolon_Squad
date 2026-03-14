import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FileText, TrendingUp, AlertCircle, Package } from "lucide-react";

const REPORT_TYPES = [
  { 
    id: 1,
    title: "Stock Valuation Report",
    description: "Total inventory value by category and warehouse",
    icon: <Package className="w-6 h-6" />,
    color: "from-primary-500 to-info-500"
  },
  { 
    id: 2,
    title: "Inventory Turnover",
    description: "Movement rates and slow-moving items analysis",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-success-500 to-accent-500"
  },
  { 
    id: 3,
    title: "Low Stock Alert",
    description: "Items below reorder point with recommendations",
    icon: <AlertCircle className="w-6 h-6" />,
    color: "from-warning-500 to-danger-500"
  },
  { 
    id: 4,
    title: "Movement History",
    description: "Comprehensive audit trail of all transactions",
    icon: <FileText className="w-6 h-6" />,
    color: "from-info-500 to-primary-500"
  },
];

export default function ReportsPage() {
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-secondary-300">Generate insights and export inventory reports.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {REPORT_TYPES.map((report) => (
          <Card key={report.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${report.color} text-white shadow-lg`}>
                  {report.icon}
                </div>
                <Button variant="secondary">Generate</Button>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
              <p className="text-sm text-secondary-400 mb-4">{report.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs rounded-lg border border-white/10 text-secondary-300 hover:text-white py-2 transition">CSV</button>
                <button className="flex-1 text-xs rounded-lg border border-white/10 text-secondary-300 hover:text-white py-2 transition">PDF</button>
                <button className="flex-1 text-xs rounded-lg border border-white/10 text-secondary-300 hover:text-white py-2 transition">Excel</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Report Schedule</h3>
          <p className="mt-1 text-xs text-secondary-400">Configure automatic report generation and email delivery.</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Report Type</label>
              <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30">
                <option>Stock Valuation</option>
                <option>Inventory Turnover</option>
                <option>Low Stock Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Frequency</label>
              <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Email To</label>
              <input type="email" placeholder="your@email.com" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30" />
            </div>
          </div>
          <Button variant="primary" className="mt-4">Schedule Report</Button>
        </div>
      </Card>
    </Layout>
  );
}
