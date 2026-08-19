-- ============================================================================
-- KAS LANTAI — Database Schema untuk Aplikasi Bendahara
-- Jalankan file ini di Supabase Dashboard > SQL Editor (sekali saja, di awal)
-- ============================================================================

-- Extension untuk UUID
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. SETTINGS — pengaturan umum unit & tarif iuran
-- ----------------------------------------------------------------------------
create table if not exists settings (
  id int primary key default 1,
  nama_rs text not null default 'RS Jantung Jakarta',
  unit text not null default 'Lantai 7',
  nama_bendahara text not null default 'Bendahara',
  tahun_aktif int not null default 2026,
  iuran_rate_lama numeric not null default 10000,   -- tarif utk centang yang SUDAH ada sebelum kenaikan
  iuran_rate_baru numeric not null default 20000,   -- tarif utk centang BARU mulai sekarang
  rate_naik_mulai_bulan int not null default 2,      -- bulan (1-12) mulai berlaku tarif baru, default Feb
  catatan text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 2. MEMBERS — data anggota
-- ----------------------------------------------------------------------------
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  urutan int not null default 0,
  nama_lengkap text not null,
  jabatan text default '',
  no_hp text default '',
  aktif boolean not null default true,
  keterangan text default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_members_urutan on members(urutan);

-- ----------------------------------------------------------------------------
-- 3. PAYMENTS — status iuran per anggota per bulan per tahun
-- ----------------------------------------------------------------------------
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  tahun int not null,
  bulan int not null check (bulan between 1 and 12),
  lunas boolean not null default false,
  jumlah numeric not null default 0,   -- nominal yang berlaku SAAT dicentang (10rb lama / 20rb baru)
  dibayar_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (member_id, tahun, bulan)
);

create index if not exists idx_payments_member on payments(member_id);
create index if not exists idx_payments_tahun_bulan on payments(tahun, bulan);

-- ----------------------------------------------------------------------------
-- 4. EXPENSES — pengeluaran kas
-- ----------------------------------------------------------------------------
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  tahun int not null,
  bulan int not null check (bulan between 1 and 12),
  tanggal date,
  keterangan text not null default '',
  jumlah numeric not null default 0,
  kategori text default 'Lainnya',
  bukti_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_tahun_bulan on expenses(tahun, bulan);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Semua orang (termasuk tanpa login) boleh MELIHAT data (read-only, transparan
-- ke anggota). Hanya user yang login (bendahara/admin) yang boleh
-- tambah/ubah/hapus data.
-- ----------------------------------------------------------------------------
alter table settings enable row level security;
alter table members enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read members" on members;
create policy "public read members" on members for select using (true);
drop policy if exists "admin write members" on members;
create policy "admin write members" on members for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read payments" on payments;
create policy "public read payments" on payments for select using (true);
drop policy if exists "admin write payments" on payments;
create policy "admin write payments" on payments for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read expenses" on expenses;
create policy "public read expenses" on expenses for select using (true);
drop policy if exists "admin write expenses" on expenses;
create policy "admin write expenses" on expenses for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Storage bucket untuk bukti transaksi (foto nota pengeluaran)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('bukti-transaksi', 'bukti-transaksi', true)
  on conflict (id) do nothing;

drop policy if exists "public read bukti" on storage.objects;
create policy "public read bukti" on storage.objects for select
  using (bucket_id = 'bukti-transaksi');
drop policy if exists "admin upload bukti" on storage.objects;
create policy "admin upload bukti" on storage.objects for insert
  with check (bucket_id = 'bukti-transaksi' and auth.role() = 'authenticated');
