export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

export const MONTHS_SHORT_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
] as const;

export function monthName(m: number, short = false) {
  const arr = short ? MONTHS_SHORT_ID : MONTHS_ID;
  return arr[Math.min(Math.max(m - 1, 0), 11)];
}
