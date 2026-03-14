import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "./ui/Button";

interface Product {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface TransferFormProps {
  transfer?: any;
  products: Product[];
  locations: Location[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function TransferForm({ transfer, products = [], locations = [], onSubmit, onCancel }: TransferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: transfer || {
      source_location_id: "",
      dest_location_id: "",
      product_id: "",
      quantity: "",
    },
  });

  console.log("TransferForm received products:", products);
  console.log("TransferForm received locations:", locations);

  const sourceLocationId = watch("source_location_id");
  const destLocationId = watch("dest_location_id");

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Convert string IDs to numbers
      const formattedData = {
        reference: data.reference || `TRN-${Date.now()}`,
        source_location_id: parseInt(data.source_location_id, 10),
        dest_location_id: parseInt(data.dest_location_id, 10),
        product_id: parseInt(data.product_id, 10),
        quantity: typeof data.quantity === 'string' ? parseFloat(data.quantity) : data.quantity,
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
      {locations.length === 0 && (
        <div className="p-3 bg-warning-500/10 border border-warning-500/50 rounded-lg text-warning-600 dark:text-warning-400 text-sm">
          ⚠️ No locations available. Please create warehouses and locations first.
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="source_location_id" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Source Location <span className="text-danger-500">*</span>
        </label>
        <select
          id="source_location_id"
          {...register("source_location_id", { required: "Source location is required" })}
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.source_location_id ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        >
          <option value="">-- Select source location --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {errors.source_location_id && <span className="text-xs text-danger-500">{errors.source_location_id.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="dest_location_id" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Destination Location <span className="text-danger-500">*</span>
        </label>
        <select
          id="dest_location_id"
          {...register("dest_location_id", { 
            required: "Destination location is required",
            validate: (value) => value !== sourceLocationId || "Destination must be different from source"
          })}
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.dest_location_id ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        >
          <option value="">-- Select destination location --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {errors.dest_location_id && <span className="text-xs text-danger-500">{errors.dest_location_id.message}</span>}
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
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.product_id && <span className="text-xs text-danger-500">{errors.product_id.message}</span>}
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
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.quantity ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
          placeholder="0.00"
        />
        {errors.quantity && <span className="text-xs text-danger-500">{errors.quantity.message}</span>}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (transfer ? "Update Transfer" : "Create Transfer")}
        </Button>
      </div>
    </form>
  );
}
