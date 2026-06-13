"use client";

import { useMemo, useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import Link from "next/link";
import {
  Hash,
  Search,
  Brain,
  MessageSquare,
  Database,
  Palette,
  Server,
  Smartphone,
  Code2,
  Shield,
  Globe,
  LayoutGrid,
  Tag,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ReactNode; bg: string; color: string; desc: string }
> = {
  "artificial-intelligence": {
    icon: <Brain size={16} />,
    bg: "bg-violet-50",
    color: "text-violet-700",
    desc: "Diskusi seputar AI, ML, dan deep learning",
  },
  "career-discussion": {
    icon: <MessageSquare size={16} />,
    bg: "bg-teal-50",
    color: "text-teal-700",
    desc: "Karir, tips kerja, dan diskusi umum",
  },
  database: {
    icon: <Database size={16} />,
    bg: "bg-blue-50",
    color: "text-blue-700",
    desc: "SQL, NoSQL, query, dan optimasi",
  },
  "design-ux": {
    icon: <Palette size={16} />,
    bg: "bg-pink-50",
    color: "text-pink-700",
    desc: "UI, UX, Figma, dan desain produk",
  },
  "devops-infrastructure": {
    icon: <Server size={16} />,
    bg: "bg-amber-50",
    color: "text-amber-700",
    desc: "Docker, CI/CD, cloud, dan server",
  },
  "mobile-development": {
    icon: <Smartphone size={16} />,
    bg: "bg-green-50",
    color: "text-green-700",
    desc: "Android, iOS, Flutter, React Native",
  },
  programming: {
    icon: <Code2 size={16} />,
    bg: "bg-orange-50",
    color: "text-orange-700",
    desc: "Bahasa pemrograman, algoritma, DSA",
  },
  security: {
    icon: <Shield size={16} />,
    bg: "bg-red-50",
    color: "text-red-700",
    desc: "Keamanan sistem, pentest, enkripsi",
  },
  "web-development": {
    icon: <Globe size={16} />,
    bg: "bg-zinc-100",
    color: "text-zinc-600",
    desc: "Frontend, backend, fullstack, API",
  },
};

const DEFAULT_CONFIG = {
  icon: <Hash size={16} />,
  bg: "bg-zinc-100",
  color: "text-zinc-600",
  desc: "Jelajahi diskusi di kategori ini",
};

export default function TopicsPage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: allTags, isLoading: tagLoading } = useTags();
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(
    () =>
      (categories ?? []).filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.description ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const sortedTags = useMemo(
    () =>
      (allTags ?? []).sort(
        (a, b) => (b.posts_count ?? 0) - (a.posts_count ?? 0)
      ),
    [allTags]
  );

  const isLoading = catLoading || tagLoading;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-foreground">Topik</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Jelajahi kategori dan tag diskusi
        </p>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
            <LayoutGrid size={12} />
            <span className="font-medium text-foreground">
              {categories?.length ?? 0}
            </span>
            <span>Kategori</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
            <Tag size={12} />
            <span className="font-medium text-foreground">
              {allTags?.length ?? 0}
            </span>
            <span>Tag</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kategori..."
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-400 transition-all"
        />
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-xl p-4 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg" />
                <div className="h-3.5 bg-zinc-100 rounded w-2/3" />
              </div>
              <div className="h-3 bg-zinc-100 rounded w-full" />
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <div className="h-3 bg-zinc-100 rounded w-16" />
                <div className="h-3 bg-zinc-100 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty — search no results */}
      {!isLoading && search && filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Tidak ada hasil untuk &quot;{search}&quot;
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Coba kata kunci lain
          </p>
        </div>
      )}

      {/* Empty — no categories */}
      {!isLoading && !search && filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
            <Hash size={18} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Belum ada kategori tersedia
          </p>
        </div>
      )}

      {/* Category grid */}
      {!isLoading && filteredCategories.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <LayoutGrid size={13} />
            Kategori
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCategories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat.slug] ?? DEFAULT_CONFIG;
              return (
                <Link
                  key={cat.id}
                  href={`/search?category=${cat.slug}`}
                  className="group bg-white border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-300 transition-colors"
                >
                  {/* Icon + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight">
                      {cat.name}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {cat.description ?? cfg.desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {cat.posts_count} diskusi
                    </span>
<span className="text-xs text-muted-foreground/40 group-hover:text-foreground transition-colors flex items-center gap-1">
                       Jelajahi →
                     </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Tags */}
      {!isLoading && sortedTags.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Tag size={13} />
            Tag populer
          </h2>
          <div className="border border-border rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {sortedTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-zinc-50 text-xs text-muted-foreground hover:border-zinc-300 hover:text-foreground hover:bg-white transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-300" />
                  <span>#{tag.name}</span>
                  <span className="text-muted-foreground/40">
                    {tag.posts_count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}