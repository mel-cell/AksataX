"use client";

import { HelpCircle, Mail, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-foreground">Bantuan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Temukan jawaban untuk pertanyaan umum seputar AksataX
        </p>
      </div>

      <div className="space-y-4">
        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Pertanyaan Umum</h2>
          <div className="space-y-3">
            {[
              { q: "Bagaimana cara membuat postingan?", a: "Klik tombol 'Buat Postingan' di sidebar, lalu isi judul, konten, kategori, dan tag yang sesuai." },
              { q: "Bagaimana cara vote postingan?", a: "Gunakan tombol panah atas/bawah di sebelah kiri postingan untuk memberikan upvote atau downvote." },
              { q: "Apa itu bookmark?", a: "Bookmark memungkinkan kamu menyimpan postingan untuk dibaca nanti. Klik ikon bookmark di postingan untuk menyimpannya." },
              { q: "Bagaimana cara mengganti password?", a: "Buka halaman Pengaturan melalui menu profil, lalu masukkan password lama dan password baru." },
              { q: "Apa itu sistem reputasi?", a: "Reputasi didapatkan dari partisipasi aktif seperti membuat postingan, berkomentar, dan menerima vote positif." },
            ].map((item, i) => (
              <details key={i} className="group">
                <summary className="flex items-start gap-2 cursor-pointer text-sm font-medium text-foreground py-1.5 list-none">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0 group-open:bg-brand/60 transition-colors" />
                  {item.q}
                </summary>
                <p className="ml-4 mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Kontak & Sumber Daya</h2>
          <div className="space-y-3">
            <Link href="/report-bug" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Laporkan Masalah</p>
                <p className="text-xs text-muted-foreground">Temui kendala? Laporkan ke tim kami</p>
              </div>
              <ExternalLink size={14} className="ml-auto text-muted-foreground" />
            </Link>
            <Link href="/terms/aksatax-rule" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Aturan Komunitas</p>
                <p className="text-xs text-muted-foreground">Panduan menjaga diskusi tetap sehat</p>
              </div>
              <ExternalLink size={14} className="ml-auto text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
