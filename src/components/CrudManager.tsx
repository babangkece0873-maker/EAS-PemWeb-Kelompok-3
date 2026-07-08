"use client";

import { useEffect, useState, useCallback } from "react";
import Modal from "./Modal";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2;
};

export type ColumnConfig = {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
};

export default function CrudManager({
  apiEndpoint,
  columns,
  fields,
  searchPlaceholder = "Cari...",
  entityLabel = "Data",
  emptyDefaults = {},
}: {
  apiEndpoint: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  searchPlaceholder?: string;
  entityLabel?: string;
  emptyDefaults?: Record<string, any>;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>(emptyDefaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const url = query ? `${apiEndpoint}?q=${encodeURIComponent(query)}` : apiEndpoint;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setRows(data);
    }
    setLoading(false);
  }, [apiEndpoint, query]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyDefaults);
    setError("");
    setModalOpen(true);
  }

  function openEdit(row: any) {
    setEditing(row);
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      let val = row[f.name];
      if (f.type === "date" && val) {
        val = new Date(val).toISOString().slice(0, 10);
      }
      initial[f.name] = val ?? "";
    });
    setForm(initial);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${apiEndpoint}/${editing.id}` : apiEndpoint;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan data");
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiEndpoint}/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus data");
      }
      setDeleteTarget(null);
      await load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <svg
            width="18"
            height="18"
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
            className="input pl-9"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button onClick={openCreate} className="btn-primary whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Tambah {entityLabel}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 text-slate-700 ${c.className || ""}`}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-brand-600 hover:text-brand-800 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(row)}
                        className="text-rose-600 hover:text-rose-800 font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            Menampilkan {rows.length} data
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${entityLabel}` : `Tambah ${entityLabel}`}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                <label className="label">
                  {f.label}
                  {f.required && <span className="text-rose-500"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    className="input"
                    rows={3}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                ) : f.type === "select" ? (
                  <select
                    className="input"
                    required={f.required}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  >
                    <option value="" disabled>
                      Pilih {f.label}
                    </option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-6">
          Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">
            Batal
          </button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger">
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
