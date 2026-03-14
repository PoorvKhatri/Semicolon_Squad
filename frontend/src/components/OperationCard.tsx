import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "./ui/Button";

type OperationCardProps = {
  title: string;
  count: number;
  icon: ReactNode;
  color: "blue" | "green" | "orange" | "purple";
  actionLink: string;
  actionLabel?: string;
  status?: string;
};

const colorClasses = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  green: "bg-success-500/10 text-success-600 dark:text-success-400",
  orange: "bg-warning-500/10 text-warning-600 dark:text-warning-400",
  purple: "bg-primary-500/10 text-primary-600 dark:text-primary-400",
};

export default function OperationCard({
  title,
  count,
  icon,
  color,
  actionLink,
  actionLabel = "New",
  status,
}: OperationCardProps) {
  return (
    <div className="glass overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 shadow-soft">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
          <Link to={actionLink}>
            <Button
              variant="secondary"
              className="h-9 gap-1 px-3 py-2 text-xs"
              icon={<Plus size={16} />}
            >
              {actionLabel}
            </Button>
          </Link>
        </div>

        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-secondary-900 dark:text-white">{count}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
          <span>operations</span>
          {status && <span className="rounded-full bg-secondary-100 dark:bg-white/10 px-2 py-1">{status}</span>}
        </div>
      </div>
    </div>
  );
}
