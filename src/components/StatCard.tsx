import { clsx } from "clsx";
import { Card } from "./ui/Card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "teal" | "gold" | "coral";
}) {
  return (
    <Card className="p-5 relative overflow-hidden [clip-path:inset(0_round_1rem)]">
      <div
        className={clsx(
          "absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none",
          accent === "teal" && "bg-[color:var(--teal)]",
          accent === "gold" && "bg-[color:var(--gold)]",
          accent === "coral" && "bg-[color:var(--coral)]"
        )}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ink-soft)]">
            {label}
          </p>
          <p className="font-display font-mono-num text-2xl font-semibold mt-1.5 text-[color:var(--ink)]">
            {value}
          </p>
          {sub && <p className="text-xs text-[color:var(--ink-soft)] mt-1">{sub}</p>}
        </div>
        <div
          className={clsx(
            "p-2 rounded-xl",
            accent === "teal" && "bg-[color:var(--teal-tint)] text-[color:var(--teal)]",
            accent === "gold" && "bg-[color:var(--gold)]/15 text-[color:var(--gold-ink)]",
            accent === "coral" && "bg-[color:var(--coral-tint)] text-[color:var(--coral)]"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
