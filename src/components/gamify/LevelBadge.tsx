import { getLevel } from "@/lib/gamify";

export function LevelBadge({
  totalCentang,
  size = "md",
}: {
  totalCentang: number;
  size?: "sm" | "md";
}) {
  const level = getLevel(totalCentang);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border whitespace-nowrap ${level.badgeClass} ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      title={`${level.label} — ${totalCentang}/12 bulan lunas`}
    >
      <span aria-hidden>{level.emoji}</span>
      {level.label}
    </span>
  );
}
