import {
  LifeBuoy,
  Flag,
  Shield,
  MessageCircle,
  FileText,
  Mail,
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-foreground">Bantuan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cara menggunakan AksataX dan melaporkan masalah
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Flag size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Melaporkan Konten
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Jika kamu menemukan postingan atau komentar yang melanggar aturan,
            kamu bisa melaporkannya langsung dari menu tiga titik (...) pada
            setiap postingan atau komentar.
          </p>
          <ul className="space-y-2">
            {[
              "Klik ikon titik tiga (...) pada postingan atau komentar",
              "Pilih opsi Laporkan",
              "Pilih alasan pelaporan yang sesuai",
              "Tim moderasi akan meninjau laporan dalam 1x24 jam",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Shield size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Jenis Pelanggaran
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Berikut adalah jenis pelanggaran yang bisa kamu laporkan:
          </p>
          <ul className="space-y-2">
            {[
              "Spam atau Iklan",
              "Pelecehan / Bullying",
              "Konten Tidak Pantas",
              "Informasi yang Menyesatkan",
              "Ujaran Kebencian",
              "Lainnya",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-300/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <MessageCircle size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Tips Berdiskusi
            </h2>
          </div>
          <ul className="space-y-2">
            {[
              "Baca aturan komunitas sebelum posting",
              "Gunakan judul yang deskriptif dan jelas",
              "Pilih kategori yang sesuai dengan topik diskusi",
              "Hargai pendapat orang lain dan diskusikan dengan sehat",
              "Laporkan konten yang melanggar, jangan dibalas",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <FileText size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Aturan &amp; Kebijakan
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pelajari lebih lanjut tentang aturan dan kebijakan AksataX:
          </p>
          <div className="mt-3 space-y-2">
            {[
              { href: "/terms/aksatax-rule", label: "Aturan AksataX" },
              { href: "/terms/privacy-policy", label: "Kebijakan Privasi" },
              { href: "/terms/user-agreement", label: "Perjanjian Pengguna" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
