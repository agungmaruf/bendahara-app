"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ImageOff, ExternalLink } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExpenseFormModal } from "@/components/ExpenseFormModal";
import { formatDate, formatRupiah } from "@/lib/format";
import { MONTHS_ID } from "@/lib/constants";
import type { Expense } from "@/lib/types";

export default function PengeluaranPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, expenses, totalPengeluaran, loading, addExpense, updateExpense, deleteExpense } =
    useKasData(YEAR);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(e: Expense) {
    setEditing(e);
    setModalOpen(true);
  }
  async function handleDelete(e: Expense) {
    if (!confirm(`Hapus pengeluaran "${e.keterangan}"?`)) return;
    await deleteExpense(e.id);
  }

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Pengeluaran Kas"
        subtitle={`Total ${formatRupiah(totalPengeluaran)} · Tahun ${settings.tahun_aktif}`}
        action={
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4" /> Tambah Pengeluaran
          </Button>
        }
      />

      <div className="space-y-3">
        {expenses.map((e) => (
          <Card key={e.id} className="p-4 flex items-center gap-4">
            {e.bukti_url ? (
              <a href={e.bukti_url} target="_blank" rel="noreferrer" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.bukti_url} alt="Bukti" className="w-14 h-14 rounded-lg object-cover border border-[color:var(--line)]" />
              </a>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-[color:var(--teal-tint)] flex items-center justify-center shrink-0 text-[color:var(--ink-soft)]">
                <ImageOff className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[color:var(--ink)] truncate">{e.keterangan}</p>
              <p className="text-xs text-[color:var(--ink-soft)]">
                {MONTHS_ID[e.bulan - 1]} {e.tahun} · {e.kategori}
                {e.tanggal ? ` · ${formatDate(e.tanggal)}` : ""}
              </p>
            </div>
            <span className="font-mono-num font-semibold text-[color:var(--coral)] shrink-0">
              -{formatRupiah(e.jumlah)}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {e.bukti_url && (
                <a
                  href={e.bukti_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)]"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => openEdit(e)}
                className="p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)]"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(e)}
                className="p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--coral-tint)] hover:text-[color:var(--coral)]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
        {expenses.length === 0 && (
          <p className="text-sm text-[color:var(--ink-soft)] text-center py-10">Belum ada pengeluaran tercatat.</p>
        )}
      </div>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tahun={YEAR}
        initial={editing}
        onSubmit={(input) => (editing ? updateExpense(editing.id, input) : addExpense(input))}
      />
    </div>
  );
}
