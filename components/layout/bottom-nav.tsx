"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Search, Bookmark, User, LogIn } from "lucide-react";
import { getToken } from "@/hooks/use-auth";

const publicLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Jelajahi", icon: Search },
];

const authLinks = [
  { href: "/bookmarks", label: "Simpan", icon: Bookmark },
  { href: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const links = isAuth
    ? [...publicLinks, ...authLinks]
    : [...publicLinks, { href: "/login", label: "Masuk", icon: LogIn }];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sidebar border-t border-sidebar-border h-16 flex items-center">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
            isActive(href) ? "text-brand" : "text-muted-foreground"
          }`}
        >
          <Icon size={22} />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
