export type Settings = {
  id: number;
  nama_rs: string;
  unit: string;
  nama_bendahara: string;
  tahun_aktif: number;
  iuran_rate_lama: number;
  iuran_rate_baru: number;
  rate_naik_mulai_bulan: number;
  catatan: string;
  updated_at: string;
};

export type Member = {
  id: string;
  urutan: number;
  nama_lengkap: string;
  jabatan: string;
  no_hp: string;
  aktif: boolean;
  keterangan: string;
  created_at: string;
};

export type Payment = {
  id: string;
  member_id: string;
  tahun: number;
  bulan: number;
  lunas: boolean;
  jumlah: number;
  dibayar_at: string | null;
  updated_at: string;
};

export type Expense = {
  id: string;
  tahun: number;
  bulan: number;
  tanggal: string | null;
  keterangan: string;
  jumlah: number;
  kategori: string;
  bukti_url: string | null;
  created_at: string;
};

export type MemberWithPayments = Member & {
  payments: Payment[];
  totalCentang: number;
  totalRp: number;
  status: "lunas" | "hampir" | "sebagian" | "baru" | "belum";
};

export const EXPENSE_CATEGORIES = [
  "Sosial/Duka",
  "Perpisahan",
  "Konsumsi",
  "Perlengkapan",
  "Kebersihan",
  "Acara/Kegiatan",
  "Lainnya",
] as const;
