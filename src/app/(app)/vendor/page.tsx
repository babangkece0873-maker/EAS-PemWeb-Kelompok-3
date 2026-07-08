"use client";

import CrudManager from "@/components/CrudManager";

export default function VendorPage() {
  return (
    <CrudManager
      apiEndpoint="/api/vendor"
      entityLabel="Vendor"
      searchPlaceholder="Cari nama vendor..."
      emptyDefaults={{ nama: "", alamat: "", kontak: "", email: "" }}
      columns={[
        { key: "nama", label: "Nama Vendor" },
        { key: "kontak", label: "Kontak" },
        { key: "email", label: "Email" },
        { key: "alamat", label: "Alamat", className: "max-w-xs truncate" },
      ]}
      fields={[
        { name: "nama", label: "Nama Vendor", type: "text", required: true, colSpan: 2 },
        { name: "kontak", label: "Kontak", type: "text", required: true },
        { name: "email", label: "Email", type: "text" },
        { name: "alamat", label: "Alamat", type: "textarea", required: true, colSpan: 2 },
      ]}
    />
  );
}
