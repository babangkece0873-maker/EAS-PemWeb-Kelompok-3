export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value
  );
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export const STATUS_LABEL: Record<string, string> = {
  TERJADWAL: "Terjadwal",
  DIPROSES: "Diproses",
  DIKIRIM: "Dikirim",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

export const STATUS_COLOR: Record<string, string> = {
  TERJADWAL: "bg-slate-100 text-slate-700 ring-slate-600/20",
  DIPROSES: "bg-amber-100 text-amber-700 ring-amber-600/20",
  DIKIRIM: "bg-blue-100 text-blue-700 ring-blue-600/20",
  SELESAI: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  DIBATALKAN: "bg-rose-100 text-rose-700 ring-rose-600/20",
};
