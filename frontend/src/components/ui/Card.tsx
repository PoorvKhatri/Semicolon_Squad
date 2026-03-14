import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "glass relative overflow-hidden rounded-2xl border border-secondary-200 dark:border-white/10 bg-secondary-50 dark:bg-white/5 shadow-soft backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}
