"use client";

import { useCategories } from "@/hooks/use-categories";
import Link from "next/link";
import { Hash, Loader2 } from "lucide-react";

export default function TopicsPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Topik</h1>
      <p className="text-xs text-muted-foreground mb-6">Jelajahi kategori diskusi</p>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat topik...
        </div>
      )}

      {categories && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Hash size={32} className="mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada topik tersedia</p>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="bg-card border border-border rounded-xl p-4 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground bg-sidebar-accent px-2 py-0.5 rounded-full shrink-0 ml-3">
                  {cat.posts_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
