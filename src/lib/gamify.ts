import type { MemberWithPayments, Payment } from "./types";

/** Level anggota berdasarkan jumlah bulan yang sudah lunas (0-12). */
export type Level = {
  key: string;
  label: string;
  emoji: string;
  min: number;
  /** Kelas Tailwind siap-pakai (mengikuti pola STATUS_COLOR di format.ts). */
  badgeClass: string;
  /** Warna solid (CSS var) untuk progress bar / ring. */
  barVar: string;
};

export const LEVELS: Level[] = [
  {
    key: "pemula",
    label: "Pemula",
    emoji: "🌱",
    min: 0,
    badgeClass: "bg-[color:var(--ink-soft)]/10 text-[color:var(--ink-soft)] border-[color:var(--ink-soft)]/20",
    barVar: "--ink-soft",
  },
  {
    key: "rajin",
    label: "Rajin",
    emoji: "🔥",
    min: 3,
    badgeClass: "bg-[color:var(--coral)]/12 text-[color:var(--coral)] border-[color:var(--coral)]/25",
    barVar: "--coral",
  },
  {
    key: "konsisten",
    label: "Konsisten",
    emoji: "⭐",
    min: 6,
    badgeClass: "bg-[color:var(--teal)]/12 text-[color:var(--teal)] border-[color:var(--teal)]/25",
    barVar: "--teal",
  },
  {
    key: "juara",
    label: "Juara Kas",
    emoji: "🏆",
    min: 9,
    badgeClass: "bg-[color:var(--gold)]/18 text-[color:var(--gold-ink)] border-[color:var(--gold)]/35",
    barVar: "--gold",
  },
  {
    key: "legenda",
    label: "Legenda Kas",
    emoji: "👑",
    min: 12,
    badgeClass: "bg-[color:var(--ok)]/15 text-[color:var(--ok)] border-[color:var(--ok)]/30",
    barVar: "--ok",
  },
];

export function getLevel(totalCentang: number): Level {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (totalCentang >= l.min) current = l;
  }
  return current;
}

export function nextLevel(totalCentang: number): Level | null {
  const idx = LEVELS.findIndex((l) => l.key === getLevel(totalCentang).key);
  return LEVELS[idx + 1] ?? null;
}

/** Poin gamifikasi sederhana: 100 XP per bulan lunas. */
export function xpForMember(totalCentang: number): number {
  return totalCentang * 100;
}

/** Rentetan (streak) bulan berturut-turut yang sudah lunas dalam satu tahun. */
export function computeStreak(payments: Pick<Payment, "bulan" | "lunas">[]): number {
  const sorted = [...payments].sort((a, b) => a.bulan - b.bulan);
  let streak = 0;
  let best = 0;
  for (const p of sorted) {
    if (p.lunas) {
      streak += 1;
      best = Math.max(best, streak);
    } else {
      streak = 0;
    }
  }
  return best;
}

/** Urutkan anggota untuk papan peringkat: bulan lunas terbanyak, lalu nominal terbesar. */
export function rankMembers<T extends { totalCentang: number; totalRp: number }>(members: T[]): T[] {
  return [...members].sort((a, b) => b.totalCentang - a.totalCentang || b.totalRp - a.totalRp);
}

/** Persentase capaian kolektif seluruh anggota (rata-rata bulan lunas / 12). */
export function collectiveProgress(members: MemberWithPayments[]): number {
  if (members.length === 0) return 0;
  const totalPossible = members.length * 12;
  const totalPaid = members.reduce((s, m) => s + m.totalCentang, 0);
  return Math.round((totalPaid / totalPossible) * 100);
}
