"use client";

import { TrendingUp, TrendingDown, Wallet, Users, AlertTriangle } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { MemberDonut } from "@/components/charts/MemberDonut";
import { PulseDivider } from "@/components/PulseDivider";
import { formatRupiah } from "@/lib/format";

export default function DashboardPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, members, expenses, loading, totalPemasukan, totalPengeluaran, saldo } =
    useKasData(YEAR);

  const belumBayar = members.filter((m) => m.totalCentang === 0).length;

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto">
      <PageHeader
        title={`Dashboard — ${settings.unit}`}
        subtitle={`${settings.nama_rs} · Tahun ${settings.tahun_aktif}`}
      />
      <PulseDivider />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <StatCard label="Pemasukan" value={formatRupiah(totalPemasukan)} icon={TrendingUp} accent="teal" />
        <StatCard label="Pengeluaran" value={formatRupiah(totalPengeluaran)} icon={TrendingDown} accent="coral" />
        <StatCard label="Saldo Kas" value={formatRupiah(saldo)} icon={Wallet} accent="gold" />
        <StatCard label="Total Anggota" value={String(members.length)} icon={Users} accent="teal" />
        <StatCard
          label="Belum Bayar"
          value={String(belumBayar)}
          sub="Sama sekali belum centang"
          icon={AlertTriangle}
          accent="coral"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-5 mt-6">
        <Card className="p-5 lg:col-span-3">
          <p className="text-sm font-semibold text-[color:var(--ink)] mb-4">Arus Kas per Bulan</p>
          <CashFlowChart members={members} expenses={expenses} />
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-[color:var(--ink)] mb-4">Sebaran Status Anggota</p>
          <MemberDonut members={members} />
        </Card>
      </div>

      <Card className="p-5 mt-5">
        <p className="text-sm font-semibold text-[color:var(--ink)] mb-3">Pengeluaran Terbaru</p>
        <div className="divide-y divide-[color:var(--line)]">
          {expenses.slice(-5).reverse().map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2.5 text-sm">
              <div className="min-w-0">
                <p className="text-[color:var(--ink)] truncate">{e.keterangan}</p>
                <p className="text-xs text-[color:var(--ink-soft)]">{e.kategori}</p>
              </div>
              <span className="font-mono-num text-[color:var(--coral)] font-medium shrink-0 ml-3">
                -{formatRupiah(e.jumlah)}
              </span>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-sm text-[color:var(--ink-soft)] py-4 text-center">Belum ada pengeluaran tercatat.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
