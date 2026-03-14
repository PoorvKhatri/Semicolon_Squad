import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

const options = {
  category: ["All", "Category 1", "Category 2", "Category 3"],
  warehouse: ["All", "Main Warehouse", "Production Floor", "External Storage"],
  status: ["All", "Draft", "Pending", "Completed", "Cancelled"],
  operation: ["All", "Receipt", "Delivery", "Transfer", "Adjustment"],
};

export default function FiltersPanel({
  className,
  filters,
  onFilterChange,
}: {
  className?: string;
  filters?: { category: string; warehouse: string; status: string; operation: string };
  onFilterChange?: (key: string, value: string) => void;
}) {
  const currentFilters = filters || {
    category: "All",
    warehouse: "All",
    status: "All",
    operation: "All",
  };

  const filterGroups = useMemo(
    () => [
      { title: "Category", name: "category", items: options.category },
      { title: "Warehouse", name: "warehouse", items: options.warehouse },
      { title: "Status", name: "status", items: options.status },
      { title: "Operation", name: "operation", items: options.operation },
    ],
    []
  );

  return (
    <div
      className={twMerge(
        "glass overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 bg-secondary-50 dark:bg-white/5 shadow-soft",
        className
      )}
    >
      <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Filters</h3>
        <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">Refine inventory activity and reports.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2">
        {filterGroups.map((group) => (
          <div key={group.name}>
            <label className="text-xs font-semibold uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
              {group.title}
            </label>
            <select
              value={currentFilters[group.name as keyof typeof currentFilters]}
              onChange={(e) => onFilterChange?.(group.name, e.target.value)}
              className="mt-2 w-full rounded-xl border border-secondary-200 dark:border-white/10 bg-white dark:bg-black/40 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            >
              {group.items.map((item) => (
                <option key={item} value={item} className="bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100">
                  {item}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
