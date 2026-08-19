import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-[color:var(--line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)]/60 outline-none transition-colors focus:border-[color:var(--teal)]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-lg border border-[color:var(--line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)]/60 outline-none transition-colors focus:border-[color:var(--teal)]",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full rounded-lg border border-[color:var(--line)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--teal)]",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx("block text-xs font-semibold text-[color:var(--ink-soft)] mb-1.5 uppercase tracking-wide", className)}
      {...props}
    />
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}
