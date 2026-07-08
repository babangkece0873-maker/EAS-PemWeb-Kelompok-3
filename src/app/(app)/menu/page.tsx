"use client";

import CrudManager from "@/components/CrudManager";
import { formatCurrency } from "@/lib/utils";

export default function MenuPage() {
  return (
    <CrudManager
      apiEndpoint="/api/menu"
      entityLabel="Menu"
      searchPlaceholder="Cari nama menu..."
      emptyDefaults={{ nama: "", deskripsi: "", kalori: "", harga: "" }}
      columns={[
        { key: "nama", label: "Nama Menu" },
        { key: "deskripsi", label: "Deskripsi", className: "max-w-xs truncate" },
        { key: "kalori", label: "Kalori", render: (r) => `${r.kalori} kkal` },
        { key: "harga", label: "Harga per Porsi", render: (r) => formatCurrency(r.harga) },
      ]}
      fields={[
        { name: "nama", label: "Nama Menu", type: "text", required: true, colSpan: 2 },
        { name: "kalori", label: "Kalori (kkal)", type: "number", required: true },
        { name: "harga", label: "Harga per Porsi (Rp)", type: "number", required: true },
        { name: "deskripsi", label: "Deskripsi", type: "textarea", colSpan: 2 },
      ]}
    />
  );
}
