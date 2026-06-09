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
    <Link href={`/posts/${post.id}`}>
      <div className="border border-border bg-card rounded-lg p-4 hover:shadow-sm transition cursor-pointer">
        <h2 className="font-semibold text-card-foreground">{post.title}</h2>

        <p className="text-muted-foreground mt-1.5 text-sm line-clamp-2">{post.body}</p>

        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span>{post.user.username}</span>
          <span className="text-border">|</span>
          <span>{post.category.name}</span>
          <span className="text-border">|</span>
          <span>{post.comments_count} komentar</span>
          <span>{post.view_count} dilihat</span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className={`px-3 py-1 rounded-lg border transition text-xs font-medium ${
              liked
                ? "bg-red-500 text-white border-red-500"
                : "bg-card text-muted-foreground border-border hover:bg-sidebar-accent"
            }`}
          >
            {liked ? "Disukai" : "Suka"}
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            disabled={toggleBookmark.isPending}
            className={`px-3 py-1 rounded-lg border transition text-xs font-medium ${
              bookmarked
                ? "bg-sidebar-accent text-sidebar-foreground border-border"
                : "bg-card text-muted-foreground border-border hover:bg-sidebar-accent"
            }`}
          >
            {bookmarked ? "Tersimpan" : "Simpan"}
          </button>
        </div>
      </div>
    </Link>
  );
}
