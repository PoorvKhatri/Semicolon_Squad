import { twMerge } from "tailwind-merge";

type StatusVariant = "draft" | "waiting" | "ready" | "completed" | "cancelled" | "pending";

const statusStyles: Record<StatusVariant, string> = {
  draft: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  waiting: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  ready: "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300",
  completed: "bg-success-500/10 text-success-700 dark:text-success-300",
  cancelled: "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300",
  pending: "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300",
};

const statusLabels: Record<StatusVariant, string> = {
  draft: "Draft",
  waiting: "Waiting",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
};

type StatusBadgeProps = {
  status: StatusVariant | string;
  className?: string;
  custom?: boolean;
};

export default function StatusBadge({
  status,
  className,
  custom = false,
}: StatusBadgeProps) {
  const lowerStatus = status.toLowerCase() as StatusVariant;
  const style = statusStyles[lowerStatus] || statusStyles.pending;
  const label = custom ? status : statusLabels[lowerStatus];

  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
