"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldBan, AlertTriangle, FileText } from "lucide-react";

const links = [
  { href: "/moderator/reports", label: "Laporan", icon: AlertTriangle },
  { href: "/moderator/posts", label: "Posts", icon: FileText },
  { href: "/moderator/users", label: "Manage User", icon: ShieldBan },
];

export function ModeratorNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="border-b border-border px-4 flex gap-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            isActive(href)
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={15} />
          {label}
        </Link>
      ))}
    </div>
  );
}
