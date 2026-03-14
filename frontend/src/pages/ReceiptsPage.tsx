import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import ReceiptForm from "../components/ReceiptForm";
import { getReceipts, createReceipt, deleteReceipt, getProducts, getWarehouses } from "../api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [resReceipts, resProducts, resWarehouses] = await Promise.all([
          getReceipts(),
          getProducts(),
          getWarehouses()
        ]);
        console.log("Products response:", resProducts.data);
        setReceipts(resReceipts.data);
        setProducts(resProducts.data);
        setWarehouses(resWarehouses.data);
        console.log("Products state set to:", resProducts.data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          navigate("/login");
        } else {
          setError(error?.response?.data?.detail || "Failed to load receipts");
          console.error("Failed to fetch data:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddReceipt = () => {
    setSelectedReceipt(null);
    setIsModalOpen(true);
  };

  const handleEditReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDeleteReceipt = async (receiptId) => {
    try {
      await deleteReceipt(receiptId);
      setReceipts(receipts.filter((r) => r.id !== receiptId));
    } catch (error) {
      setError("Failed to delete receipt");
      console.error("Failed to delete receipt:", error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await createReceipt(data);
      const res = await getReceipts();
      setReceipts(res.data);
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error?.response?.data?.detail || "Failed to save receipt");
      console.error("Failed to save receipt:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Receipts</h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">Record incoming stock and update inventory automatically.</p>
        </div>
        <Button variant="primary" onClick={handleAddReceipt} disabled={loading || products.length === 0}>
          {loading ? "Loading..." : "New receipt"}
        </Button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-600 dark:text-danger-400 text-sm">
          {error}
        </div>
      )}

      <Card>
        <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Incoming Receipts</h3>
          <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Track all incoming stock orders and validate receipts.</p>
        </div>
        {loading ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">Loading receipts...</div>
        ) : receipts.length === 0 ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">No receipts yet. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-secondary-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Warehouse</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-secondary-50 dark:hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono text-primary-600 dark:text-primary-400">{receipt.reference}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{dayjs(receipt.created_at).format("MMM D, YYYY")}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{receipt.supplier}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{receipt.product_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{receipt.quantity}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{receipt.warehouse_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={receipt.status === "completed" ? "success" : receipt.status === "pending" ? "warning" : "info"}>
                        {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEditReceipt(receipt)} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDeleteReceipt(receipt.id)} className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedReceipt ? "Edit Receipt" : "New Receipt"}
      >
        <ReceiptForm 
          receipt={selectedReceipt} 
          products={products} 
          warehouses={warehouses} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
