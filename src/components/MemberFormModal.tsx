"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { Member } from "@/lib/types";

export function MemberFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: Partial<Member>) => Promise<unknown>;
  initial?: Member | null;
}) {
  const [nama, setNama] = useState(initial?.nama_lengkap ?? "");
  const [jabatan, setJabatan] = useState(initial?.jabatan ?? "");
  const [noHp, setNoHp] = useState(initial?.no_hp ?? "");
  const [keterangan, setKeterangan] = useState(initial?.keterangan ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    setLoading(true);
    await onSubmit({ nama_lengkap: nama.trim(), jabatan, no_hp: noHp, keterangan });
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Anggota" : "Tambah Anggota"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Ns. Nama Lengkap, S.Kep" required />
        </div>
        <div>
          <Label htmlFor="jabatan">Jabatan (opsional)</Label>
          <Input id="jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Perawat Pelaksana" />
        </div>
        <div>
          <Label htmlFor="hp">No. HP / WhatsApp (buat reminder)</Label>
          <Input id="hp" value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="628123456789" />
        </div>
        <div>
          <Label htmlFor="ket">Catatan (opsional)</Label>
          <Textarea id="ket" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={2} />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={loading}>{initial ? "Simpan Perubahan" : "Tambah Anggota"}</Button>
        </div>
      </form>
    </Modal>
  );
}
