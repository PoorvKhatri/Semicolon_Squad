import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const VARIANTS: Record<string, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 focus:ring-primary-400 shadow-sm focus:ring-2",
  secondary:
    "bg-secondary-800 text-secondary-100 hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm focus:ring-2",
  ghost: "bg-transparent text-secondary-100 hover:bg-white/10 focus:ring-white/25 focus:ring-2",
  danger: "bg-danger-600 text-white hover:bg-danger-500 focus:ring-danger-400 shadow-sm focus:ring-2",
};

export default function Button({
  className,
  children,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
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
