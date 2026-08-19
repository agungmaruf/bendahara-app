"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileDown,
  BellRing,
  Settings as SettingsIcon,
  LogOut,
  Activity,
  Globe2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/anggota", label: "Data & Iuran Anggota", icon: Users },
  { href: "/admin/pengeluaran", label: "Pengeluaran", icon: Receipt },
  { href: "/admin/laporan", label: "Laporan & Export", icon: FileDown },
  { href: "/admin/pengingat", label: "Pengingat Bayar", icon: BellRing },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-[color:var(--line)] bg-[color:var(--paper-raised)] flex flex-col">
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-[color:var(--line)]">
        <div className="w-9 h-9 rounded-lg bg-[color:var(--teal)] flex items-center justify-center text-white">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm leading-tight text-[color:var(--ink)]">
            Kas JHC
          </p>
          <p className="text-[11px] text-[color:var(--ink-soft)]">Panel Bendahara</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[color:var(--teal)] text-white"
                  : "text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[color:var(--line)] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)] hover:text-[color:var(--teal)] transition-colors"
        >
          <Globe2 className="w-4 h-4" />
          Lihat halaman publik
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[color:var(--coral)] hover:bg-[color:var(--coral-tint)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
