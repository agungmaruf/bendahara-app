"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { MONTHS_ID } from "@/lib/constants";

export default function PengaturanPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, loading, updateSettings } = useKasData(YEAR);

  const [form, setForm] = useState({
    nama_rs: "",
    unit: "",
    nama_bendahara: "",
    tahun_aktif: 2026,
    iuran_rate_lama: 10000,
    iuran_rate_baru: 20000,
    rate_naik_mulai_bulan: 2,
    catatan: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        nama_rs: settings.nama_rs,
        unit: settings.unit,
        nama_bendahara: settings.nama_bendahara,
        tahun_aktif: settings.tahun_aktif,
        iuran_rate_lama: settings.iuran_rate_lama,
        iuran_rate_baru: settings.iuran_rate_baru,
        rate_naik_mulai_bulan: settings.rate_naik_mulai_bulan,
        catatan: settings.catatan,
      });
    }
  }, [settings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <PageHeader title="Pengaturan" subtitle="Identitas unit & aturan tarif iuran" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-[color:var(--ink)]">Identitas</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rs">Nama RS / Instansi</Label>
              <Input id="rs" value={form.nama_rs} onChange={(e) => setForm({ ...form, nama_rs: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="unit">Unit / Nama Kas</Label>
              <Input id="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="bendahara">Nama Bendahara</Label>
              <Input id="bendahara" value={form.nama_bendahara} onChange={(e) => setForm({ ...form, nama_bendahara: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="tahun">Tahun Aktif</Label>
              <Input
                id="tahun"
                type="number"
                value={form.tahun_aktif}
                onChange={(e) => setForm({ ...form, tahun_aktif: Number(e.target.value) })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-[color:var(--ink)]">Aturan Tarif Iuran</h3>
          <p className="text-xs text-[color:var(--ink-soft)] -mt-2">
            Bulan yang <strong>sudah tercentang</strong> di data lama tidak akan berubah nilainya.
            Aturan ini hanya berlaku untuk centang <strong>baru</strong> yang dibuat setelah pengaturan ini disimpan.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lama">Tarif Lama (Rp)</Label>
              <Input
                id="lama"
                type="number"
                value={form.iuran_rate_lama}
                onChange={(e) => setForm({ ...form, iuran_rate_lama: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="baru">Tarif Baru (Rp)</Label>
              <Input
                id="baru"
                type="number"
                value={form.iuran_rate_baru}
                onChange={(e) => setForm({ ...form, iuran_rate_baru: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="mulai">Berlaku Mulai Bulan</Label>
              <Select
                id="mulai"
                value={form.rate_naik_mulai_bulan}
                onChange={(e) => setForm({ ...form, rate_naik_mulai_bulan: Number(e.target.value) })}
              >
                {MONTHS_ID.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-[color:var(--ink)]">Catatan</h3>
          <Textarea
            value={form.catatan}
            onChange={(e) => setForm({ ...form, catatan: e.target.value })}
            rows={3}
            placeholder="Catatan tambahan untuk anggota, ditampilkan opsional."
          />
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving}>Simpan Pengaturan</Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-[color:var(--ok)]">
              <Check className="w-4 h-4" /> Tersimpan
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
