"use client";

import { useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getToken } from "@/hooks/use-auth";
import type { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { Bookmark, Loader2 } from "lucide-react";

export default function BookmarksPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Post[]>({
    queryKey: ["bookmarked-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get("/posts", {
        params: { bookmarked: 1, page: pageParam, per_page: 10 },
      });
      return (data.data ?? []) as Post[];
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < 10) return undefined;
      return (lastPageParam as number) + 1;
    },
    initialPageParam: 1,
    enabled: !!getToken(),
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

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat bookmark...
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bookmark size={32} className="mb-3" />
          <p className="text-sm">Belum ada bookmark</p>
        </div>
      )}

      {posts.length > 0 && (
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
