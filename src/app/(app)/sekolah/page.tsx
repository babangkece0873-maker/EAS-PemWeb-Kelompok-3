"use client";

import CrudManager from "@/components/CrudManager";

const JENJANG_OPTIONS = [
  { value: "SD", label: "SD" },
  { value: "SMP", label: "SMP" },
  { value: "SMA", label: "SMA" },
];

export default function SekolahPage() {
  return (
    <CrudManager
      apiEndpoint="/api/sekolah"
      entityLabel="Sekolah"
      searchPlaceholder="Cari nama sekolah / NPSN..."
      emptyDefaults={{ nama: "", npsn: "", alamat: "", jenjang: "SD", jumlahSiswa: "", kontak: "" }}
      columns={[
        { key: "nama", label: "Nama Sekolah" },
        { key: "npsn", label: "NPSN" },
        { key: "jenjang", label: "Jenjang" },
        {
          key: "jumlahSiswa",
          label: "Jumlah Siswa",
          render: (r) => new Intl.NumberFormat("id-ID").format(r.jumlahSiswa),
        },
        { key: "alamat", label: "Alamat", className: "max-w-xs truncate" },
      ]}
      fields={[
        { name: "nama", label: "Nama Sekolah", type: "text", required: true, colSpan: 2 },
        { name: "npsn", label: "NPSN", type: "text", required: true },
        { name: "jenjang", label: "Jenjang", type: "select", required: true, options: JENJANG_OPTIONS },
        { name: "jumlahSiswa", label: "Jumlah Siswa", type: "number", required: true },
        { name: "kontak", label: "Kontak", type: "text" },
        { name: "alamat", label: "Alamat", type: "textarea", required: true, colSpan: 2 },
      ]}
    />
  );
}
