import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Badge from "./ui/Badge";

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  Draft: "warning",
  Waiting: "info",
  Ready: "success",
  Done: "success",
  Canceled: "danger",
};

export type ActivityRow = {
  id: string;
  date: string;
  product: string;
  operation: string;
  quantity: string;
  warehouse: string;
  status: string;
  avatar?: ReactNode;
};

export default function ActivityTable({
  className,
  rows,
}: {
  className?: string;
  rows: ActivityRow[];
}) {
  return (
    <div className={twMerge("glass overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 shadow-soft", className)}>
      <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Recent activity</h3>
        <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">Latest stock movements and order updates.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary-100 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Operation</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Warehouse</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-white/10">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-secondary-100 dark:hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-200">{row.date}</td>
                <td className="px-6 py-4 text-sm text-secondary-900 dark:text-secondary-100">
                  <div className="flex items-center gap-2">
                    {row.avatar}
                    <span>{row.product}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-200">{row.operation}</td>
                <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-200">{row.quantity}</td>
                <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-200">{row.warehouse}</td>
                <td className="px-6 py-4">
                  <Badge variant={STATUS_VARIANTS[row.status] ?? "default"}>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
