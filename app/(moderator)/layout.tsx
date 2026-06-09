import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ModeratorNav } from "@/components/layout/moderator-nav";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <div className="flex flex-1 flex-col ml-0 md:ml-56">
          <ModeratorNav />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
