"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { MonthGrid } from "@/components/MonthGrid";
import { STATUS_COLOR, STATUS_LABEL, formatRupiah } from "@/lib/format";
import type { MemberWithPayments } from "@/lib/types";

export function PublicSearch({ members }: { members: MemberWithPayments[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return members;
    return members.filter((m) => m.nama_lengkap.toLowerCase().includes(term));
  }, [members, q]);

  return (
    <div>
      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama kamu…"
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-[color:var(--ink-soft)] text-center py-10">
            Nama tidak ditemukan. Coba kata kunci lain.
          </p>
        )}
        {filtered.map((m) => (
          <Card key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[color:var(--ink)] truncate">{m.nama_lengkap}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[m.status]}`}>
                  {STATUS_LABEL[m.status]}
                </span>
                <span className="text-xs font-mono-num text-[color:var(--ink-soft)]">
                  {m.totalCentang}/12 bulan · {formatRupiah(m.totalRp)}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto -mx-1 px-1">
              <MonthGrid payments={m.payments} size="sm" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
