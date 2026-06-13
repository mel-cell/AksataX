import { Info, MessageSquare, Users, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-foreground">Tentang AksataX</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform diskusi terbuka untuk berbagi ide dan pengetahuan
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Info size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Apa itu AksataX?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AksataX adalah platform diskusi berbasis teks yang memungkinkan pengguna
            untuk berbagi pemikiran, bertanya, dan berdiskusi dengan komunitas.
            Kami percaya bahwa setiap orang memiliki pengetahuan berharga untuk dibagikan.
          </p>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Fitur Utama</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Buat postingan dan diskusi dengan berbagai kategori",
              "Vote dan bookmark konten favoritmu",
              "Sistem reputasi dan level untuk menghargai partisipasi",
              "Komentar dengan dukungan nested replies",
              "Notifikasi real-time untuk interaksi",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Users size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Komunitas</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AksataX dibangun oleh dan untuk komunitas. Kami mendorong diskusi yang
            sehat, konstruktif, dan berbasis fakta. Setiap anggota memiliki peran
            penting dalam menjaga kualitas percakapan.
          </p>
        </section>

        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Shield size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Kebijakan</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pelajari lebih lanjut tentang aturan dan kebijakan kami di halaman{" "}
            <a href="/terms/aksatax-rule" className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Aturan AksataX
            </a>
            ,{" "}
            <a href="/terms/privacy-policy" className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Kebijakan Privasi
            </a>
            , dan{" "}
            <a href="/terms/user-agreement" className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Perjanjian Pengguna
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
