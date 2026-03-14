import { useForm } from "react-hook-form";

import Button from "./ui/Button";

export default function AdjustmentForm({ adjustment, onSubmit }) {
  const { register, handleSubmit } = useForm({ defaultValues: adjustment });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="product" className="text-sm font-medium text-secondary-200">
          Product
        </label>
        <input
          id="product"
          {...register("product", { required: true })}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium text-secondary-200">
          Location
        </label>
        <input
          id="location"
          {...register("location", { required: true })}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="countedQuantity" className="text-sm font-medium text-secondary-200">
          Counted Quantity
        </label>
        <input
          id="countedQuantity"
          type="number"
          {...register("countedQuantity", { required: true, valueAsNumber: true })}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reason" className="text-sm font-medium text-secondary-200">
          Reason
        </label>
        <input
          id="reason"
          {...register("reason")}
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
