"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { MemberWithPayments } from "@/lib/types";

const COLORS: Record<string, string> = {
  "Lunas (11-12 bln)": "var(--teal)",
  "Hampir (9-10 bln)": "var(--gold)",
  "Sebagian (5-8 bln)": "#F97316",
  "Baru (1-4 bln)": "#60A5FA",
  "Belum Bayar": "var(--coral)",
};

export function MemberDonut({ members }: { members: MemberWithPayments[] }) {
  const data = [
    { name: "Lunas (11-12 bln)", value: members.filter((m) => m.totalCentang >= 11).length },
    { name: "Hampir (9-10 bln)", value: members.filter((m) => m.totalCentang >= 9 && m.totalCentang < 11).length },
    { name: "Sebagian (5-8 bln)", value: members.filter((m) => m.totalCentang >= 5 && m.totalCentang < 9).length },
    { name: "Baru (1-4 bln)", value: members.filter((m) => m.totalCentang >= 1 && m.totalCentang < 5).length },
    { name: "Belum Bayar", value: members.filter((m) => m.totalCentang === 0).length },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={COLORS[d.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
