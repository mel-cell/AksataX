"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User } from "lucide-react";

const bottomNavLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Jelajahi", icon: Search },
  { href: "/bookmarks", label: "Simpan", icon: Bookmark },
  { href: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#111827] border-t border-[#1f2937] h-16 flex items-center">
      {bottomNavLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
            isActive(href) ? "text-[#22c55e]" : "text-[#6b7280]"
          }`}
        >
          <Icon size={22} />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
