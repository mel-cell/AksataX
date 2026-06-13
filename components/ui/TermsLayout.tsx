"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useTerms } from "@/hooks/use-terms";

interface TermsLayoutProps {
  slug: string;
}

export function TermsLayout({ slug }: TermsLayoutProps) {
  const { doc, activeSection, scrollToSection } = useTerms(slug);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-4xl mb-3">📄</p>
<<<<<<< HEAD
        <p className="text-zinc-500 text-sm">Dokumen tidak ditemukan.</p>
=======
        <p className="text-muted-foreground text-sm">Dokumen tidak ditemukan.</p>
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="border-b border-zinc-200 px-8 pt-8 pb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          {doc.version} · Berlaku {doc.effectiveDate}
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">{doc.title}</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">{doc.subtitle}</p>
        <p className="mt-3 text-xs text-zinc-400">
=======
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-8 pt-8 pb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted border border-border rounded-full px-2.5 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          {doc.version} · Berlaku {doc.effectiveDate}
        </span>
        <h1 className="text-2xl font-bold text-foreground mb-2">{doc.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{doc.subtitle}</p>
        <p className="mt-3 text-xs text-muted-foreground/60">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
          Terakhir diperbarui: {doc.lastUpdated}
        </p>
      </div>

      <div className="px-8">
<<<<<<< HEAD
        <div className="mt-5 mb-2 rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-4 pt-3.5 pb-2">
=======
        <div className="mt-5 mb-2 rounded-2xl bg-muted border border-border overflow-hidden">
          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-4 pt-3.5 pb-2">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
            Daftar Isi
          </p>
          <ScrollArea.Root>
            <ScrollArea.Viewport>
              <div className="px-2 pb-2 space-y-0.5">
                {doc.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                      activeSection === section.id
<<<<<<< HEAD
                        ? "bg-blue-50 text-blue-700"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
=======
                        ? "bg-brand/10 text-brand"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold w-5 text-center shrink-0 ${
                        activeSection === section.id
<<<<<<< HEAD
                          ? "text-blue-500"
                          : "text-zinc-400 group-hover:text-zinc-600"
=======
                          ? "text-brand"
                          : "text-muted-foreground/50 group-hover:text-muted-foreground"
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>

        <div className="pb-20 space-y-0">
          {doc.sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
<<<<<<< HEAD
              className="border-b border-zinc-100 py-7"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 mt-0.5 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 rounded-lg px-2 py-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold text-zinc-900 leading-snug">
=======
              className="border-b border-border py-7"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 mt-0.5 text-[10px] font-mono font-bold text-muted-foreground bg-muted border border-border rounded-lg px-2 py-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold text-foreground leading-snug">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3 ml-[calc(2rem+12px)]">
                {section.content.map((para, i) => (
<<<<<<< HEAD
                  <p key={i} className="text-sm text-zinc-500 leading-relaxed">
=======
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                    {para}
                  </p>
                ))}

                {section.items && section.items.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
<<<<<<< HEAD
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span className="text-sm text-zinc-500 leading-relaxed">
=======
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <div className="pt-8 pb-4 text-center">
<<<<<<< HEAD
            <p className="text-xs text-zinc-400">
              Pertanyaan? Hubungi kami di{" "}
              <a href="mailto:support@aksatax.id" className="text-blue-600 hover:underline">
=======
            <p className="text-xs text-muted-foreground/60">
              Pertanyaan? Hubungi kami di{" "}
              <a href="mailto:support@aksatax.id" className="text-foreground hover:underline">
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
                support@aksatax.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> b512825a161dfb1b5af50c0097424e21c0ef8f9f
