"use client";

import Link from "next/link";
import { User, Bookmark, Settings, LogOut } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const dummyUser = {
  name: "Muhammad King Nasir",
  username: "@kingnasir17",
};

const menuItems = [
  { href: "/profile", label: "Profil", icon: User },
  { href: "/bookmarks", label: "Bookmark", icon: Bookmark },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function UserDropdown() {
  const initials = dummyUser.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand text-xs font-bold cursor-pointer focus:outline-none"
          aria-label="User menu"
        >
          {initials}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-[100] min-w-[200px] bg-sidebar border border-sidebar-border rounded-xl shadow-xl py-1.5"
        >
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{dummyUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{dummyUser.username}</p>
          </div>

          <div className="py-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <DropdownMenu.Item key={href} asChild>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer outline-none"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="my-1 border-t border-sidebar-border" />

          <DropdownMenu.Item asChild>
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-sidebar-accent transition-colors cursor-pointer outline-none"
              onClick={() => console.log("Logout")}
            >
              <LogOut size={16} />
              Keluar
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
