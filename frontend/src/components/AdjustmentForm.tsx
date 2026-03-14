import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "./ui/Button";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Location {
  id: number;
  name: string;
}

interface AdjustmentFormProps {
  adjustment?: any;
  products: Product[];
  locations: Location[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function AdjustmentForm({ adjustment, products = [], locations = [], onSubmit, onCancel }: AdjustmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: adjustment || {
      product_id: "",
      location_id: "",
      counted_qty: "",
      reason: "",
    },
  });

  console.log("AdjustmentForm received products:", products);
  console.log("AdjustmentForm received locations:", locations);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Convert string IDs to numbers
      const formattedData = {
        reference: data.reference || `ADJ-${Date.now()}`,
        product_id: parseInt(data.product_id, 10),
        location_id: parseInt(data.location_id, 10),
        actual_quantity: typeof data.counted_qty === 'string' ? parseFloat(data.counted_qty) : data.counted_qty,
        reason: data.reason || null,
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
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
        {errors.product_id && <span className="text-xs text-danger-500">{errors.product_id.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location_id" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Location <span className="text-danger-500">*</span>
        </label>
        <select
          id="location_id"
          {...register("location_id", { required: "Location is required" })}
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.location_id ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        >
          <option value="">-- Select location --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {errors.location_id && <span className="text-xs text-danger-500">{errors.location_id.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="counted_qty" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Counted Quantity <span className="text-danger-500">*</span>
        </label>
        <input
          id="counted_qty"
          type="number"
          step="0.01"
          min="0"
          {...register("counted_qty", { 
            required: "Counted quantity is required", 
            min: { value: 0, message: "Quantity cannot be negative" }
          })}
          placeholder="0.00"
          className={`rounded-lg border bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.counted_qty ? "border-danger-500 dark:border-danger-500" : "border-secondary-300 dark:border-white/10"
          }`}
        />
        {errors.counted_qty && <span className="text-xs text-danger-500">{errors.counted_qty.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reason" className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          {...register("reason")}
          rows={3}
          placeholder="Explain the adjustment reason (e.g., damaged, lost, found)"
          className="rounded-lg border border-secondary-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (adjustment ? "Update Adjustment" : "Create Adjustment")}
        </Button>
      </div>
    </form>
  );
}
