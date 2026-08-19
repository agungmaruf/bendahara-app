"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildMemberWithPayments, rateForNewCheck } from "@/lib/format";
import type { Expense, Member, MemberWithPayments, Payment, Settings } from "@/lib/types";

export function useKasData(tahun: number) {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [s, m, p, e] = await Promise.all([
      supabase.from("settings").select("*").eq("id", 1).single(),
      supabase.from("members").select("*").order("urutan", { ascending: true }),
      supabase.from("payments").select("*").eq("tahun", tahun),
      supabase.from("expenses").select("*").eq("tahun", tahun).order("bulan", { ascending: true }),
    ]);
    if (s.error || m.error || p.error || e.error) {
      setError(s.error?.message || m.error?.message || p.error?.message || e.error?.message || "Gagal memuat data");
    } else {
      setSettings(s.data);
      setMembers(m.data ?? []);
      setPayments(p.data ?? []);
      setExpenses(e.data ?? []);
    }
    setLoading(false);
  }, [supabase, tahun]);

  useEffect(() => {
    load();
  }, [load]);

  const membersWithPayments: MemberWithPayments[] = useMemo(
    () => members.map((m) => buildMemberWithPayments(m, payments, tahun)),
    [members, payments, tahun]
  );

  const totalPemasukan = membersWithPayments.reduce((s, m) => s + m.totalRp, 0);
  const totalPengeluaran = expenses.reduce((s, e) => s + e.jumlah, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  async function togglePayment(member_id: string, bulan: number, next: boolean) {
    if (!settings) return;
    const existing = payments.find((p) => p.member_id === member_id && p.tahun === tahun && p.bulan === bulan);
    const jumlah = next
      ? existing && existing.jumlah > 0
        ? existing.jumlah
        : rateForNewCheck(bulan, settings.iuran_rate_lama, settings.iuran_rate_baru, settings.rate_naik_mulai_bulan)
      : existing?.jumlah ?? 0;

    // optimistic update
    setPayments((prev) => {
      const idx = prev.findIndex((p) => p.member_id === member_id && p.tahun === tahun && p.bulan === bulan);
      const updated: Payment = {
        id: existing?.id ?? `virtual-${member_id}-${bulan}`,
        member_id,
        tahun,
        bulan,
        lunas: next,
        jumlah,
        dibayar_at: next ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      if (idx === -1) return [...prev, updated];
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });

    const { data, error } = await supabase
      .from("payments")
      .upsert(
        {
          member_id,
          tahun,
          bulan,
          lunas: next,
          jumlah,
          dibayar_at: next ? new Date().toISOString() : null,
        },
        { onConflict: "member_id,tahun,bulan" }
      )
      .select()
      .single();

    if (!error && data) {
      setPayments((prev) => {
        const idx = prev.findIndex((p) => p.member_id === member_id && p.tahun === tahun && p.bulan === bulan);
        const copy = [...prev];
        if (idx !== -1) copy[idx] = data;
        return copy;
      });
    }
    return { error };
  }

  async function addMember(input: Partial<Member>) {
    const urutan = members.length ? Math.max(...members.map((m) => m.urutan)) + 1 : 1;
    const { data, error } = await supabase
      .from("members")
      .insert({ ...input, urutan })
      .select()
      .single();
    if (!error && data) setMembers((prev) => [...prev, data]);
    return { data, error };
  }

  async function updateMember(id: string, input: Partial<Member>) {
    const { data, error } = await supabase.from("members").update(input).eq("id", id).select().single();
    if (!error && data) setMembers((prev) => prev.map((m) => (m.id === id ? data : m)));
    return { data, error };
  }

  async function deleteMember(id: string) {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setPayments((prev) => prev.filter((p) => p.member_id !== id));
    }
    return { error };
  }

  async function addExpense(input: Partial<Expense>) {
    const { data, error } = await supabase.from("expenses").insert(input).select().single();
    if (!error && data) setExpenses((prev) => [...prev, data].sort((a, b) => a.bulan - b.bulan));
    return { data, error };
  }

  async function updateExpense(id: string, input: Partial<Expense>) {
    const { data, error } = await supabase.from("expenses").update(input).eq("id", id).select().single();
    if (!error && data) setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)));
    return { data, error };
  }

  async function deleteExpense(id: string) {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) setExpenses((prev) => prev.filter((e) => e.id !== id));
    return { error };
  }

  async function updateSettings(input: Partial<Settings>) {
    const { data, error } = await supabase.from("settings").update(input).eq("id", 1).select().single();
    if (!error && data) setSettings(data);
    return { data, error };
  }

  return {
    settings,
    members: membersWithPayments,
    expenses,
    loading,
    error,
    totalPemasukan,
    totalPengeluaran,
    saldo,
    reload: load,
    togglePayment,
    addMember,
    updateMember,
    deleteMember,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings,
  };
}
