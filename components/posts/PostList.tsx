"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/types/post";
import { ImageIcon, FileText, Smile } from "lucide-react";

type Props = {
  posts: Post[];
  postsPerPage?: number;
};

type PageItem = number | "...";

export default function PostList({ posts, postsPerPage = 10 }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginated = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  const getPageNumbers = (): PageItem[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div>
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-semibold text-zinc-600 flex-shrink-0">
            MK
          </div>
          <input
            type="text"
            placeholder="Apa yang sedang kamu pikirkan?"
            className="flex-1 text-sm text-muted-foreground placeholder-muted-foreground bg-sidebar-accent rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition"
            readOnly
          />
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border pl-13">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon size={16} />
            <span>Gambar</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <FileText size={16} />
            <span>Artikel</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Smile size={16} />
            <span>Perasaan</span>
          </button>
          <button className="ml-auto text-xs bg-brand hover:bg-brand/90 text-white px-4 py-1.5 rounded-full font-medium transition-colors">
            Posting
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-muted-foreground text-sm">Belum ada postingan yang sesuai filter.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Coba ubah filter atau buat postingan baru.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg border border-border bg-card text-muted-foreground flex items-center justify-center disabled:opacity-30 hover:border-zinc-500 hover:text-card-foreground transition-colors"
          >
            ‹
          </button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="w-8 text-center text-muted-foreground text-sm">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-zinc-100 border border-zinc-300 text-zinc-600"
                    : "border border-border bg-card text-muted-foreground hover:border-zinc-500 hover:text-card-foreground"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg border border-border bg-card text-muted-foreground flex items-center justify-center disabled:opacity-30 hover:border-zinc-500 hover:text-card-foreground transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
