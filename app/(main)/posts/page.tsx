"use client";

import { useMemo, useCallback } from "react";
import PostCard from "@/components/posts/PostCard";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import Link from "next/link";
import { Loader2 } from 'lucide-react';

export default function PostsPage() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfinitePosts("created_at");

  const posts = useMemo(() => data?.pages.flatMap((p) => p) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Forum Diskusi</h1>
        <Link
          href="/posts/create"
          className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-sidebar-accent text-card-foreground text-sm font-medium transition-colors"
        >
          + Buat Postingan
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat postingan...
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <p className="text-sm">Belum ada postingan</p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-3">
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
