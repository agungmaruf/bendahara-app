import { AdminShell } from "@/components/AdminShell";

// Halaman admin butuh login & data live dari Supabase, jadi tidak masuk akal
// di-prerender secara statis saat build. force-dynamic memastikan semua route
// di bawah /admin baru dirender saat ada request, saat env var Supabase pasti
// sudah tersedia di runtime.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
