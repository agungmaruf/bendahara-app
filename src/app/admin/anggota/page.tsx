"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Info } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MonthGrid } from "@/components/MonthGrid";
import { MemberFormModal } from "@/components/MemberFormModal";
import { LevelBadge } from "@/components/gamify/LevelBadge";
import { Confetti } from "@/components/gamify/Confetti";
import { CelebrationToast } from "@/components/gamify/CelebrationToast";
import { STATUS_COLOR, STATUS_LABEL, formatRupiah } from "@/lib/format";
import { getLevel } from "@/lib/gamify";
import type { Member, MemberWithPayments } from "@/lib/types";

export default function AnggotaPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, members, loading, togglePayment, addMember, updateMember, deleteMember } =
    useKasData(YEAR);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [celebration, setCelebration] = useState<string | null>(null);

  async function handleToggle(m: MemberWithPayments, bulan: number, next: boolean) {
    const prevLevel = getLevel(m.totalCentang);
    await togglePayment(m.id, bulan, next);
    if (next) {
      const newTotal = m.totalCentang + 1;
      const newLevel = getLevel(newTotal);
      if (newTotal === 12) {
        setConfettiKey((k) => k + 1);
        setCelebration(`${m.nama_lengkap} lunas 12/12! Legenda Kas 👑`);
      } else if (newLevel.key !== prevLevel.key) {
        setCelebration(`${m.nama_lengkap} naik level jadi "${newLevel.label}" ${newLevel.emoji}`);
      }
    }
  }

  const filtered = members.filter((m) => m.nama_lengkap.toLowerCase().includes(q.toLowerCase()));

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(m: Member) {
    setEditing(m);
    setModalOpen(true);
  }

  async function handleDelete(m: Member) {
    if (!confirm(`Hapus ${m.nama_lengkap} dari data anggota? Riwayat iurannya juga akan terhapus.`)) return;
    await deleteMember(m.id);
  }

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      <Confetti triggerKey={confettiKey} />
      <CelebrationToast message={celebration} />
      <PageHeader
        title="Data & Iuran Anggota"
        subtitle={`${members.length} anggota terdaftar · Tahun ${settings.tahun_aktif}`}
        action={
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4" /> Tambah Anggota
          </Button>
        }
      />

      <div className="flex items-start gap-2 text-xs text-[color:var(--gold-ink)] bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 rounded-lg px-3 py-2.5 mb-5">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Aturan tarif aktif: bulan yang <strong>sudah tercentang</strong> tetap dihitung{" "}
          {formatRupiah(settings.iuran_rate_lama)}. Klik centang <strong>baru</strong> mulai{" "}
          {settings.rate_naik_mulai_bulan === 1 ? "Januari" : "bulan " + settings.rate_naik_mulai_bulan} otomatis
          dihitung {formatRupiah(settings.iuran_rate_baru)}. Ubah tarif di menu Pengaturan.
        </p>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari anggota…" className="pl-10" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--teal-tint)] text-left">
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide sticky left-0 bg-[color:var(--teal-tint)] z-10">
                  Anggota
                </th>
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide whitespace-nowrap">
                  Iuran per Bulan
                </th>
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide whitespace-nowrap">
                  Total
                </th>
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide whitespace-nowrap">
                  Level
                </th>
                <th className="px-4 py-3 font-semibold text-[color:var(--teal-deep)] text-xs uppercase tracking-wide text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--line)]">
              {filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-[color:var(--teal-tint)]/30 transition-colors">
                  <td className="px-4 py-3 sticky left-0 bg-[color:var(--paper-raised)] z-10">
                    <p className="font-medium text-[color:var(--ink)] whitespace-nowrap">
                      {i + 1}. {m.nama_lengkap}
                    </p>
                    {m.jabatan && <p className="text-xs text-[color:var(--ink-soft)]">{m.jabatan}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <MonthGrid
                      payments={m.payments}
                      editable
                      onToggle={(bulan, next) => handleToggle(m, bulan, next)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono-num whitespace-nowrap">
                    <p className="text-[color:var(--ink)] font-medium">{formatRupiah(m.totalRp)}</p>
                    <p className="text-xs text-[color:var(--ink-soft)]">{m.totalCentang}/12 bln</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[m.status]}`}>
                      {STATUS_LABEL[m.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LevelBadge totalCentang={m.totalCentang} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(m)}
                      aria-label={`Edit ${m.nama_lengkap}`}
                      className="p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      aria-label={`Hapus ${m.nama_lengkap}`}
                      className="p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--coral-tint)] hover:text-[color:var(--coral)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[color:var(--ink-soft)]">
                    Tidak ada anggota ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <MemberFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSubmit={(input) => (editing ? updateMember(editing.id, input) : addMember(input))}
      />
    </div>
  );
}
