import { useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import ReceiptForm from "../components/ReceiptForm";

const RECEIPTS = [
  { id: "RCP001", date: "Mar 14, 2026", supplier: "Steel Industries Inc", product: "Steel Rods", quantity: 200, unit: "pcs", status: "Completed", reference: "PO-2024-001" },
  { id: "RCP002", date: "Mar 13, 2026", supplier: "Global Components Ltd", product: "Aluminum Frames", quantity: 50, unit: "pcs", status: "Pending", reference: "PO-2024-002" },
  { id: "RCP003", date: "Mar 12, 2026", supplier: "Plastic Solutions Co", product: "Plastic Covers", quantity: 500, unit: "pcs", status: "Completed", reference: "PO-2024-003" },
  { id: "RCP004", date: "Mar 11, 2026", supplier: "Glass Manufacturers", product: "Glass Panels", quantity: 75, unit: "pcs", status: "In Transit", reference: "PO-2024-004" },
];

export default function ReceiptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleAddReceipt = () => {
    setSelectedReceipt(null);
    setIsModalOpen(true);
  };

  const handleEditReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDeleteReceipt = (receiptId) => {
    console.log("Delete receipt with id:", receiptId);
  };

  const handleFormSubmit = (data) => {
    if (selectedReceipt) {
      console.log("Update receipt:", data);
    } else {
      console.log("Create receipt:", data);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Receipts</h1>
          <p className="mt-1 text-sm text-secondary-300">Record incoming stock and update inventory automatically.</p>
        </div>
        <Button variant="primary" onClick={handleAddReceipt}>New receipt</Button>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Incoming Receipts</h3>
          <p className="mt-1 text-xs text-secondary-400">Track all incoming stock orders and validate receipts.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
              <tr>
                <th className="px-6 py-3">Receipt #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Supplier</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">PO Reference</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {RECEIPTS.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm font-mono text-info-300">{receipt.id}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{receipt.date}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{receipt.supplier}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{receipt.product}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100"><strong>{receipt.quantity}</strong> {receipt.unit}</td>
                  <td className="px-6 py-4 text-sm font-mono text-secondary-300">{receipt.reference}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={receipt.status === "Completed" ? "success" : receipt.status === "Pending" ? "warning" : "info"}>
                      {receipt.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEditReceipt(receipt)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteReceipt(receipt.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedReceipt ? "Edit Receipt" : "New Receipt"}
      >
        <ReceiptForm receipt={selectedReceipt} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
