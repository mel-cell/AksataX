import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import BottomNav from "@/components/layout/bottom-nav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AksataX",
  description: "AksataX App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="min-h-screen bg-[#0d1117] text-[#f9fafb]">
        <Navbar />

        <div className="flex pt-14">
          <Sidebar />

          <main className="flex-1 ml-0 md:ml-56 pb-16 md:pb-0 min-h-[calc(100vh-56px)]">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        <BottomNav />
      </body>
    </html>
  );
}