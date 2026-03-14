import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "glass relative flex min-h-[110px] flex-col justify-between overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 bg-gradient-to-br from-secondary-100 dark:from-white/5 via-secondary-100 dark:via-white/5 to-secondary-200 dark:to-white/10 p-5 shadow-soft",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600 dark:text-secondary-300">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-secondary-900 dark:text-white">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-200 dark:bg-white/5 text-secondary-900 dark:text-white">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 ${
            trend.positive ? "bg-success-500/15 text-success-700 dark:text-success-100" : "bg-danger-500/15 text-danger-700 dark:text-danger-100"
          }`}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}
        </span>
        <span className="text-xs text-secondary-500 dark:text-secondary-400">vs last week</span>
      </div>
    </div>
  );
}
