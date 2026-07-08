"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatCurrency, STATUS_LABEL, STATUS_COLOR } from "@/lib/utils";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setResults(await res.json());
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const total =
    (results?.sekolah?.length || 0) +
    (results?.vendor?.length || 0) +
    (results?.menu?.length || 0) +
    (results?.distribusi?.length || 0);

  return (
    <div>
      <div className="relative max-w-xl mb-6">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          className="input pl-10 py-3 text-base"
          placeholder="Cari sekolah, vendor, menu, atau distribusi..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </div>

      {!q.trim() && (
        <p className="text-slate-400 text-sm">
          Ketik kata kunci untuk mencari di seluruh data — sekolah, vendor, menu, dan distribusi.
        </p>
      )}

      {loading && <p className="text-slate-400 text-sm">Mencari...</p>}

      {results && !loading && (
        <div className="space-y-6">
          <p className="text-sm text-slate-500">{total} hasil ditemukan untuk &ldquo;{q}&rdquo;</p>

          {results.sekolah?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Sekolah ({results.sekolah.length})</h3>
              <div className="card divide-y divide-slate-100">
                {results.sekolah.map((s: any) => (
                  <Link key={s.id} href="/sekolah" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">{s.nama}</p>
                      <p className="text-xs text-slate-400">NPSN {s.npsn} • {s.jenjang} • {s.alamat}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.vendor?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Vendor ({results.vendor.length})</h3>
              <div className="card divide-y divide-slate-100">
                {results.vendor.map((v: any) => (
                  <Link key={v.id} href="/vendor" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">{v.nama}</p>
                      <p className="text-xs text-slate-400">{v.kontak} • {v.alamat}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.menu?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Menu ({results.menu.length})</h3>
              <div className="card divide-y divide-slate-100">
                {results.menu.map((m: any) => (
                  <Link key={m.id} href="/menu" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">{m.nama}</p>
                      <p className="text-xs text-slate-400">{m.kalori} kkal • {formatCurrency(m.harga)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.distribusi?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Distribusi ({results.distribusi.length})</h3>
              <div className="card divide-y divide-slate-100">
                {results.distribusi.map((d: any) => (
                  <Link key={d.id} href="/riwayat" className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">
                        {d.sekolah?.nama} — {d.menu?.nama}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(d.tanggal)} • {d.vendor?.nama}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_COLOR[d.status]}`}>
                      {STATUS_LABEL[d.status]}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {total === 0 && <p className="text-slate-400 text-sm">Tidak ada hasil ditemukan.</p>}
        </div>
      )}
    </div>
  );
}
