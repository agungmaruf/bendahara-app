"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { MONTHS_ID } from "@/lib/constants";
import type { Expense } from "@/lib/types";

export function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
  tahun,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: Partial<Expense>) => Promise<unknown>;
  tahun: number;
  initial?: Expense | null;
}) {
  const [tanggal, setTanggal] = useState(initial?.tanggal ?? "");
  const [bulan, setBulan] = useState(initial?.bulan ?? new Date().getMonth() + 1);
  const [keterangan, setKeterangan] = useState(initial?.keterangan ?? "");
  const [jumlah, setJumlah] = useState(initial?.jumlah?.toString() ?? "");
  const [kategori, setKategori] = useState(initial?.kategori ?? EXPENSE_CATEGORIES[0]);
  const [buktiUrl, setBuktiUrl] = useState<string | null>(initial?.bukti_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `${tahun}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("bukti-transaksi").upload(path, file, {
      upsert: true,
    });
    if (!error) {
      const { data } = supabase.storage.from("bukti-transaksi").getPublicUrl(path);
      setBuktiUrl(data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keterangan.trim() || !jumlah) return;
    setLoading(true);
    await onSubmit({
      tahun,
      bulan,
      tanggal: tanggal || null,
      keterangan: keterangan.trim(),
      jumlah: Number(jumlah),
      kategori,
      bukti_url: buktiUrl,
    });
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Pengeluaran" : "Tambah Pengeluaran"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="bulan">Bulan</Label>
            <Select id="bulan" value={bulan} onChange={(e) => setBulan(Number(e.target.value))}>
              {MONTHS_ID.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="tanggal">Tanggal (opsional)</Label>
            <Input id="tanggal" type="date" value={tanggal ?? ""} onChange={(e) => setTanggal(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="ket">Keterangan</Label>
          <Textarea id="ket" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={2} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="jumlah">Jumlah (Rp)</Label>
            <Input id="jumlah" type="number" min={0} value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Select id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Bukti Transaksi (foto/scan nota)</Label>
          {buktiUrl ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={buktiUrl} alt="Bukti transaksi" className="h-28 rounded-lg border border-[color:var(--line)] object-cover" />
              <button
                type="button"
                onClick={() => setBuktiUrl(null)}
                className="absolute -top-2 -right-2 bg-[color:var(--coral)] text-white rounded-full p-1"
                aria-label="Hapus foto"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 justify-center border-2 border-dashed border-[color:var(--line)] rounded-lg py-4 text-sm text-[color:var(--ink-soft)] cursor-pointer hover:border-[color:var(--teal)] hover:text-[color:var(--teal)] transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? "Mengunggah…" : "Pilih foto nota"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={loading} disabled={uploading}>
            {initial ? "Simpan Perubahan" : "Tambah Pengeluaran"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
