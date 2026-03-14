import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/Modal";
import WarehouseForm from "../components/WarehouseForm";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from "../api";

type Warehouse = { id: number; name: string; description?: string | null };

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getWarehouses();
        setWarehouses(res.data);
      } catch (e: any) {
        setError("Failed to load warehouses");
      }
    };
    load();
  }, []);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDeleteWarehouse = async (warehouseId: number) => {
    try {
      await deleteWarehouse(warehouseId);
      setWarehouses(warehouses.filter((w) => w.id !== warehouseId));
    } catch {
      setError("Failed to delete warehouse");
    }
  };

  const handleFormSubmit = async (data: { name: string; description?: string | null }) => {
    try {
      if (selectedWarehouse) {
        const res = await updateWarehouse(selectedWarehouse.id, data);
        setWarehouses(warehouses.map((w) => (w.id === selectedWarehouse.id ? res.data : w)));
      } else {
        const res = await createWarehouse(data);
        setWarehouses([...warehouses, res.data]);
      }
      setIsModalOpen(false);
    } catch {
      setError("Failed to save warehouse");
    }
  };

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-secondary-300">
          Configure warehouses, users, and application preferences.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Warehouses</h3>
              <p className="mt-1 text-xs text-secondary-400">Manage warehouse locations and capacities.</p>
            </div>
            <Button variant="primary" onClick={handleAddWarehouse}>Add warehouse</Button>
          </div>
          <div className="p-6 space-y-4">
            {error && <div className="text-danger-400 text-sm">{error}</div>}
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{warehouse.name}</h4>
                    <p className="text-xs text-secondary-400 mt-1">{warehouse.description ?? "—"}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleEditWarehouse(warehouse)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteWarehouse(warehouse.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="border-b border-white/10 px-6 py-4">
            <h3 className="text-sm font-semibold text-white">Application Settings</h3>
            <p className="mt-1 text-xs text-secondary-400">Configure system parameters and preferences.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Company Name</label>
              <input type="text" placeholder="Your company name" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Currency</label>
              <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-100 mb-2">Timezone</label>
              <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-secondary-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30">
                <option>EST - Eastern Standard Time</option>
                <option>CST - Central Standard Time</option>
                <option>MST - Mountain Standard Time</option>
              </select>
            </div>
            <Button variant="primary">Save settings</Button>
          </div>
        </Card>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"}
      >
        <WarehouseForm warehouse={selectedWarehouse} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
