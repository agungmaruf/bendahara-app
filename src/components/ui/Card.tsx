import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-[color:var(--paper-raised)] border border-[color:var(--line)] rounded-2xl shadow-[0_1px_2px_rgba(14,33,29,0.04)]",
        className
      )}
      {...props}
    />
  );
}
