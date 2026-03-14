import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import { getMoveHistory } from "../api";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMoveHistory();
        setHistory(res.data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to fetch history:", error);
        }
      }
    };
    fetchHistory();
  }, []);

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Move History</h1>
        <p className="mt-1 text-sm text-secondary-300">Review all stock movement history across warehouses and locations.</p>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Complete Stock Movement Ledger</h3>
          <p className="mt-1 text-xs text-secondary-400">Full audit trail of all receipts, deliveries, transfers, and adjustments.</p>
        </div>
        {history.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-secondary-300">No stock movements yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Date/Time</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {history.map((move) => (
                  <tr key={move.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm text-secondary-200">{move.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium capitalize" 
                        style={{
                          backgroundColor: move.type === 'receipt' ? 'rgba(74, 222, 128, 0.1)' :
                                        move.type === 'delivery' ? 'rgba(239, 68, 68, 0.1)' :
                                        move.type === 'transfer' ? 'rgba(59, 130, 246, 0.1)' :
                                        'rgba(168, 85, 247, 0.1)',
                          color: move.type === 'receipt' ? '#4ade80' :
                                 move.type === 'delivery' ? '#ef4444' :
                                 move.type === 'transfer' ? '#3b82f6' :
                                 '#a855f7'
                        }}
                      >
                        {move.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-100">{move.product}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-secondary-100">{move.quantity}</td>
                    <td className="px-6 py-4 text-sm font-mono text-secondary-300">{move.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
}
