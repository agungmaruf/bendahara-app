import type { Member, Payment, MemberWithPayments } from "./types";

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}

export function formatDate(d: string | null | undefined): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function memberStatus(totalCentang: number): MemberWithPayments["status"] {
  if (totalCentang >= 11) return "lunas";
  if (totalCentang >= 9) return "hampir";
  if (totalCentang >= 5) return "sebagian";
  if (totalCentang >= 1) return "baru";
  return "belum";
}

export const STATUS_LABEL: Record<MemberWithPayments["status"], string> = {
  lunas: "🟢 Lunas / Hampir Lunas",
  hampir: "🟡 Hampir Lunas",
  sebagian: "⚠️ Sebagian",
  baru: "🔸 Baru Mulai",
  belum: "❌ Belum Bayar",
};

export const STATUS_COLOR: Record<MemberWithPayments["status"], string> = {
  lunas: "bg-[color:var(--ok)]/15 text-[color:var(--ok)]",
  hampir: "bg-[color:var(--gold)]/20 text-[color:var(--gold-ink)]",
  sebagian: "bg-orange-500/15 text-orange-700",
  baru: "bg-[color:var(--teal)]/10 text-[color:var(--teal)]",
  belum: "bg-[color:var(--coral)]/12 text-[color:var(--coral)]",
};

/** Gabungkan member + payments jadi satu objek siap-pakai untuk UI */
export function buildMemberWithPayments(
  member: Member,
  payments: Payment[],
  tahun: number
): MemberWithPayments {
  const byMonth = new Map<number, Payment>();
  for (const p of payments) {
    if (p.member_id === member.id && p.tahun === tahun) byMonth.set(p.bulan, p);
  }
  const full: Payment[] = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return (
      byMonth.get(m) ?? {
        id: `virtual-${member.id}-${m}`,
        member_id: member.id,
        tahun,
        bulan: m,
        lunas: false,
        jumlah: 0,
        dibayar_at: null,
        updated_at: "",
      }
    );
  });
  const totalCentang = full.filter((p) => p.lunas).length;
  const totalRp = full.reduce((s, p) => s + (p.lunas ? p.jumlah : 0), 0);
  return {
    ...member,
    payments: full,
    totalCentang,
    totalRp,
    status: memberStatus(totalCentang),
  };
}

/** Nominal yang berlaku kalau sebuah bulan DICENTANG SEKARANG, sesuai aturan
 *  kenaikan iuran: bulan yang sudah tercentang sebelumnya tetap di rate lama,
 *  centang baru (mulai settings.rate_naik_mulai_bulan) pakai rate baru. */
export function rateForNewCheck(
  bulan: number,
  rateLama: number,
  rateBaru: number,
  rateNaikMulaiBulan: number
): number {
  return bulan >= rateNaikMulaiBulan ? rateBaru : rateLama;
}
