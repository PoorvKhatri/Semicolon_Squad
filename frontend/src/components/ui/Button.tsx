import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const VARIANTS: Record<string, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 dark:hover:bg-primary-600 focus:ring-primary-400 shadow-sm focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500 dark:disabled:hover:bg-primary-500",
  secondary:
    "bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-100 hover:bg-secondary-300 dark:hover:bg-secondary-700 focus:ring-secondary-400 dark:focus:ring-secondary-500 shadow-sm focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary-200 dark:disabled:hover:bg-secondary-800",
  ghost: "bg-transparent text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-white/10 focus:ring-secondary-200 dark:focus:ring-white/25 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent",
  danger: "bg-danger-600 text-white hover:bg-danger-500 focus:ring-danger-400 shadow-sm focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-danger-600",
};

export default function Button({
  className,
  children,
  variant = "primary",
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
