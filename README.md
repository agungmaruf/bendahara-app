# Kas JHC — Aplikasi Bendahara

Aplikasi web untuk mengelola kas & iuran bulanan anggota JHC,
menggantikan file Excel "UANG KAS RR.xlsx". Dibangun dengan **Next.js 16 +
Supabase**, siap di-deploy ke **Vercel** (gratis).

## Fitur

- **Dashboard** — grafik arus kas, saldo real-time, sebaran status anggota
- **Data & Iuran Anggota** — grid centang 12 bulan per anggota (klik langsung
  tersimpan), tambah/edit/hapus anggota
- **Pengeluaran** — catat pengeluaran + upload foto bukti/nota
- **Laporan & Export** — export ke Excel (.xlsx, 3 sheet) dan PDF sekali klik
- **Pengingat Pembayaran** — generate link WhatsApp otomatis ke anggota yang
  belum bayar bulan berjalan
- **Pengaturan** — atur tarif iuran; **aturan kenaikan iuran otomatis**:
  bulan yang **sudah dicentang sebelumnya tetap dihitung tarif lama (Rp 10.000)**,
  sedangkan **centang baru mulai sekarang otomatis dihitung tarif baru (Rp 20.000)**
- **Halaman publik** (tanpa login) — anggota bisa cari nama sendiri & lihat
  status iuran + ringkasan kas, transparan untuk semua orang
- Login khusus bendahara (admin), anggota tidak perlu akun

## Arsitektur

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Supabase**: Postgres (data), Auth (login bendahara), Storage (foto bukti
  transaksi) — gratis untuk skala kecil seperti ini
- Desain visual custom ("financial pulse" — nuansa monitor jantung/EKG,
  cocok untuk RS Jantung): teal + emas + aksen koral, font Space Grotesk /
  Inter / JetBrains Mono

## 1. Setup Supabase (± 10 menit)

1. Buat akun & project baru di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor** → New Query → copy-paste seluruh isi file
   `supabase/schema.sql` dari project ini → **Run**.
   - Ini akan membuat semua tabel, aturan keamanan (RLS), storage bucket foto
     bukti, **dan mengisi otomatis 56 data anggota + status iuran + 5
     pengeluaran** persis seperti file Excel yang kamu kirim.
   - Kalau mau mulai dari data kosong, hapus bagian `SEED DATA` paling
     bawah di file itu sebelum menjalankannya.
3. Buka **Authentication → Users → Add user** → buat 1 akun untuk bendahara
   (email + password). Akun inilah yang dipakai login di `/login`.
4. Buka **Project Settings → API** → salin `Project URL` dan
   `anon public key`, kamu perlukan di langkah berikutnya.

## 2. Jalankan di komputer (opsional, buat coba-coba dulu)

```bash
npm install
cp .env.example .env.local
# lalu isi .env.local dengan URL & anon key dari Supabase
npm run dev
```

Buka `http://localhost:3000` (halaman publik) dan
`http://localhost:3000/login` (login bendahara).

## 3. Deploy ke Vercel

1. Push folder project ini ke repo GitHub kamu.
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo
   tadi.
3. Di step **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (nilai yang sama seperti di `.env.local`)
4. Klik **Deploy**. Selesai — aplikasi kamu langsung online, contohnya
   `kas-jhc.vercel.app`, sama seperti `balikinid.vercel.app`.

Setiap kali kamu push perubahan ke GitHub, Vercel otomatis re-deploy.

## Cara kerja aturan kenaikan iuran (Rp 10.000 → Rp 20.000)

Aturan ini diatur di menu **Pengaturan** (Tarif Lama, Tarif Baru, "Berlaku
Mulai Bulan"). Saat bendahara meng-klik kotak bulan yang **masih kosong**
di grid anggota:

- Kalau bulan itu ≥ "Berlaku Mulai Bulan" → otomatis tersimpan sebesar
  **Tarif Baru**.
- Kotak yang **sudah tercentang duluan** (data lama) **tidak pernah berubah**
  nilainya — tetap sebesar tarif saat pertama kali dicentang.

Jadi data lama aman, dan ke depannya sistem otomatis pakai tarif baru tanpa
bendahara perlu hitung manual.

## Struktur folder penting

```
src/app/                 halaman (public, login, admin/*)
src/components/          komponen UI & fitur
src/lib/hooks/useKasData.ts   satu hook pusat untuk semua data & aksi
src/lib/export.ts         export Excel & PDF
supabase/schema.sql        skema database + data awal (seed)
```

## Menambah bendahara / admin lain

Authentication → Users → Add user di Supabase Dashboard. Semua akun yang
terdaftar di sana otomatis bisa login ke `/admin`.
