import Link from "next/link";

export function ModeratorNav() {
  return (
    <div className="border-b px-4 py-2 flex gap-4 text-sm">
      <Link href="/id/moderator/users">Users</Link>
      <Link href="/id/moderator/reports">Reports</Link>
    </div>
  );
}
