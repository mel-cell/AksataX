"use client";

import { useParams } from "next/navigation";
import { usePostDetail } from "@/hooks/use-post-detail";

export default function PostDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { data: post, isLoading, isError } = usePostDetail(id);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError || !post) {
    return <div className="p-6 text-red-500">Post tidak ditemukan</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="mt-3 text-sm text-gray-500 flex gap-4">
        <span>{post.user.username}</span>
        <span>{post.category.name}</span>
      </div>

      <div className="mt-8 whitespace-pre-wrap">{post.body}</div>

      <div className="mt-10">
        <h2 className="font-bold text-xl mb-4">
          Komentar ({post.comments_count})
        </h2>

        {post.comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4 mb-3">
            <div className="font-semibold">{comment.user.username}</div>

            <div className="mt-2">{comment.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
