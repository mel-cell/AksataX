import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">
        AksataX
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/id/posts/create" className="text-sm">
          Buat Post
        </Link>
      </div>
    </nav>
  );
}
