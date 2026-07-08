"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDate, formatNumber, STATUS_LABEL, STATUS_COLOR } from "@/lib/utils";

export default function RiwayatPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sekolahOptions, setSekolahOptions] = useState<any[]>([]);
  const [vendorOptions, setVendorOptions] = useState<any[]>([]);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [sekolahId, setSekolahId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    async function loadFilters() {
      const [sRes, vRes] = await Promise.all([fetch("/api/sekolah"), fetch("/api/vendor")]);
      setSekolahOptions(await sRes.json());
      setVendorOptions(await vRes.json());
    }
    loadFilters();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (sekolahId) params.set("sekolahId", sekolahId);
    if (vendorId) params.set("vendorId", vendorId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/distribusi?${params.toString()}`);
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, [q, status, sekolahId, vendorId, from, to]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const totalPorsi = rows.reduce((sum, r) => sum + (r.jumlahPorsi || 0), 0);

  function resetFilters() {
    setQ("");
    setStatus("");
    setSekolahId("");
    setVendorId("");
    setFrom("");
    setTo("");
  }

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="col-span-2 lg:col-span-2">
            <label className="label">Cari</label>
            <input
              className="input"
              placeholder="Sekolah / vendor / menu"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Semua</option>
              {Object.entries(STATUS_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Sekolah</label>
            <select className="input" value={sekolahId} onChange={(e) => setSekolahId(e.target.value)}>
              <option value="">Semua</option>
              {sekolahOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Vendor</label>
            <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
              <option value="">Semua</option>
              {vendorOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label">Dari</label>
              <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="label">Sampai</label>
              <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-slate-400">
            {rows.length} riwayat • total {formatNumber(totalPorsi)} porsi
          </p>
          <button onClick={resetFilters} className="text-xs text-brand-600 font-medium hover:underline">
            Reset filter
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Sekolah</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Menu</th>
                <th className="px-4 py-3 font-medium">Porsi</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada riwayat distribusi.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.tanggal)}</td>
                    <td className="px-4 py-3">{r.sekolah?.nama}</td>
                    <td className="px-4 py-3">{r.vendor?.nama}</td>
                    <td className="px-4 py-3">{r.menu?.nama}</td>
                    <td className="px-4 py-3">{formatNumber(r.jumlahPorsi)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_COLOR[r.status]}`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{r.catatan || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
