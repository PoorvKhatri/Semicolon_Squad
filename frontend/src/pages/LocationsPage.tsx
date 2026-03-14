import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/Modal";
import { getWarehouses, getLocations, createLocation, updateLocation, deleteLocation } from "../api";

type Location = {
  id: number;
  name: string;
  warehouse_id: number;
  warehouse_name?: string;
};

type LocationForm = {
  name: string;
};

type Warehouse = {
  id: number;
  name: string;
  description?: string;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [formData, setFormData] = useState<LocationForm>({ name: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const warehousesRes = await getWarehouses();
      const warehousesData = Array.isArray(warehousesRes.data) ? warehousesRes.data : [];
      setWarehouses(warehousesData);

      // Load locations for all warehouses
      if (warehousesData.length > 0) {
        let allLocations: Location[] = [];
        for (const warehouse of warehousesData) {
          try {
            const locationsRes = await getLocations(warehouse.id);
            const locationsData = Array.isArray(locationsRes.data) ? locationsRes.data : [];
            const locationsWithWarehouse = locationsData.map((loc: any) => ({
              ...loc,
              warehouse_name: warehouse.name,
            }));
            allLocations = [...allLocations, ...locationsWithWarehouse];
          } catch (error) {
            console.error(`Error loading locations for warehouse ${warehouse.id}:`, error);
          }
        }
        setLocations(allLocations);
        if (warehousesData.length > 0 && !selectedWarehouseId) {
          setSelectedWarehouseId(warehousesData[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingId(location.id);
      setSelectedWarehouseId(location.warehouse_id);
      setFormData({ name: location.name });
    } else {
      setEditingId(null);
      setFormData({ name: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedWarehouseId || !formData.name.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateLocation(editingId, formData);
      } else {
        await createLocation(selectedWarehouseId, formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(id);
        loadData();
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location");
      }
    }
  };

  const getWarehouseName = (warehouseId: number) => {
    return warehouses.find((w) => w.id === warehouseId)?.name || "Unknown";
  };

  const filteredLocations = selectedWarehouseId
    ? locations.filter((loc) => loc.warehouse_id === selectedWarehouseId)
    : locations;

  return (
    <Layout>
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Storage Locations</h1>
            <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
              Manage racks, shelves, and zones within warehouses
            </p>
          </div>
          <Button
            className="gap-2"
            icon={<Plus size={18} />}
            onClick={() => handleOpenModal()}
          >
            New Location
          </Button>
        </div>

        {warehouses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {warehouses.map((warehouse) => (
              <button
                key={warehouse.id}
                onClick={() => setSelectedWarehouseId(warehouse.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedWarehouseId === warehouse.id
                    ? "bg-primary-500 text-white"
                    : "bg-secondary-100 dark:bg-white/10 text-secondary-900 dark:text-white hover:bg-secondary-200 dark:hover:bg-white/20"
                }`}
              >
                {warehouse.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary-600 dark:text-secondary-400">Loading locations...</p>
        </div>
      ) : filteredLocations.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin size={48} className="mx-auto mb-4 text-secondary-300 dark:text-secondary-600" />
          <p className="text-secondary-600 dark:text-secondary-400">
            {warehouses.length === 0
              ? "Create a warehouse first to add locations"
              : "No locations created yet"}
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Card>
            <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">
                {selectedWarehouseId
                  ? `Locations in ${warehouses.find((w) => w.id === selectedWarehouseId)?.name}`
                  : "All Locations"}
              </h3>
              <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">
                Manage storage bins, racks, and zones{filteredLocations.length > 0 && ` (${filteredLocations.length})`}
              </p>
            </div>
            <table className="min-w-full table-auto">
              <thead className="bg-secondary-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
                <tr>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Warehouse</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-secondary-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900 dark:text-white">{location.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-200">
                      {getWarehouseName(location.warehouse_id)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(location)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Location" : "New Location"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-secondary-900 dark:text-white">
              Location Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Rack A, Zone 1, Production Floor"
              className="mt-2 w-full rounded-xl border border-secondary-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-secondary-900 dark:text-white">
              Warehouse *
            </label>
            <select
              value={selectedWarehouseId || ""}
              onChange={(e) => setSelectedWarehouseId(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-secondary-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-secondary-900 dark:text-secondary-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Location</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
