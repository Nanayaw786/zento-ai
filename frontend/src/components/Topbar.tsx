"use client";

import { useAuth } from "@/lib/auth-context";

export default function Topbar() {
  const { businessName, logout } = useAuth();

  const initial = businessName ? businessName.charAt(0).toUpperCase() : "?";

  return (
    <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-6">
      <h1 className="text-sm font-medium text-zento-navy">Overview</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-black/60">{businessName}</span>
        <div className="w-8 h-8 rounded-full bg-zento-gold flex items-center justify-center text-xs font-medium text-zento-gold-dark">
          {initial}
        </div>
        <button
          onClick={logout}
          className="text-xs text-black/40 hover:text-black/70 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}