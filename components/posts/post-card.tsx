"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from "lucide-react";

import { Post } from "@/types/post";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useToggleBookmark } from "@/hooks/use-toggle-bookmark";

interface Props {
  post: Post;
}

function Avatar({ username, avatarUrl }: { username: string; avatarUrl?: string }) {
  const initials = username
    .split("_")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand flex-shrink-0">
      {initials}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}d`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam`;
  return `${Math.floor(diff / 86400)} hr`;
}

export default function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(post.user_liked ?? false);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked ?? false);
  const [likeCount, setLikeCount] = useState(post.vote_score ?? 0);

  const toggleLike = useToggleLike();
  const toggleBookmark = useToggleBookmark();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleLike.mutateAsync(post.id);
      setLiked(result.liked);
      setLikeCount((prev) => result.liked ? prev + 1 : prev - 1);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message === "Tidak terautentikasi") alert("Silakan login terlebih dahulu");
      else if (message === "Data tidak ditemukan") alert("Postingan tidak ditemukan");
      else console.error("Gagal like post:", error);
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
      if (message === "Tidak terautentikasi") alert("Silakan login terlebih dahulu");
      else if (message === "Data tidak ditemukan") alert("Postingan tidak ditemukan");
      else console.error("Gagal bookmark post:", error);
    }
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="border border-border bg-card rounded-xl p-4 hover:bg-sidebar-accent/30 transition cursor-pointer">
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar username={post.user.username} avatarUrl={post.user.avatar_url} />

          <div className="flex-1 min-w-0">
            {/* Header baris atas */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm text-card-foreground">
                  {post.user.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{post.user.username}
                </span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(post.created_at)}
                </span>
              </div>
              <button
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-card-foreground transition-colors flex-shrink-0"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Konten */}
            <p className="text-sm text-card-foreground mb-1 leading-relaxed">
              {post.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
              {post.body}
            </p>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground border border-border"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-5 text-muted-foreground">
              <button
                onClick={handleLike}
                disabled={toggleLike.isPending}
                className={`flex items-center gap-1.5 text-xs hover:text-red-500 transition-colors ${liked ? "text-red-500" : ""}`}
              >
                <Heart size={15} className={liked ? "fill-red-500" : ""} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-xs hover:text-brand transition-colors"
              >
                <MessageCircle size={15} />
                <span>{post.comments_count}</span>
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-xs hover:text-green-500 transition-colors"
              >
                <Repeat2 size={15} />
                <span>{post.view_count}</span>
              </button>

              <button
                onClick={handleBookmark}
                disabled={toggleBookmark.isPending}
                className={`flex items-center gap-1.5 text-xs hover:text-brand transition-colors ml-auto ${bookmarked ? "text-brand" : ""}`}
              >
                <Bookmark size={15} className={bookmarked ? "fill-brand" : ""} />
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-xs hover:text-brand transition-colors"
              >
                <Share size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}