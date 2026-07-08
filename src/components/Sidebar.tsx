"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/sekolah", label: "Data Sekolah", icon: "school" },
  { href: "/vendor", label: "Data Vendor", icon: "truck" },
  { href: "/menu", label: "Data Menu", icon: "menu" },
  { href: "/distribusi", label: "Distribusi", icon: "box" },
  { href: "/riwayat", label: "Riwayat Distribusi", icon: "history" },
  { href: "/search", label: "Pencarian", icon: "search" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  switch (name) {
    case "grid":
      return (
        <svg {...common} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      );
    case "school":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5"/></svg>
      );
    case "truck":
      return (
        <svg {...common} viewBox="0 0 24 24"><rect x="1.5" y="7" width="12" height="9" rx="1"/><path d="M13.5 10h4l3 3v3h-7v-6z"/><circle cx="6" cy="18" r="1.7"/><circle cx="16.5" cy="18" r="1.7"/></svg>
      );
    case "menu":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M6 3v18M6 3c-1.5 0-2.5 1-2.5 3s1 3 2.5 3M6 9V3"/><path d="M18 3v18M18 3a2.5 2.5 0 00-2.5 2.5V11a2.5 2.5 0 002.5 2.5"/></svg>
      );
    case "box":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>
      );
    case "history":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.7L3 9"/><path d="M3 4v5h5"/><path d="M12 7v5l3 3"/></svg>
      );
    case "search":
      return (
        <svg {...common} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-slate-800">MBG Distribution</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 lg:z-0 h-screen w-64 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">MBG Distribution</p>
            <p className="text-xs text-slate-400 leading-tight">Management System</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon name={item.icon} className={`w-5 h-5 ${active ? "text-brand-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100 text-xs text-slate-400">
          UAS Pemrograman Web &copy; {new Date().getFullYear()}
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
