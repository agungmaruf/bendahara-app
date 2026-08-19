"use client";

import { useMemo, useState } from "react";
import { MessageCircle, PhoneOff, Copy, Check } from "lucide-react";
import { useKasData } from "@/lib/hooks/useKasData";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Textarea, Label, Select } from "@/components/ui/Input";
import { formatRupiah } from "@/lib/format";
import { MONTHS_ID } from "@/lib/constants";

function waLink(noHp: string, message: string) {
  const digits = noHp.replace(/[^0-9]/g, "");
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function PengingatPage() {
  const YEAR = new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
  const { settings, members, loading } = useKasData(YEAR);
  const [bulanTarget, setBulanTarget] = useState(new Date().getMonth() + 1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const template = useMemo(
    () =>
      settings
        ? `Halo {nama}, ini pengingat dari bendahara kas ${settings.unit}. Iuran bulan ${MONTHS_ID[bulanTarget - 1]} ${settings.tahun_aktif} belum tercatat lunas ya. Mohon konfirmasi kalau sudah transfer. Terima kasih 🙏`
        : "",
    [settings, bulanTarget]
  );
  const [message, setMessage] = useState(template);

  useMemo(() => setMessage(template), [template]);

  const belumBayar = members.filter((m) => {
    const p = m.payments.find((p) => p.bulan === bulanTarget);
    return !p?.lunas;
  });

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  if (loading || !settings) {
    return <div className="p-8 text-sm text-[color:var(--ink-soft)]">Memuat…</div>;
  }

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Pengingat Pembayaran"
        subtitle={`${belumBayar.length} anggota belum bayar iuran ${MONTHS_ID[bulanTarget - 1]}`}
      />

      <Card className="p-5 mb-6 space-y-4">
        <div>
          <Label htmlFor="bulan">Bulan yang dicek</Label>
          <Select id="bulan" value={bulanTarget} onChange={(e) => setBulanTarget(Number(e.target.value))} className="max-w-xs">
            {MONTHS_ID.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="msg">Template pesan (pakai {"{nama}"} untuk nama anggota)</Label>
          <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        </div>
        <p className="text-xs text-[color:var(--ink-soft)]">
          Klik tombol WhatsApp di setiap anggota untuk membuka chat dengan pesan sudah terisi otomatis —
          tinggal tekan kirim. Pastikan No. HP anggota sudah diisi di menu Data Anggota.
        </p>
      </Card>

      <div className="space-y-2.5">
        {belumBayar.map((m) => {
          const personalMsg = message.replace("{nama}", m.nama_lengkap.split(",")[0]);
          return (
            <Card key={m.id} className="p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[color:var(--ink)] truncate">{m.nama_lengkap}</p>
                <p className="text-xs text-[color:var(--ink-soft)]">
                  {m.totalCentang}/12 bulan terbayar · {formatRupiah(m.totalRp)}
                </p>
              </div>
              <button
                onClick={() => copyText(m.id, personalMsg)}
                className="p-2 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)] shrink-0"
                aria-label="Salin pesan"
                title="Salin pesan"
              >
                {copiedId === m.id ? <Check className="w-4 h-4 text-[color:var(--ok)]" /> : <Copy className="w-4 h-4" />}
              </button>
              {m.no_hp ? (
                <a
                  href={waLink(m.no_hp, personalMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold shrink-0 hover:brightness-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Ingatkan
                </a>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[color:var(--line)] text-[color:var(--ink-soft)] text-xs font-medium shrink-0">
                  <PhoneOff className="w-3.5 h-3.5" /> No. HP kosong
                </span>
              )}
            </Card>
          );
        })}
        {belumBayar.length === 0 && (
          <p className="text-sm text-[color:var(--ink-soft)] text-center py-10">
            🎉 Semua anggota sudah bayar iuran bulan ini!
          </p>
        )}
      </div>
    </div>
  );
}
