"use client";

import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { rankMembers, getLevel } from "@/lib/gamify";
import type { MemberWithPayments } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({
  members,
  limit = 5,
  title = "Papan Peringkat Kedisiplinan",
}: {
  members: MemberWithPayments[];
  limit?: number;
  title?: string;
}) {
  const ranked = rankMembers(members).slice(0, limit);

  if (ranked.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-[color:var(--gold-ink)]" />
        <p className="text-sm font-semibold text-[color:var(--ink)]">{title}</p>
      </div>
      <div className="space-y-3.5">
        {ranked.map((m, i) => {
          const level = getLevel(m.totalCentang);
          const pct = Math.round((m.totalCentang / 12) * 100);
          return (
            <div key={m.id} className="flex items-center gap-3">
              <span className={`w-6 text-center shrink-0 ${i < 3 ? "text-base" : "text-xs text-[color:var(--ink-soft)] font-mono-num"}`}>
                {MEDALS[i] ?? `${i + 1}.`}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-[color:var(--ink)] truncate">{m.nama_lengkap}</p>
                  <span className="text-[10px] text-[color:var(--ink-soft)] shrink-0 font-mono-num">
                    {level.emoji} {m.totalCentang}/12
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[color:var(--line)] overflow-hidden">
                  <div
                    className="h-full rounded-full leaderboard-bar"
                    style={{ width: `${pct}%`, background: `var(${level.barVar})` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