drop policy if exists "admin delete bukti" on storage.objects;
create policy "admin delete bukti" on storage.objects for delete
  using (bucket_id = 'bukti-transaksi' and auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA — data dari file Excel "UANG KAS RR.xlsx" (56 anggota, tahun 2026)
-- Hapus / lewati bagian ini kalau kamu mau mulai dari data kosong.
-- ============================================================================

update settings set
  nama_rs = 'RS Jantung Jakarta',
  unit = 'Lantai 7',
  nama_bendahara = 'Vanny Andirozse Ahsa',
  tahun_aktif = 2026,
  iuran_rate_lama = 10000,
  iuran_rate_baru = 20000,
  rate_naik_mulai_bulan = 2
where id = 1;

-- Anggota + status bayar Jan..Des (true/false) — urutan kolom sama seperti Excel
with data(urutan, nama, jan, feb, mar, apr, mei, jun, jul, agu, sep, okt, nov, des) as (
  values
  (1,'Ns. Adhy Irawan, S.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (2,'Ns. Andika Oktahari, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (3,'Ns. Antika Nisa, S.Kep',false,true,true,true,true,false,false,false,false,false,false,false),
  (4,'Amelia Nofita',false,true,true,true,true,false,false,false,false,false,false,false),
  (5,'Ns. Anju Xaferius, S.Kep',false,true,true,true,false,false,false,false,false,false,false,false),
  (6,'Ns. Ardi Wijaya, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (7,'Diah Ratna Ambar, A.md. Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (8,'Ns. Dindi Anggara, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (9,'Delfiana Fadila, Amd. Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (10,'Ns. Dewi Purwanti, S.Kep',false,true,true,true,true,true,true,true,true,true,true,true),
  (11,'Ns. Esye Persila, S.Kep',false,true,true,true,true,false,false,false,false,false,false,false),
  (12,'Fadhilah Nur Alifah, A.md.Kep',false,true,true,true,true,true,true,true,true,true,true,false),
  (13,'Ns. Hendra Tri, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (14,'Iin Nur Elviani, S.Tr',false,false,false,false,false,false,false,false,false,false,false,false),
  (15,'Ishma Izzatul, Amd. Kep',false,true,true,true,false,false,false,false,false,false,false,false),
  (16,'Ns. Jihan Faadilah, S.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (17,'Jemi Braniza, Amd.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (18,'Julianti, Amd. Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (19,'Ns. Liliyani Ataupah, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (20,'Ns. Linda Munitasari, S.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (21,'Laili Rachmawati',false,true,true,true,true,true,false,false,false,false,false,false),
  (22,'Laily Ghina',false,false,false,false,false,false,false,false,false,false,false,false),
  (23,'Lora Cindy Selfira, Amd.Kep',false,true,false,false,false,false,false,false,false,false,false,false),
  (24,'Ns. Marlia, S.Kep',false,true,true,true,false,false,false,false,false,false,false,false),
  (25,'Minna Rohmawati, Amd.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (26,'Ns. Miftah Nur Okta, S.Kep',false,true,true,true,true,true,true,false,false,false,false,false),
  (27,'Ns. Mega Unzila, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (28,'Ns. Nadira Nur Malasari, S.Kep',false,true,true,true,true,true,true,true,true,true,true,true),
  (29,'Na''mat Islam Sari, Amd.Kep',false,true,true,true,true,true,true,true,false,false,false,false),
  (30,'Nanda Shoopiyah, Amd.Kep',false,true,true,false,false,false,false,false,false,false,false,false),
  (31,'Nisa Nur Fadila',false,true,false,false,false,false,false,false,false,false,false,false),
  (32,'Nuril Qomariah, Amd.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (33,'Putri Yulianti, Amd.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (34,'Rismawati',false,true,true,true,true,true,true,true,true,true,true,true),
  (35,'Ns. Regina Cahyani, S.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (36,'Siti Aisah, Amd.Kep',false,true,true,true,false,false,false,false,false,false,false,false),
  (37,'Siti Jenna',false,true,false,false,false,false,false,false,false,false,false,false),
  (38,'Ns. Srimpi Pamulatsih, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (39,'Ns. Susi Elmawati, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (40,'Ns. Syifana Az Zahwa, S.Kep',false,true,false,false,false,false,false,false,false,false,false,false),
  (41,'Tereza Putri, Amd.Kep',false,true,true,true,true,true,false,false,false,false,false,false),
  (42,'Ns. Vanny Andirozse Ahsa, S.Kep',false,true,true,true,true,true,true,true,true,false,false,false),
  (43,'Yulia Kartika Sari',false,true,true,true,true,true,true,true,true,true,true,false),
  (44,'Ns. Yulianti Putri Susman, S.Kep',false,true,true,true,true,true,true,true,false,false,false,false),
  (45,'Ns. Zikrullah, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (46,'Nisrina Ambarwati, Amd. Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (47,'Ns. Elma Okta, S.Kep',false,false,false,false,false,false,false,false,false,false,false,false),
  (48,'Ns. Rahmad Jemiarto, S.Kep',false,true,true,true,true,true,true,true,true,true,true,false),
  (49,'Rulanti',false,false,false,false,false,false,false,false,false,false,false,false),
  (50,'Debora',false,false,false,true,false,false,false,false,false,false,false,false),
  (51,'Meifa',false,false,false,false,false,false,false,false,false,false,false,false),
  (52,'Ghina',false,false,false,false,false,false,false,false,false,false,false,false),
  (53,'Wildan',false,false,false,false,false,false,false,false,false,false,false,false),
  (54,'Santi',false,false,false,false,false,false,false,false,false,false,false,false),
  (55,'Mastiti',false,false,false,false,false,false,false,false,false,false,false,false),
  (56,'Yusuf Chandra',false,false,false,false,false,false,false,false,false,false,false,false)
),
inserted_members as (
  insert into members (urutan, nama_lengkap)
  select urutan, nama from data
  returning id, urutan
)
insert into payments (member_id, tahun, bulan, lunas, jumlah)
select im.id, 2026, b.bulan, b.lunas,
  case when b.lunas then 10000 else 0 end
from inserted_members im
join data d on d.urutan = im.urutan
join lateral (values
  (1, d.jan), (2, d.feb), (3, d.mar), (4, d.apr), (5, d.mei), (6, d.jun),
  (7, d.jul), (8, d.agu), (9, d.sep), (10, d.okt), (11, d.nov), (12, d.des)
) as b(bulan, lunas) on true;

-- Pengeluaran (dari tabel pengeluaran di Excel)
insert into expenses (tahun, bulan, keterangan, jumlah, kategori, bukti_url) values
  (2026, 4, 'Uang tazkiah buat ka Noni Penrek', 150000, 'Sosial/Duka', null),
  (2026, 4, 'Uang ka Namat perpisahan ka Lia dan Ishma', 239000, 'Perpisahan', null),
  (2026, 4, 'Reimbes Ardi uang perpisahan Isma', 130000, 'Perpisahan', null),
  (2026, 6, 'Makan perpisahan ka Amel', 99000, 'Perpisahan', null),
  (2026, 8, 'Uang duka ka Risma ICU dan ka Rina HCU Anak', 300000, 'Sosial/Duka', null);

-- Selesai. Lanjut buat admin user lewat Supabase Dashboard > Authentication > Users > Add user.
