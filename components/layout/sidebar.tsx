"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, Bell, Bookmark, User,
  TrendingUp, Hash, Users, Settings, LogOut, Plus, LogIn, Info, HelpCircle,
} from "lucide-react";

const mainNavLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Jelajahi", icon: Search },
  { href: "/notifications", label: "Notifikasi", icon: Bell },
  { href: "/bookmarks", label: "Simpan", icon: Bookmark },
  { href: "/profile", label: "Profil", icon: User },
];

const secondaryNavLinks = [
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/topics", label: "Topik", icon: Hash },
];

const bottomNavLinks = [
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] w-56 bg-sidebar border-r border-sidebar-border py-3 overflow-y-auto z-40">

      <div className="px-3 my-3">
        <Link
          href="/posts/create"
          className="flex items-center justify-center gap-2 w-full py-2 border border-sidebar-border bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground font-medium text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          Buat Postingan
        </Link>
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E7E5E4]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-[#A8A29E]">Navigation</span>
        </div>
      </div>
      
      <nav className="flex flex-col gap-0.5 px-2">
        {mainNavLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>


      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E7E5E4]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-[#A8A29E]">Recomendation</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 mt-2">
        {secondaryNavLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />
      <div className="border-t border-sidebar-border mx-3 mb-2" />

      <nav className="flex flex-col gap-0.5 px-2">
        {bottomNavLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
        <button
          onClick={() => console.log("Logout")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-sidebar-accent transition-colors w-full text-left"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </nav>
    </aside>
  );
}
