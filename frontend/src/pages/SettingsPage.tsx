import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/Modal";
import WarehouseForm from "../components/WarehouseForm";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from "../api";

type Warehouse = { id: number; name: string; description?: string | null };

interface AppSettings {
  companyName: string;
  currency: string;
  timezone: string;
}

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // App settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("appSettings");
    return saved ? JSON.parse(saved) : {
      companyName: "",
      currency: "USD",
      timezone: "EST",
    };
  });

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

  const handleSettingChange = (key: keyof AppSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSuccess(null);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // Save to localStorage (you can also send to backend if needed)
      localStorage.setItem("appSettings", JSON.stringify(settings));
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar ($)" },
    { value: "EUR", label: "EUR - Euro (€)" },
    { value: "GBP", label: "GBP - British Pound (£)" },
    { value: "INR", label: "INR - Indian Rupee (₹)" },
  ];

  const timezoneOptions = [
    { value: "EST", label: "EST - Eastern Standard Time (UTC-5)" },
    { value: "CST", label: "CST - Central Standard Time (UTC-6)" },
    { value: "MST", label: "MST - Mountain Standard Time (UTC-7)" },
    { value: "IST", label: "IST - Indian Standard Time (UTC+5:30)" },
  ];

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
          Configure warehouses, users, and application preferences.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Warehouses</h3>
              <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Manage warehouse locations and capacities.</p>
            </div>
            <Button variant="primary" onClick={handleAddWarehouse}>Add warehouse</Button>
          </div>
          <div className="p-6 space-y-4">
            {error && <div className="text-danger-600 dark:text-danger-400 text-sm">{error}</div>}
            {warehouses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary-600 dark:text-secondary-400 text-sm">No warehouses yet. Create one to get started.</p>
              </div>
            ) : (
              warehouses.map((warehouse) => (
                <div key={warehouse.id} className="border border-secondary-200 dark:border-white/10 rounded-lg p-4 bg-secondary-50 dark:bg-white/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-secondary-900 dark:text-white">{warehouse.name}</h4>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">{warehouse.description ?? "—"}</p>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => handleEditWarehouse(warehouse)} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDeleteWarehouse(warehouse.id)} className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Application Settings</h3>
            <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">Configure system parameters and preferences.</p>
          </div>
          <div className="p-6 space-y-6">
            {error && <div className="text-danger-600 dark:text-danger-400 text-sm p-3 bg-danger-500/10 rounded-lg">{error}</div>}
            {success && <div className="text-success-600 dark:text-success-400 text-sm p-3 bg-success-500/10 rounded-lg">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-100 mb-2">Company Name</label>
              <input
                type="text"
                placeholder="Your company name"
                value={settings.companyName}
                onChange={(e) => handleSettingChange("companyName", e.target.value)}
                className="w-full rounded-lg border border-secondary-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-100 mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange("currency", e.target.value)}
                className="w-full rounded-lg border border-secondary-300 dark:border-primary-500 bg-white dark:bg-primary-950 px-3 py-2 text-sm text-secondary-900 dark:text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-100 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange("timezone", e.target.value)}
                className="w-full rounded-lg border border-secondary-300 dark:border-primary-500 bg-white dark:bg-primary-950 px-3 py-2 text-sm text-secondary-900 dark:text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              >
                {timezoneOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save settings"}
            </Button>
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
