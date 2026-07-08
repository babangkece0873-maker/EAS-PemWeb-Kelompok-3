"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sekolah": "Data Sekolah",
  "/vendor": "Data Vendor",
  "/menu": "Data Menu",
  "/distribusi": "Distribusi",
  "/riwayat": "Riwayat Distribusi",
  "/search": "Pencarian",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const title = TITLES[pathname] || "MBG Distribution";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
