"use client";

import { FileSpreadsheet, FileText, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/StatCard";
import { exportExcel, exportPDF } from "@/lib/export";
import { formatRupiah } from "@/lib/format";

export default function LaporanPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, members, expenses, loading, totalPemasukan, totalPengeluaran, saldo } =
    useKasData(YEAR);

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <PageHeader title="Laporan & Export" subtitle={`Tahun ${settings.tahun_aktif}`} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Pemasukan" value={formatRupiah(totalPemasukan)} icon={TrendingUp} accent="teal" />
        <StatCard label="Pengeluaran" value={formatRupiah(totalPengeluaran)} icon={TrendingDown} accent="coral" />
        <StatCard label="Saldo" value={formatRupiah(saldo)} icon={Wallet} accent="gold" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col items-start">
          <div className="p-3 rounded-xl bg-[color:var(--teal-tint)] text-[color:var(--teal)] mb-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-[color:var(--ink)] mb-1">Export ke Excel</h3>
          <p className="text-sm text-[color:var(--ink-soft)] mb-4">
            Berisi 3 sheet: rekap iuran per anggota per bulan, rincian pengeluaran, dan ringkasan kas.
            Formatnya sama seperti file Excel bendahara yang biasa dipakai.
          </p>
          <Button onClick={() => exportExcel(members, expenses, settings)} className="mt-auto">
            <FileSpreadsheet className="w-4 h-4" /> Download .xlsx
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-start">
          <div className="p-3 rounded-xl bg-[color:var(--coral-tint)] text-[color:var(--coral)] mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-[color:var(--ink)] mb-1">Export ke PDF</h3>
          <p className="text-sm text-[color:var(--ink-soft)] mb-4">
            Laporan siap cetak/kirim — tabel rekap iuran semua anggota dan rincian pengeluaran,
            cocok buat dilampirkan di laporan bulanan atau digrup WA.
          </p>
          <Button onClick={() => exportPDF(members, expenses, settings)} variant="secondary" className="mt-auto">
            <FileText className="w-4 h-4" /> Download .pdf
          </Button>
        </Card>
      </div>
    </div>
  );
}
