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
        "glass relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}
