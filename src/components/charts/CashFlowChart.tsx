"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MONTHS_SHORT_ID } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import type { Expense, MemberWithPayments } from "@/lib/types";

export function CashFlowChart({
  members,
  expenses,
}: {
  members: MemberWithPayments[];
  expenses: Expense[];
}) {
  const data = MONTHS_SHORT_ID.map((label, i) => {
    const bulan = i + 1;
    const masuk = members.reduce((s, m) => {
      const p = m.payments.find((p) => p.bulan === bulan);
      return s + (p?.lunas ? p.jumlah : 0);
    }, 0);
    const keluar = expenses.filter((e) => e.bulan === bulan).reduce((s, e) => s + e.jumlah, 0);
    return { bulan: label, Pemasukan: masuk, Pengeluaran: keluar };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="fillMasuk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--teal)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillKeluar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--coral)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--coral)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--grid)" vertical={false} />
        <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--ink-soft)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v / 1000}k`}
          width={36}
        />
        <Tooltip
          formatter={(v) => formatRupiah(Number(v))}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid var(--line)",
            fontSize: 12,
            fontFamily: "var(--font-body)",
          }}
        />
        <Area type="monotone" dataKey="Pemasukan" stroke="var(--teal)" strokeWidth={2} fill="url(#fillMasuk)" />
        <Area type="monotone" dataKey="Pengeluaran" stroke="var(--coral)" strokeWidth={2} fill="url(#fillKeluar)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
