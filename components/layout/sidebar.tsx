"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, Bell, Mail, Bookmark, User,
  TrendingUp, Hash, Users, Settings, LogOut, Plus,
} from "lucide-react";

const mainNavLinks = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/jelajahi", label: "Jelajahi", icon: Search },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell, badge: 11 },
  { href: "/pesan", label: "Pesan", icon: Mail },
  { href: "/simpan", label: "Simpan", icon: Bookmark },
  { href: "/profil", label: "Profil", icon: User },
];

const secondaryNavLinks = [
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/topik", label: "Topik", icon: Hash },
  { href: "/orang", label: "Orang", icon: Users },
];

const bottomNavLinks = [
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/keluar", label: "Keluar", icon: LogOut },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/beranda" ? pathname === "/beranda" : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-56 bg-[#0d1117] border-r border-[#1f2937] py-3 overflow-y-auto">

      {/* Logo */}
      <Link href="/beranda" className="flex items-center gap-2 px-5 py-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center">
          <span className="text-[#0d1117] font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-lg text-[#f9fafb]">AksataX</span>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {mainNavLinks.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-[#22c55e] text-[#0d1117]"
                : "text-[#d1d5db] hover:bg-[#1f2937] hover:text-[#f9fafb]"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
            {badge && (
              <span className={`ml-auto text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 ${
                isActive(href)
                  ? "bg-[#0d1117] text-[#22c55e]"
                  : "bg-[#22c55e] text-[#0d1117]"
              }`}>
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Buat Postingan */}
      <div className="px-3 my-4">
        <Link
          href="/buat"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-[#0d1117] font-semibold text-sm rounded-full transition-colors"
        >
          <Plus size={18} />
          Buat Postingan
        </Link>
      </div>

      <div className="border-t border-[#1f2937] mx-3" />

      {/* Secondary nav */}
      <nav className="flex flex-col gap-0.5 px-2 mt-2">
        {secondaryNavLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-[#22c55e] text-[#0d1117]"
                : "text-[#d1d5db] hover:bg-[#1f2937] hover:text-[#f9fafb]"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />
      <div className="border-t border-[#1f2937] mx-3 mb-2" />

      {/* Bottom nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {bottomNavLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#d1d5db] hover:bg-[#1f2937] hover:text-[#f9fafb] transition-colors"
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}