"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getToken } from "@/hooks/use-auth";
import type { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { Bookmark, Loader2 } from "lucide-react";

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery<Post[]>({
    queryKey: ["bookmarked-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get("/posts", {
        params: { bookmarked: 1, page: pageParam, per_page: 10 },
      });
      return ((data.data ?? []) as Post[]).map((p) => ({ ...p, is_bookmarked: true }));
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < 10) return undefined;
      return (lastPageParam as number) + 1;
    },
    initialPageParam: 1,
    enabled: mounted && !!getToken(),
  });

  const posts = useMemo(() => data?.pages.flatMap((p) => p) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
        <p className="mt-1 text-xs text-muted-foreground">Postingan yang kamu simpan</p>
      </div>

      {!mounted || (isLoading && !posts.length) ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat bookmark...
        </div>
      ) : error || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bookmark size={32} className="mb-3" />
          <p className="text-sm">{error ? "Gagal memuat bookmark" : "Belum ada bookmark"}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
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
  );
}
