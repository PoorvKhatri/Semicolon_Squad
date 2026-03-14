import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "./ui/Button";

interface ReceiptFormProps {
  receipt?: any;
  products: any[];
  warehouses: any[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function ReceiptForm({ receipt, products = [], warehouses = [], onSubmit, onCancel }: ReceiptFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: receipt || {
      supplier: "",
      product_id: "",
      destination_location_id: "",
      quantity: "",
    },
  });

  console.log("ReceiptForm received products:", products);
  console.log("ReceiptForm received warehouses:", warehouses);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Ensure numeric conversion and wrap in items array as required by backend schema
      const formattedData = {
        reference: data.reference || `REC-${Date.now()}`,
        supplier: data.supplier,
        items: [{
          product_id: parseInt(data.product_id, 10),
          location_id: parseInt(data.destination_location_id, 10),
          quantity: typeof data.quantity === 'string' ? parseFloat(data.quantity) : data.quantity,
        }]
      };
      await onSubmit(formattedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {products.length === 0 && (
        <div className="p-3 bg-warning-500/10 border border-warning-500/50 rounded-lg text-warning-600 dark:text-warning-400 text-sm">
          ⚠️ No products available. Please create products first.
        </div>
      )}
      {warehouses.length === 0 && (
        <div className="p-3 bg-warning-500/10 border border-warning-500/50 rounded-lg text-warning-600 dark:text-warning-400 text-sm">
          ⚠️ No warehouses available. Please create warehouses first.
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="supplier" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Supplier <span className="text-danger-500">*</span>
        </label>
        <input
          id="supplier"
          {...register("supplier", { required: "Supplier is required" })}
          placeholder="Enter supplier name"
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.supplier ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        />
        {errors.supplier && <span className="text-xs text-danger-500">{errors.supplier.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="product_id" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Product <span className="text-danger-500">*</span>
        </label>
        <select
          id="product_id"
          {...register("product_id", { required: "Product is required" })}
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.product_id ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        >
          <option value="">-- Select product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        {errors.product_id && <span className="text-xs text-danger-500">{errors.product_id.message}</span>}
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="destination_location_id" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Destination Warehouse <span className="text-danger-500">*</span>
        </label>
        <select
          id="destination_location_id"
          {...register("destination_location_id", { required: "Destination warehouse is required" })}
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.destination_location_id ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        >
          <option value="">-- Select warehouse --</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
        {errors.destination_location_id && <span className="text-xs text-danger-500">{errors.destination_location_id.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="quantity" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Quantity <span className="text-danger-500">*</span>
        </label>
        <input
          id="quantity"
          type="number"
          step="0.01"
          min="0"
          {...register("quantity", { 
            required: "Quantity is required",
            min: { value: 0.01, message: "Quantity must be greater than 0" }
          })}
          placeholder="0.00"
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.quantity ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        />
        {errors.quantity && <span className="text-xs text-danger-500">{errors.quantity.message}</span>}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (receipt ? "Update Receipt" : "Create Receipt")}
        </Button>
      </div>
    </form>
  );
}
