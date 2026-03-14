import { useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import AdjustmentForm from "../components/AdjustmentForm";

const ADJUSTMENTS = [
  { id: "ADJ001", date: "Mar 14, 2026", product: "Steel Rods", location: "Main Warehouse", counted: 448, expected: 450, difference: -2, status: "Completed" },
  { id: "ADJ002", date: "Mar 13, 2026", product: "Aluminum Frames", location: "Production Floor", counted: 120, expected: 120, difference: 0, status: "Completed" },
  { id: "ADJ003", date: "Mar 12, 2026", product: "Plastic Covers", location: "Main Warehouse", counted: 5, expected: 8, difference: -3, status: "Pending" },
  { id: "ADJ004", date: "Mar 11, 2026", product: "Glass Panels", location: "External Storage", counted: 65, expected: 65, difference: 0, status: "Completed" },
];

export default function AdjustmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);

  const handleAddAdjustment = () => {
    setSelectedAdjustment(null);
    setIsModalOpen(true);
  };

  const handleEditAdjustment = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setIsModalOpen(true);
  };

  const handleDeleteAdjustment = (adjustmentId) => {
    console.log("Delete adjustment with id:", adjustmentId);
  };

  const handleFormSubmit = (data) => {
    if (selectedAdjustment) {
      console.log("Update adjustment:", data);
    } else {
      console.log("Create adjustment:", data);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inventory Adjustments</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Fix mismatches between recorded stock and physical counts.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddAdjustment}>New adjustment</Button>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Adjustment History</h3>
          <p className="mt-1 text-xs text-secondary-400">Track all inventory adjustments and their impact on stock levels.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
              <tr>
                <th className="px-6 py-3">Adjustment #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Counted</th>
                <th className="px-6 py-3">Expected</th>
                <th className="px-6 py-3">Difference</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {ADJUSTMENTS.map((adjustment) => (
                <tr key={adjustment.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm font-mono text-info-300">{adjustment.id}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{adjustment.date}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{adjustment.product}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{adjustment.location}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{adjustment.counted}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{adjustment.expected}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{adjustment.difference}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={adjustment.status === "Completed" ? "success" : "warning"}>
                      {adjustment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEditAdjustment(adjustment)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteAdjustment(adjustment.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAdjustment ? "Edit Adjustment" : "New Adjustment"}
      >
        <AdjustmentForm adjustment={selectedAdjustment} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
