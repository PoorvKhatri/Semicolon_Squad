import { useState } from "react";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/Modal";
import DeliveryForm from "../components/DeliveryForm";

const DELIVERIES = [
  { id: "D001", date: "Mar 14, 2026", customer: "Customer A", product: "Steel Rods", quantity: 20, unit: "pcs", status: "Delivered", reference: "SO-2024-001" },
  { id: "D002", date: "Mar 13, 2026", customer: "Customer B", product: "Aluminum Frames", quantity: 10, unit: "pcs", status: "Packing", reference: "SO-2024-002" },
  { id: "D003", date: "Mar 12, 2026", customer: "Customer C", product: "Plastic Covers", quantity: 100, unit: "pcs", status: "Picking", reference: "SO-2024-003" },
  { id: "D004", date: "Mar 11, 2026", customer: "Customer D", product: "Glass Panels", quantity: 15, unit: "pcs", status: "Ready", reference: "SO-2024-004" },
];

export default function DeliveryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleAddDelivery = () => {
    setSelectedDelivery(null);
    setIsModalOpen(true);
  };

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleDeleteDelivery = (deliveryId) => {
    console.log("Delete delivery with id:", deliveryId);
  };

  const handleFormSubmit = (data) => {
    if (selectedDelivery) {
      console.log("Update delivery:", data);
    } else {
      console.log("Create delivery:", data);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Delivery Orders</h1>
          <p className="mt-1 text-sm text-secondary-300">
            Manage outgoing shipments, packing, and stock deductions.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddDelivery}>Create delivery</Button>
      </header>

      <Card>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Outgoing Deliveries</h3>
          <p className="mt-1 text-xs text-secondary-400">Track all outgoing stock orders and validate deliveries.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-400">
              <tr>
                <th className="px-6 py-3">Delivery #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">SO Reference</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {DELIVERIES.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm font-mono text-info-300">{delivery.id}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{delivery.date}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100">{delivery.customer}</td>
                  <td className="px-6 py-4 text-sm text-secondary-200">{delivery.product}</td>
                  <td className="px-6 py-4 text-sm text-secondary-100"><strong>{delivery.quantity}</strong> {delivery.unit}</td>
                  <td className="px-6 py-4 text-sm font-mono text-secondary-300">{delivery.reference}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={delivery.status === "Delivered" ? "success" : delivery.status === "Packing" ? "warning" : "info"}>
                      {delivery.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEditDelivery(delivery)} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDeleteDelivery(delivery.id)} className="text-danger-400 hover:text-danger-300 text-xs font-medium">Delete</button>
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
        title={selectedDelivery ? "Edit Delivery" : "Create Delivery"}
      >
        <DeliveryForm delivery={selectedDelivery} onSubmit={handleFormSubmit} />
      </Modal>
    </Layout>
  );
}
