import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ModeratorNav } from "@/components/layout/moderator-nav";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <ModeratorNav />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
