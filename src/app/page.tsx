"use client";

import { Activity, Wallet, TrendingDown, TrendingUp, ShieldCheck } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { StatCard } from "@/components/StatCard";
import { PulseDivider } from "@/components/PulseDivider";
import { PublicSearch } from "@/components/PublicSearch";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { Card } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function PublicPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, members, expenses, loading, totalPemasukan, totalPengeluaran, saldo } =
    useKasData(YEAR);

  const lunasCount = members.filter((m) => m.totalCentang >= 11).length;

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[color:var(--ink-soft)]">
          <Activity className="w-5 h-5 animate-pulse text-[color:var(--teal)]" />
          <span className="text-sm">Memuat data kas…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--paper-raised)]">
        <div className="max-w-5xl mx-auto px-5 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[color:var(--teal)] flex items-center justify-center text-white shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg leading-tight text-[color:var(--ink)]">
                Kas {settings.unit}
              </h1>
              <p className="text-xs text-[color:var(--ink-soft)]">{settings.nama_rs} · Tahun {settings.tahun_aktif}</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs font-medium text-[color:var(--ink-soft)] hover:text-[color:var(--teal)] transition-colors"
          >
            Login Bendahara →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[color:var(--teal)] bg-[color:var(--teal-tint)] w-fit px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Transparan — semua anggota bisa cek status iuran di sini
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[color:var(--ink)] max-w-xl">
          Denyut kas kita, terlihat jelas setiap saat.
        </h2>

        <PulseDivider />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Pemasukan" value={formatRupiah(totalPemasukan)} icon={TrendingUp} accent="teal" />
          <StatCard label="Pengeluaran" value={formatRupiah(totalPengeluaran)} icon={TrendingDown} accent="coral" />
          <StatCard label="Saldo Kas" value={formatRupiah(saldo)} icon={Wallet} accent="gold" />
          <StatCard
            label="Anggota Lunas"
            value={`${lunasCount}/${members.length}`}
            sub="11-12 bulan terbayar"
            icon={ShieldCheck}
            accent="teal"
          />
        </div>

        <Card className="p-5 mt-6">
          <p className="text-sm font-semibold text-[color:var(--ink)] mb-1">Arus Kas per Bulan</p>
          <p className="text-xs text-[color:var(--ink-soft)] mb-2">Tahun {settings.tahun_aktif}</p>
          <CashFlowChart members={members} expenses={expenses} />
        </Card>

        <div className="mt-10">
          <h3 className="font-display text-lg font-semibold text-[color:var(--ink)] mb-1">
            Cek status iuran kamu
          </h3>
          <p className="text-sm text-[color:var(--ink-soft)] mb-5">
            Cari namamu untuk melihat bulan mana saja yang sudah/belum terbayar.
          </p>
          <PublicSearch members={members} />
        </div>

        <footer className="mt-16 pb-8 text-center text-xs text-[color:var(--ink-soft)]">
          Dikelola oleh {settings.nama_bendahara} · Diperbarui otomatis secara real-time
        </footer>
      </main>
    </div>
  );
}
