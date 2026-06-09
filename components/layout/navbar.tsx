"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/beranda": "Beranda",
  "/jelajahi": "Jelajahi",
  "/notifikasi": "Notifikasi",
  "/pesan": "Pesan",
  "/simpan": "Simpan",
  "/profil": "Profil",
  "/trending": "Trending",
  "/topik": "Topik",
  "/orang": "Orang",
  "/pengaturan": "Pengaturan",
  "/buat": "Buat Postingan",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle = pageTitles[pathname] ?? "Beranda";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-56 right-0 z-50 h-14 bg-[#0d1117] flex items-center px-6">
      {/* Judul halaman */}
      <h1 className="text-lg font-bold text-[#f9fafb]">{pageTitle}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar pojok kanan */}
      <form onSubmit={handleSearchSubmit}>
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
    </header>
  );
}