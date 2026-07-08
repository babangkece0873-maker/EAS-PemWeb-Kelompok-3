"use client";

import { useEffect, useState } from "react";
import CrudManager, { ColumnConfig, FieldConfig } from "@/components/CrudManager";
import { formatDate, STATUS_LABEL, STATUS_COLOR } from "@/lib/utils";

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));

export default function DistribusiPage() {
  const [loading, setLoading] = useState(true);
  const [sekolahOptions, setSekolahOptions] = useState<{ value: string; label: string }[]>([]);
  const [vendorOptions, setVendorOptions] = useState<{ value: string; label: string }[]>([]);
  const [menuOptions, setMenuOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function load() {
      const [sRes, vRes, mRes] = await Promise.all([
        fetch("/api/sekolah"),
        fetch("/api/vendor"),
        fetch("/api/menu"),
      ]);
      const [s, v, m] = await Promise.all([sRes.json(), vRes.json(), mRes.json()]);
      setSekolahOptions(s.map((x: any) => ({ value: x.id, label: x.nama })));
      setVendorOptions(v.map((x: any) => ({ value: x.id, label: x.nama })));
      setMenuOptions(m.map((x: any) => ({ value: x.id, label: x.nama })));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm py-12 text-center">Memuat data...</div>;
  }

  const columns: ColumnConfig[] = [
    { key: "tanggal", label: "Tanggal", render: (r) => formatDate(r.tanggal) },
    { key: "sekolah", label: "Sekolah", render: (r) => r.sekolah?.nama },
    { key: "vendor", label: "Vendor", render: (r) => r.vendor?.nama },
    { key: "menu", label: "Menu", render: (r) => r.menu?.nama },
    { key: "jumlahPorsi", label: "Porsi", render: (r) => new Intl.NumberFormat("id-ID").format(r.jumlahPorsi) },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_COLOR[r.status]}`}>
          {STATUS_LABEL[r.status]}
        </span>
      ),
    },
  ];

  const fields: FieldConfig[] = [
    { name: "tanggal", label: "Tanggal Distribusi", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
    { name: "sekolahId", label: "Sekolah Tujuan", type: "select", required: true, options: sekolahOptions, colSpan: 2 },
    { name: "vendorId", label: "Vendor Penyedia", type: "select", required: true, options: vendorOptions },
    { name: "menuId", label: "Menu", type: "select", required: true, options: menuOptions },
    { name: "jumlahPorsi", label: "Jumlah Porsi", type: "number", required: true },
    { name: "catatan", label: "Catatan", type: "textarea", colSpan: 2 },
  ];

  return (
    <CrudManager
      apiEndpoint="/api/distribusi"
      entityLabel="Distribusi"
      searchPlaceholder="Cari sekolah / vendor / menu..."
      emptyDefaults={{
        tanggal: new Date().toISOString().slice(0, 10),
        status: "TERJADWAL",
        sekolahId: "",
        vendorId: "",
        menuId: "",
        jumlahPorsi: "",
        catatan: "",
      }}
      columns={columns}
      fields={fields}
    />
  );
}
