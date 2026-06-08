import Link from "next/link";

const links = [
  { href: "/id", label: "Beranda" },
  { href: "/id/posts", label: "Postingan" },
  { href: "/id/search", label: "Cari" },
  { href: "/id/bookmarks", label: "Bookmark" },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r hidden lg:block p-4 space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block px-3 py-2 rounded-md hover:bg-muted text-sm"
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
