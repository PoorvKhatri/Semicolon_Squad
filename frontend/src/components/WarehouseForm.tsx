import { useForm } from "react-hook-form";

import Button from "./ui/Button";

type WarehouseFormData = { name: string; description?: string | null };

export default function WarehouseForm({ warehouse, onSubmit }: { warehouse: Partial<WarehouseFormData> | null; onSubmit: (data: WarehouseFormData) => void }) {
  const { register, handleSubmit } = useForm<WarehouseFormData>({ defaultValues: (warehouse ?? {}) as any });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-secondary-200">
          Warehouse Name
        </label>
        <input
          id="name"
          {...register("name", { required: true })}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-secondary-200">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
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
