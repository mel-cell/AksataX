"use client";

import Link from "next/link";
import { useState } from "react";

import { Post } from "@/types/post";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useToggleBookmark } from "@/hooks/use-toggle-bookmark";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(post.user_liked ?? false);

  const [bookmarked, setBookmarked] = useState(post.is_bookmarked ?? false);

  const toggleLike = useToggleLike();
  const toggleBookmark = useToggleBookmark();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await toggleLike.mutateAsync(post.id);

      setLiked(result.liked);
    } catch (error: any) {
      const message = error.response?.data?.message;

      if (message === "Tidak terautentikasi") {
        alert("Silakan login terlebih dahulu");
        return;
      }

      if (message === "Data tidak ditemukan") {
        alert("Postingan tidak ditemukan");
        return;
      }

      console.error("Gagal like post:", error);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await toggleBookmark.mutateAsync(post.id);

      setBookmarked(result.is_bookmarked);
    } catch (error: any) {
      const message = error.response?.data?.message;

      if (message === "Tidak terautentikasi") {
        alert("Silakan login terlebih dahulu");
        return;
      }

      if (message === "Data tidak ditemukan") {
        alert("Postingan tidak ditemukan");
        return;
      }

      console.error("Gagal bookmark post:", error);
    }
  };

  return (
    <Link href={`/id/member/home/${post.id}`}>
      <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
        <h2 className="font-bold text-lg">{post.title}</h2>

        <p className="text-gray-500 mt-2 line-clamp-2">{post.body}</p>

        <div className="flex gap-4 mt-4 text-sm text-gray-400">
          <span>👤 {post.user.username}</span>

          <span>📂 {post.category.name}</span>

          <span>💬 {post.comments_count}</span>

          <span>👁️ {post.view_count}</span>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex gap-3">
          {/* LIKE */}
          <button
            type="button"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className={`px-3 py-1 rounded-md border transition ${
              liked
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {liked ? "❤️ Disukai" : "🤍 Suka"}
          </button>

          {/* BOOKMARK */}
          <button
            type="button"
            onClick={handleBookmark}
            disabled={toggleBookmark.isPending}
            className={`px-3 py-1 rounded-md border transition ${
              bookmarked
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {bookmarked ? "🔖 Tersimpan" : "📑 Simpan"}
          </button>
        </div>
      </div>
    </Link>
  );
}
