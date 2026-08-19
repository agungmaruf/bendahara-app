"use client";

import { clsx } from "clsx";
import { MONTHS_SHORT_ID } from "@/lib/constants";
import type { Payment } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export function MonthGrid({
  payments,
  editable,
  onToggle,
  size = "md",
}: {
  payments: Payment[];
  editable?: boolean;
  onToggle?: (bulan: number, next: boolean) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex gap-1">
      {payments.map((p) => {
        const cell = (
          <div
            key={p.bulan}
            className={clsx(
              "group relative flex flex-col items-center justify-center rounded-md border font-mono-num transition-all",
              size === "md" ? "w-9 h-11 text-[11px]" : "w-6 h-8 text-[9px]",
              p.lunas
                ? "bg-[color:var(--teal)] border-[color:var(--teal)] text-white"
                : "bg-white border-[color:var(--line)] text-[color:var(--ink-soft)]",
              editable && "cursor-pointer hover:border-[color:var(--teal)] hover:scale-105"
            )}
            title={`${MONTHS_SHORT_ID[p.bulan - 1]}${p.lunas ? ` — ${formatRupiah(p.jumlah)}` : ""}`}
            onClick={editable ? () => onToggle?.(p.bulan, !p.lunas) : undefined}
            role={editable ? "button" : undefined}
            tabIndex={editable ? 0 : undefined}
            onKeyDown={
              editable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggle?.(p.bulan, !p.lunas);
                    }
                  }
                : undefined
            }
          >
            <span className="opacity-70 leading-none">{MONTHS_SHORT_ID[p.bulan - 1]}</span>
            <span className="leading-none mt-0.5">{p.lunas ? "✓" : "·"}</span>
          </div>
        );
        return cell;
      })}
    </div>
  );
}
