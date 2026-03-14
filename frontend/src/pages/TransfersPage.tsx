import { useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import TransferForm from "../components/TransferForm";

const TRANSFERS = [
  { id: "T001", date: "Mar 14, 2026", source: "Main Warehouse", destination: "Production Floor", product: "Steel Rods", quantity: 50, unit: "pcs", status: "Completed" },
  { id: "T002", date: "Mar 13, 2026", source: "External Storage", destination: "Main Warehouse", product: "Aluminum Frames", quantity: 20, unit: "pcs", status: "In Transit" },
  { id: "T003", date: "Mar 12, 2026", source: "Main Warehouse", destination: "External Storage", product: "Plastic Covers", quantity: 100, unit: "pcs", status: "Pending" },
  { id: "T004", date: "Mar 11, 2026", source: "Production Floor", destination: "Main Warehouse", product: "Glass Panels", quantity: 30, unit: "pcs", status: "Completed" },
];

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const handleAddTransfer = () => {
    setSelectedTransfer(null);
    setIsModalOpen(true);
  };

  const handleEditTransfer = (transfer) => {
    setSelectedTransfer(transfer);
    setIsModalOpen(true);
  };

  const handleDeleteTransfer = (transferId) => {
    console.log("Delete transfer with id:", transferId);
  };

  const handleFormSubmit = (data) => {
    if (selectedTransfer) {
      console.log("Update transfer:", data);
    } else {
      console.log("Create transfer:", data);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Internal Transfers</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Move inventory between warehouses and locations while keeping totals consistent.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddTransfer}>New transfer</Button>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Transfer History</h3>
          <p className="mt-1 text-xs text-secondary-400">Track all internal stock movements between locations.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
              <tr>
                <th className="px-6 py-3">Transfer #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {TRANSFERS.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm font-mono text-info-300">{transfer.id}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{transfer.date}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{transfer.source}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{transfer.destination}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{transfer.product}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100"><strong>{transfer.quantity}</strong> {transfer.unit}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={transfer.status === "Completed" ? "success" : transfer.status === "In Transit" ? "info" : "warning"}>
                      {transfer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEditTransfer(transfer)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteTransfer(transfer.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedTransfer ? "Edit Transfer" : "New Transfer"}
      >
        <TransferForm transfer={selectedTransfer} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
