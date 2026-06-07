"use client";

import PostCard from "@/app/components/post-card";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/use-posts";
import Link from "next/link";

export default function HomePage() {
  const { data: posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Gagal memuat postingan</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Forum Diskusi</h1>
      <Link
        href="/id/member/inputpostingan"
        className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Buat Postingan
      </Link>

      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />

            <Button asChild className="mt-2">
              <Link href={`/id/member/postingan/${post.id}`}>Lihat Detail</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
