import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MONTHS_SHORT_ID } from "./constants";
import { formatRupiah } from "./format";
import type { Expense, MemberWithPayments, Settings } from "./types";

export function exportExcel(
  members: MemberWithPayments[],
  expenses: Expense[],
  settings: Settings
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Iuran anggota
  const header = ["No", "Nama", ...MONTHS_SHORT_ID, "Total Centang", "Total Rp"];
  const rows = members.map((m, i) => [
    i + 1,
    m.nama_lengkap,
    ...m.payments.map((p) => (p.lunas ? "✓" : "")),
    m.totalCentang,
    m.totalRp,
  ]);
  const ws1 = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws1["!cols"] = [{ wch: 4 }, { wch: 32 }, ...MONTHS_SHORT_ID.map(() => ({ wch: 6 })), { wch: 12 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Iuran Anggota");

  // Sheet 2: Pengeluaran
  const expHeader = ["Tanggal", "Bulan", "Keterangan", "Kategori", "Jumlah"];
  const expRows = expenses.map((e) => [
    e.tanggal ?? "-",
    MONTHS_SHORT_ID[e.bulan - 1],
    e.keterangan,
    e.kategori,
    e.jumlah,
  ]);
  const totalExpense = expenses.reduce((s, e) => s + e.jumlah, 0);
  const ws2 = XLSX.utils.aoa_to_sheet([
    expHeader,
    ...expRows,
    [],
    ["", "", "", "TOTAL", totalExpense],
  ]);
  ws2["!cols"] = [{ wch: 12 }, { wch: 8 }, { wch: 40 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Pengeluaran");

  // Sheet 3: Ringkasan
  const totalPemasukan = members.reduce((s, m) => s + m.totalRp, 0);
  const saldo = totalPemasukan - totalExpense;
  const ws3 = XLSX.utils.aoa_to_sheet([
    ["Ringkasan Kas", `${settings.unit} — ${settings.nama_rs}`],
    ["Tahun", settings.tahun_aktif],
    [],
    ["Total Pemasukan (Iuran)", totalPemasukan],
    ["Total Pengeluaran", totalExpense],
    ["Saldo Kas", saldo],
    [],
    ["Jumlah Anggota", members.length],
    ["Anggota Lunas 11-12 Bulan", members.filter((m) => m.totalCentang >= 11).length],
    ["Anggota Belum Bayar Sama Sekali", members.filter((m) => m.totalCentang === 0).length],
  ]);
  ws3["!cols"] = [{ wch: 28 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Ringkasan");

  XLSX.writeFile(wb, `Kas-${settings.unit.replace(/\s+/g, "")}-${settings.tahun_aktif}.xlsx`);
}

export function exportPDF(
  members: MemberWithPayments[],
  expenses: Expense[],
  settings: Settings
) {
  const doc = new jsPDF({ orientation: "landscape" });
  const totalPemasukan = members.reduce((s, m) => s + m.totalRp, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.jumlah, 0);
  const saldo = totalPemasukan - totalExpense;

  doc.setFontSize(14);
  doc.text(`Laporan Kas — ${settings.unit}, ${settings.nama_rs}`, 14, 14);
  doc.setFontSize(10);
  doc.text(`Tahun ${settings.tahun_aktif}`, 14, 20);
  doc.text(
    `Pemasukan: ${formatRupiah(totalPemasukan)}   |   Pengeluaran: ${formatRupiah(
      totalExpense
    )}   |   Saldo: ${formatRupiah(saldo)}`,
    14,
    26
  );

  autoTable(doc, {
    startY: 32,
    head: [["No", "Nama", ...MONTHS_SHORT_ID, "Total", "Nominal"]],
    body: members.map((m, i) => [
      i + 1,
      m.nama_lengkap,
      ...m.payments.map((p) => (p.lunas ? "V" : "-")),
      m.totalCentang,
      formatRupiah(m.totalRp),
    ]),
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [15, 102, 89] },
    columnStyles: { 1: { cellWidth: 38 } },
  });

  const afterMembersY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  doc.addPage();
  doc.setFontSize(12);
  doc.text("Rincian Pengeluaran", 14, 14);
  autoTable(doc, {
    startY: 20,
    head: [["Tanggal", "Bulan", "Keterangan", "Kategori", "Jumlah"]],
    body: expenses.map((e) => [
      e.tanggal ?? "-",
      MONTHS_SHORT_ID[e.bulan - 1],
      e.keterangan,
      e.kategori,
      formatRupiah(e.jumlah),
    ]),
    foot: [["", "", "", "TOTAL", formatRupiah(totalExpense)]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 102, 89] },
  });

  void afterMembersY;
  doc.save(`Kas-${settings.unit.replace(/\s+/g, "")}-${settings.tahun_aktif}.pdf`);
}
