"use client";

import { usePosts } from "@/hooks/use-posts";
import PostCard from "@/components/posts/post-card";
import Link from "next/link";

export default function HomeFeedPage() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <Link
          href="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Buat Postingan
        </Link>
      </div>
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
