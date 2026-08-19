"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[color:var(--paper-raised)] border-b border-[color:var(--line)] flex items-center justify-between px-4">
        <span className="font-display font-semibold text-sm">Kas Lantai — Admin</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="p-2 rounded-lg text-[color:var(--teal)] hover:bg-[color:var(--teal-tint)]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[color:var(--paper-raised)] shadow-xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-3 z-10 p-1.5 rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--teal-tint)]"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
