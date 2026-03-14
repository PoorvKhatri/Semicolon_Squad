import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import DeliveryForm from "../components/DeliveryForm";
import { getDeliveries, createDelivery, deleteDelivery, getProducts, getWarehouses, getLocations } from "../api";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Location {
  id: number;
  name: string;
}

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [deliveriesRes, productsRes, locationsRes] = await Promise.all([
          getDeliveries(),
          getProducts(),
          getWarehouses(),
        ]);

        console.log("Products response:", productsRes.data);
        setDeliveries(deliveriesRes.data);
        setProducts(productsRes.data);
        setLocations(locationsRes.data);
        console.log("Products state set to:", productsRes.data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          navigate("/login");
        } else {
          setError(error?.response?.data?.detail || "Failed to load deliveries");
          console.error("Failed to load deliveries:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleAddDelivery = () => {
    setSelectedDelivery(null);
    setIsModalOpen(true);
  };

  const handleEditDelivery = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleDeleteDelivery = async (deliveryId: number) => {
    try {
      await deleteDelivery(deliveryId);
      setDeliveries(deliveries.filter((d) => d.id !== deliveryId));
    } catch (error) {
      setError("Failed to delete delivery");
      console.error("Failed to delete delivery:", error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await createDelivery(data);
      const res = await getDeliveries();
      setDeliveries(res.data);
      setIsModalOpen(false);
    } catch (error) {
      setError("Failed to save delivery");
      console.error("Failed to save delivery:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Delivery Orders</h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
            Manage outgoing shipments, packing, and stock deductions.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddDelivery} disabled={loading || products.length === 0}>
          {loading ? "Loading..." : "Create delivery"}
        </Button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-600 dark:text-danger-400 text-sm">
          {error}
        </div>
      )}

      <Card>
        <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Outgoing Deliveries</h3>
          <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Track all outgoing stock orders and validate deliveries.</p>
        </div>
        {loading ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-6 text-center text-secondary-600 dark:text-secondary-400">No deliveries yet. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-secondary-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">From Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-secondary-50 dark:hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono text-primary-600 dark:text-primary-400">{delivery.reference}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{dayjs(delivery.created_at).format("MMM D, YYYY")}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{delivery.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{delivery.product_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{delivery.quantity}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{delivery.location_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={delivery.status === "delivered" ? "success" : delivery.status === "packing" ? "warning" : "info"}>
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEditDelivery(delivery)} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDeleteDelivery(delivery.id)} className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedDelivery ? "Edit Delivery" : "Create Delivery"}
      >
        <DeliveryForm 
          delivery={selectedDelivery} 
          products={products} 
          locations={locations} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
