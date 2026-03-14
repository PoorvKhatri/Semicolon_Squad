import { twMerge } from "tailwind-merge";

export default function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "h-full animate-pulse rounded-xl bg-white/10",
        className
      )}
    />
  );
}
