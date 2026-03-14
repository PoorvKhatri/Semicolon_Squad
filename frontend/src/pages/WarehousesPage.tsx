import { useEffect, useState } from "react";
import { Warehouse as WarehouseIcon, Plus, Trash2, Edit2 } from "lucide-react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/Modal";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from "../api";

type Warehouse = {
  id: number;
  name: string;
  description?: string;
};

type WarehouseForm = {
  name: string;
  description?: string;
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<WarehouseForm>({ name: "", description: "" });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const res = await getWarehouses();
      setWarehouses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingId(warehouse.id);
      setFormData({ name: warehouse.name, description: warehouse.description });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateWarehouse(editingId, formData);
      } else {
        await createWarehouse(formData);
      }
      setShowModal(false);
      loadWarehouses();
    } catch (error) {
      console.error("Error saving warehouse:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await deleteWarehouse(id);
        loadWarehouses();
      } catch (error) {
        console.error("Error deleting warehouse:", error);
      }
    }
  };

  return (
    <Layout>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Warehouses</h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
            Manage physical storage locations for inventory
          </p>
        </div>
        <Button
          className="gap-2"
          icon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          New Warehouse
        </Button>
      </header>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary-600 dark:text-secondary-400">Loading warehouses...</p>
        </div>
      ) : warehouses.length === 0 ? (
        <Card className="text-center py-12">
          <WarehouseIcon size={48} className="mx-auto mb-4 text-secondary-300 dark:text-secondary-600" />
          <p className="text-secondary-600 dark:text-secondary-400">No warehouses created yet</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Card key={warehouse.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <WarehouseIcon size={24} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenModal(warehouse)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-danger-600 dark:text-danger-400 hover:bg-danger-500/10"
                    onClick={() => handleDelete(warehouse.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-secondary-900 dark:text-white">{warehouse.name}</h3>
              {warehouse.description && (
                <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                  {warehouse.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Warehouse" : "New Warehouse"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-secondary-900 dark:text-white">
              Warehouse Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Main Warehouse"
              className="mt-2 w-full rounded-xl border border-secondary-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-secondary-900 dark:text-white">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Main storage facility in Ahmedabad"
              className="mt-2 w-full rounded-xl border border-secondary-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Warehouse</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
