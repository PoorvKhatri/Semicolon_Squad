import { useForm } from "react-hook-form";

import Button from "./ui/Button";

type ProductFormData = {
  name: string;
  sku: string;
  uom: string;
  description?: string | null;
  initial_stock?: number;
  reorder_point?: number;
};

export default function ProductForm({ product, onSubmit }: { product: Partial<ProductFormData> | null; onSubmit: (data: ProductFormData) => void }) {
  const { register, handleSubmit } = useForm<ProductFormData>({ defaultValues: product ?? {} as any });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-secondary-200">Product Name</label>
        <input id="name" {...register("name", { required: true })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sku" className="text-sm font-medium text-secondary-200">SKU</label>
        <input id="sku" {...register("sku", { required: true })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="uom" className="text-sm font-medium text-secondary-200">Unit of Measure</label>
        <input id="uom" {...register("uom", { required: true })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-secondary-200">Description</label>
        <textarea id="description" {...register("description")} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="initial_stock" className="text-sm font-medium text-secondary-200">Initial Stock</label>
        <input type="number" id="initial_stock" {...register("initial_stock", { valueAsNumber: true })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reorder_point" className="text-sm font-medium text-secondary-200">Reorder Point</label>
        <input type="number" id="reorder_point" {...register("reorder_point", { valueAsNumber: true })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
}
