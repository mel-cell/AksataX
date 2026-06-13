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
        <p className="text-muted-foreground text-sm">Dokumen tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-8 pt-8 pb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted border border-border rounded-full px-2.5 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          {doc.version} · Berlaku {doc.effectiveDate}
        </span>
        <h1 className="text-2xl font-bold text-foreground mb-2">{doc.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{doc.subtitle}</p>
        <p className="mt-3 text-xs text-muted-foreground/60">
          Terakhir diperbarui: {doc.lastUpdated}
        </p>
      </div>

      <div className="px-8">
        <div className="mt-5 mb-2 rounded-2xl bg-muted border border-border overflow-hidden">
          <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-4 pt-3.5 pb-2">
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
                        ? "bg-brand/10 text-brand"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold w-5 text-center shrink-0 ${
                        activeSection === section.id
                          ? "text-brand"
                          : "text-muted-foreground/50 group-hover:text-muted-foreground"
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
              className="border-b border-border py-7"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 mt-0.5 text-[10px] font-mono font-bold text-muted-foreground bg-muted border border-border rounded-lg px-2 py-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold text-foreground leading-snug">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3 ml-[calc(2rem+12px)]">
                {section.content.map((para, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}

                {section.items && section.items.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
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
            <p className="text-xs text-muted-foreground/60">
              Pertanyaan? Hubungi kami di{" "}
              <a href="mailto:support@aksatax.id" className="text-foreground hover:underline">
                support@aksatax.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
