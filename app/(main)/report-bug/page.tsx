"use client";

import { TriangleAlert, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ReportBugPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-foreground">Laporkan Masalah</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Temui bug atau kendala? Sampaikan ke tim kami
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <TriangleAlert size={24} className="text-rose-500" />
        </div>
        <h2 className="text-base font-semibold text-foreground mb-2">Segera Hadir</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-5">
          Halaman laporan bug sedang dalam pengembangan. 
          Sementara itu, hubungi kami melalui email di bawah ini.
        </p>
        <a
          href="mailto:support@aksatax.id"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-foreground text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <Mail size={16} />
          support@aksatax.id
          <ExternalLink size={12} className="text-muted-foreground" />
        </a>
      </div>

      <div className="mt-4">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Kembali ke Bantuan
        </Link>
      </div>
    </div>
  );
}
