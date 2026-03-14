import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import AdjustmentForm from "../components/AdjustmentForm";
import { getAdjustments, createAdjustment, deleteAdjustment, getProducts, getWarehouses, getLocations } from "../api";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Location {
  id: number;
  name: string;
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [adjustmentsRes, productsRes, warehousesRes] = await Promise.all([
          getAdjustments(),
          getProducts(),
          getWarehouses(),
        ]);

        console.log("Products response:", productsRes.data);
        setAdjustments(adjustmentsRes.data);
        setProducts(productsRes.data);
        console.log("Products state set to:", productsRes.data);

        // Load locations from all warehouses
        let allLocations: Location[] = [];
        for (const warehouse of warehousesRes.data) {
          const locsRes = await getLocations(warehouse.id);
          allLocations = [...allLocations, ...locsRes.data];
        }
        setLocations(allLocations);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          navigate("/login");
        } else {
          setError(error?.response?.data?.detail || "Failed to load adjustments");
          console.error("Failed to load adjustments:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleAddAdjustment = () => {
    setSelectedAdjustment(null);
    setIsModalOpen(true);
  };

  const handleEditAdjustment = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setIsModalOpen(true);
  };

  const handleDeleteAdjustment = async (adjustmentId) => {
    try {
      await deleteAdjustment(adjustmentId);
      setAdjustments(adjustments.filter((a) => a.id !== adjustmentId));
    } catch (error) {
      setError("Failed to delete adjustment");
      console.error("Failed to delete adjustment:", error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await createAdjustment(data);
      const res = await getAdjustments();
      setAdjustments(res.data);
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error?.response?.data?.detail || "Failed to save adjustment");
      console.error("Failed to save adjustment:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Inventory Adjustments</h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
            Fix mismatches between recorded stock and physical counts.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddAdjustment} disabled={loading || products.length === 0}>
          {loading ? "Loading..." : "New adjustment"}
        </Button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-600 dark:text-danger-400 text-sm">
          {error}
        </div>
      )}

      <Card>
        <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Adjustment History</h3>
          <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Track all inventory adjustments and their impact on stock levels.</p>
        </div>
        {loading ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">Loading adjustments...</div>
        ) : adjustments.length === 0 ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">No adjustments yet. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-secondary-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Counted</th>
                  <th className="px-6 py-3">Expected</th>
                  <th className="px-6 py-3">Difference</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-secondary-50 dark:hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono text-primary-600 dark:text-primary-400">{adjustment.reference}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{dayjs(adjustment.created_at).format("MMM D, YYYY")}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{adjustment.product_name}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{adjustment.location_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{adjustment.counted_qty}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{adjustment.expected_qty}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={adjustment.difference > 0 ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400"}>
                        {adjustment.difference > 0 ? "+" : ""}{adjustment.difference}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{adjustment.reason || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={adjustment.status === "completed" ? "success" : "warning"}>
                        {adjustment.status.charAt(0).toUpperCase() + adjustment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEditAdjustment(adjustment)} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDeleteAdjustment(adjustment.id)} className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedAdjustment ? "Edit Adjustment" : "New Adjustment"}
      >
        <AdjustmentForm 
          adjustment={selectedAdjustment} 
          products={products} 
          locations={locations} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
