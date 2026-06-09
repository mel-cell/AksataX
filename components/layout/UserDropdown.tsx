"use client";

import Link from "next/link";
import { User, Bookmark, Settings, LogOut } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const dummyUser = {
  name: "Muhammad King Nasir",
  username: "@kingnasir17",
};

const menuItems = [
  { href: "/id/profile", label: "Profil", icon: User },
  { href: "/id/bookmarks", label: "Bookmark", icon: Bookmark },
  { href: "/id/settings", label: "Pengaturan", icon: Settings },
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
          className="w-8 h-8 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e] text-xs font-bold cursor-pointer focus:outline-none"
          aria-label="User menu"
        >
          {initials}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-[100] min-w-[200px] bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl py-1.5"
        >
          <div className="px-4 py-3 border-b border-[#1f2937]">
            <p className="text-sm font-semibold text-[#f9fafb] truncate">{dummyUser.name}</p>
            <p className="text-xs text-[#6b7280] truncate">{dummyUser.username}</p>
          </div>

          <div className="py-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <DropdownMenu.Item key={href} asChild>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-colors cursor-pointer outline-none"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="my-1 border-t border-[#1f2937]" />

          <DropdownMenu.Item asChild>
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[#1f2937] transition-colors cursor-pointer outline-none"
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