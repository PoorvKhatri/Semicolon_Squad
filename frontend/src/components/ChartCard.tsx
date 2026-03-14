import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("glass overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 shadow-soft", className)}>
      <div className="border-b border-secondary-200 dark:border-white/10 px-6 py-4">
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
