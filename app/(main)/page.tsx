"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser, getToken } from "@/hooks/use-auth";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import PostCard from "@/components/posts/PostCard";
import FilterBar from "@/components/posts/FilterBar";
import RightPanel from "@/components/posts/RightPanel";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import type { FilterState } from "@/types/post";
import { ImageIcon, FileText, Smile } from "lucide-react";
import Link from "next/link";

const SORT_MAP: Record<string, string> = {
  Terbaru: "created_at",
  Terpopuler: "view_count",
  "Vote Terbanyak": "vote_score",
};

function ComposeBox({ isAuth }: { isAuth: boolean }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const { data: user } = useUser();

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "?";

  const handlePost = () => {
    if (!text.trim()) return;
    setText("");
    setFocused(false);
  };

  if (!isAuth) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 mb-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">Ingin bertanya atau berbagi?</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-[#1C1917] px-5 py-2 text-xs font-medium text-[#FAFAF9] transition hover:bg-[#292524]"
        >
          Masuk untuk posting
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Apa yang sedang kamu pikirkan?"
            rows={focused ? 3 : 1}
            className="w-full bg-transparent text-sm text-card-foreground placeholder-muted-foreground resize-none outline-none leading-relaxed py-1.5 transition-all"
          />

          {focused && <div className="border-t border-border mb-2" />}

          <div className="flex items-center gap-3 mt-1">
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Unggah gambar"
            >
              <ImageIcon size={17} />
            </button>
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Unggah artikel"
            >
              <FileText size={17} />
            </button>
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Tambah emoji"
            >
              <Smile size={17} />
            </button>

            <div className="flex-1" />

            {focused && (
              <span
                className={`text-xs tabular-nums ${text.length > 260 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {text.length}/280
              </span>
            )}

            <button
              onClick={handlePost}
              disabled={!text.trim() || text.length > 280}
              className="px-4 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] disabled:opacity-40 disabled:cursor-not-allowed text-[#FAFAF9] text-xs font-medium transition-colors"
            >
              Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeedPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tab: "Semua",
    sort: "Terbaru",
    tags: [],
  });

  const apiSort = SORT_MAP[filters.sort] ?? "created_at";
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfinitePosts(apiSort);

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data],
  );

  const filteredPosts = useMemo(() => {
    let result = allPosts;

    if (filters.tab === "Belum Terjawab") {
      result = result.filter((p) => !p.is_answered);
    } else if (filters.tab === "Terjawab") {
      result = result.filter((p) => p.is_answered);
    }

    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        p.tags?.some((t) => filters.tags.includes(`#${t.name}`)),
      );
    }

    return result;
  }, [allPosts, filters]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-foreground mb-4">Beranda</h1>

          <FilterBar onFilterChange={setFilters} />
          <ComposeBox isAuth={isAuth} />

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-muted-foreground text-sm">Belum ada postingan yang sesuai filter.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Coba ubah filter atau buat postingan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                isLoading={isFetchingNextPage}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:block w-72 flex-shrink-0">
          <RightPanel posts={allPosts} />
        </div>
      </div>
    </div>
  );
}
