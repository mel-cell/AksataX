"use client";

import { useMemo, useCallback } from "react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import PostCard from "@/components/posts/PostCard";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { TrendingUp, Loader2 } from "lucide-react";

export default function TrendingPage() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfinitePosts("view_count");

  const posts = useMemo(() => data?.pages.flatMap((p) => p) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Trending</h1>
        <p className="mt-1 text-xs text-muted-foreground">Postingan paling populer</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat trending...
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <TrendingUp size={32} className="mb-3" />
          <p className="text-sm">Belum ada postingan trending</p>
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
