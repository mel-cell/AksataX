"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useState } from "react";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-6 gap-4">
      {/* Kiri */}
      <div className="flex items-center gap-6 w-[220px]">
        <Link href="/">
          <h1 className="text-2xl font-medium tracking-tight">
            Aksata<span className="text-[#78716C]">X</span>
          </h1>
        </Link>
        <Link href="/about" className="text-sm">About</Link>
        <Link href="/faq" className="text-sm">FAQ</Link>
      </div>

      {/* Tengah — Search */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sesuatu..."
              className="w-80 bg-sidebar-accent border border-sidebar-border rounded-full py-2 pl-9 pr-4 text-sm text-sidebar-foreground placeholder-sidebar-foreground/50 focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-2 w-[220px] justify-end">
        <Link
          href="/notifications"
          className="p-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <Bell size={18} />
        </Link>
        <UserDropdown />
      </div>
    </header>
  );
}