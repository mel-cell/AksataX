"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Beranda",
  "/search": "Jelajahi",
  "/notifications": "Notifikasi",
  "/bookmarks": "Simpan",
  "/profile": "Profil",
  "/settings": "Pengaturan",
  "/posts/create": "Buat Postingan",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle = pageTitles[pathname] ?? "AksataX";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-56 right-0 z-50 h-14 bg-[#0d1117] flex items-center px-6 gap-4">
      <h1 className="text-lg font-bold text-[#f9fafb] whitespace-nowrap">{pageTitle}</h1>

      <div className="flex-1" />

      <form onSubmit={handleSearchSubmit} className="hidden md:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari sesuatu..."
            className="w-64 bg-[#111827] border border-[#1f2937] rounded-full py-2 pl-9 pr-4 text-sm text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#22c55e] transition-colors"
          />
        </div>
      </form>

      <UserDropdown />
    </header>
  );
}
