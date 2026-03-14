import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import TransferForm from "../components/TransferForm";
import { getTransfers, getProducts, getWarehouses, getLocations, createTransfer, deleteTransfer } from "../api";

interface Transfer {
  id: number;
  reference: string;
  product_id: number;
  product_name: string;
  source_location: string;
  dest_location: string;
  quantity: number;
  status: string;
  created_at: string;
  created_by?: string;
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transfersRes, productsRes, warehousesRes] = await Promise.all([
        getTransfers(),
        getProducts(),
        getWarehouses(),
      ]);

      console.log("Products response:", productsRes.data);
      setTransfers(Array.isArray(transfersRes.data) ? transfersRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      console.log("Products state set to:", Array.isArray(productsRes.data) ? productsRes.data : []);

      // Load all locations from all warehouses
      let allLocations: any[] = [];
      if (Array.isArray(warehousesRes.data)) {
        for (const warehouse of warehousesRes.data) {
          try {
            const locsRes = await getLocations(warehouse.id);
            if (Array.isArray(locsRes.data)) {
              allLocations = [...allLocations, ...locsRes.data];
            }
          } catch (err) {
            console.error(`Error loading locations for warehouse ${warehouse.id}:`, err);
          }
        }
      }
      setLocations(allLocations);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load transfers");
        console.error("Failed to fetch transfers:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransfer = () => {
    setSelectedTransfer(null);
    setIsModalOpen(true);
  };

  const handleEditTransfer = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setIsModalOpen(true);
  };

  const handleDeleteTransfer = async (transferId: number) => {
    try {
      await deleteTransfer(transferId);
      setTransfers(transfers.filter((t) => t.id !== transferId));
      setError(null);
    } catch (error) {
      setError("Failed to delete transfer");
      console.error("Failed to delete transfer:", error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await createTransfer(data);
      await loadData();
      setIsModalOpen(false);
      setError(null);
    } catch (error: any) {
      setError(error?.response?.data?.detail || "Failed to save transfer");
      console.error("Failed to save transfer:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Internal Transfers</h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
            Move inventory between warehouses and locations while keeping totals consistent.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddTransfer} disabled={loading || products.length === 0}>
          {loading ? "Loading..." : "New transfer"}
        </Button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-600 dark:text-danger-400 text-sm">
          {error}
        </div>
      )}

      <Card>
        <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Transfer History</h3>
          <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Track all internal stock movements between locations.</p>
        </div>
        {loading ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">Loading transfers...</div>
        ) : transfers.length === 0 ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">No transfers yet. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-secondary-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-secondary-50 dark:hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono text-primary-600 dark:text-primary-400">{transfer.reference}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{transfer.product_name}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{transfer.source_location}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{transfer.dest_location}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{transfer.quantity}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{dayjs(transfer.created_at).format("MMM D, YYYY")}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={transfer.status === "completed" ? "success" : transfer.status === "ready" ? "info" : "warning"}>
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEditTransfer(transfer)} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDeleteTransfer(transfer.id)} className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTransfer ? "Edit Transfer" : "New Transfer"}
      >
        <TransferForm 
          transfer={selectedTransfer} 
          products={products} 
          locations={locations} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
