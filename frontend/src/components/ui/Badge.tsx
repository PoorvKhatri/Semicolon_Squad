import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-secondary-100",
  success: "bg-success-500/15 text-success-100",
  warning: "bg-warning-400/15 text-warning-100",
  danger: "bg-danger-500/15 text-danger-100",
  info: "bg-info-500/15 text-info-100",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
