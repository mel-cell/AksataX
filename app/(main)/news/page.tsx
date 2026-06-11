"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import PostCard from "@/components/posts/post-card";
import { Newspaper, Loader2 } from "lucide-react";

export default function NewsPage() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["news-posts"],
    queryFn: async () => {
      const { data } = await api.get("/posts", {
        params: { sort: "created_at", order: "desc", per_page: 50 },
      });
      return (data.data ?? []) as Post[];
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1917]">News</h1>
        <p className="mt-1 text-xs text-[#A8A29E]">Postingan terbaru</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-[#A8A29E]">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat news...
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#A8A29E]">
          <Newspaper size={32} className="mb-3" />
          <p className="text-sm">Belum ada postingan</p>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
