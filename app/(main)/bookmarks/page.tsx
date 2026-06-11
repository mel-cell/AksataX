"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getToken } from "@/hooks/use-auth";
import type { Post } from "@/types/post";
import PostCard from "@/components/posts/post-card";
import { Bookmark, Loader2 } from "lucide-react";

export default function BookmarksPage() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["bookmarked-posts"],
    queryFn: async () => {
      const { data } = await api.get("/posts", {
        params: { bookmarked: 1, per_page: 50 },
      });
      return (data.data ?? []) as Post[];
    },
    enabled: !!getToken(),
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1917]">Bookmarks</h1>
        <p className="mt-1 text-xs text-[#A8A29E]">Postingan yang kamu simpan</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-[#A8A29E]">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat bookmark...
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#A8A29E]">
          <Bookmark size={32} className="mb-3" />
          <p className="text-sm">Belum ada bookmark</p>
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
