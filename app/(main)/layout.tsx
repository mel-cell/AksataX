import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import BottomNav from "@/components/layout/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-56 pb-16 md:pb-0 min-h-[calc(100vh-56px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
