"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Topbar({ title }: { title: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 sticky top-0 z-20">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
        >
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-semibold">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-700 leading-tight">{session?.user?.name}</p>
            <p className="text-xs text-slate-400 leading-tight capitalize">
              {(session?.user as any)?.role?.toLowerCase()}
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-100 shadow-lg z-20 py-1">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
