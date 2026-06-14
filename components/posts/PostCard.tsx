"use client";

import { useState } from "react";
import type { Post } from "@/types/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToggleBookmark } from "@/hooks/use-toggle-bookmark";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useToggleVote } from "@/hooks/use-toggle-vote";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import {
  Bookmark,
  MessageCircle,
  Eye,
  ChevronUp,
  ChevronDown,
  Heart,
} from "lucide-react";
import UserHoverCard from "@/components/ui/UserHoverCard";
import PostMenu from "@/components/ui/PostMenu";

type Props = {
  post: Post;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/[_ ]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-semibold text-zinc-600 flex-shrink-0">
      {initials}
    </div>
  );
}

export default function PostCard({ post }: Props) {
  const router = useRouter();

  const {
    id,
    title,
    body,
    user,
    category,
    tags,
    comments_count,
    view_count,
    created_at,
    is_answered,
  } = post;

  const [bookmarked, setBookmarked] = useState(post.is_bookmarked ?? false);
  const [liked, setLiked] = useState(post.user_liked ?? false);
  const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(
    post.user_vote as "upvote" | "downvote" | null,
  );
  const [voteScore, setVoteScore] = useState(post.vote_score);

  const toggleBookmark = useToggleBookmark();
  const toggleLike = useToggleLike();
  const toggleVote = useToggleVote();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const previousState = bookmarked;

    // langsung ubah UI
    setBookmarked(!bookmarked);

    try {
      const result = await toggleBookmark.mutateAsync(id);

      // sinkronkan dengan response API
      setBookmarked(result.is_bookmarked);
    } catch (err) {
      console.error("Bookmark gagal:", err);
      setBookmarked(previousState);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    try {
      const result = await toggleLike.mutateAsync(id);
      setLiked(result.liked);
    } catch {
      setLiked(!liked);
    }
  };

  const handleVote = async (
    e: React.MouseEvent,
    type: "upvote" | "downvote",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleVote.mutateAsync({
        postId: id,
        voteType: type,
      });
      setVoteType(result.vote_type ?? null);
      setVoteScore(result.vote_score);
    } catch {
      // ignore
    }
  };

  const navigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  const authorName = user?.username ?? "anonymous";
  const categoryName = category?.name ?? "";
  const excerpt =
    body?.slice(0, 180) + (body && body.length > 180 ? "..." : "");
  const rep = user?.reputation_points ?? 0;
  const lvl = user?.level ?? Math.floor(rep / 50);

  return (
    <div className="block group">
      <div className="bg-card border border-border rounded-xl p-4 hover:border-zinc-300 transition-colors">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 w-9">
            <button
              onClick={(e) => handleVote(e, "upvote")}
              disabled={toggleVote.isPending}
              className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors text-xs ${
                voteType === "upvote"
                  ? "bg-green-50 text-green-600 border-green-300"
                  : "bg-card text-muted-foreground border-border hover:bg-green-50 hover:text-green-600 hover:border-green-300"
              }`}
              aria-label="Upvote"
            >
              <ChevronUp size={14} />
            </button>
            <span
              className={`text-xs font-semibold tabular-nums ${
                voteType === "upvote"
                  ? "text-green-600"
                  : voteType === "downvote"
                    ? "text-red-500"
                    : "text-card-foreground"
              }`}
            >
              {voteScore}
            </span>
            <button
              onClick={(e) => handleVote(e, "downvote")}
              disabled={toggleVote.isPending}
              className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors text-xs ${
                voteType === "downvote"
                  ? "bg-red-50 text-red-500 border-red-300"
                  : "bg-card text-muted-foreground border-border hover:bg-red-50 hover:text-red-500 hover:border-red-300"
              }`}
              aria-label="Downvote"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <UserHoverCard username={authorName}>
                <button
                  onClick={(e) => navigate(e, `/user/${authorName}`)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
                >
                  <Avatar name={authorName} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-card-foreground">
                        {authorName}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium leading-none">
                        Lv.{lvl}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rep.toLocaleString("id-ID")} poin
                    </p>
                  </div>
                </button>
              </UserHoverCard>
              <div className="flex items-center gap-0.5 shrink-0">
                <span className="text-xs text-muted-foreground pt-0.5">
                  {formatDistanceToNow(new Date(created_at), {
                    addSuffix: true,
                    locale: localeId as any,
                  })}
                </span>
                <PostMenu
                  postId={id}
                  postTitle={title}
                  authorId={user.id}
                  authorUsername={authorName}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <button
                onClick={(e) =>
                  navigate(e, `/search?category=${category?.slug ?? ""}`)
                }
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200 transition-colors"
              >
                {categoryName}
              </button>
              {is_answered ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  ✓ Terjawab
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  Belum Terjawab
                </span>
              )}
            </div>

            <Link href={`/posts/${id}`}>
              <h2 className="text-base font-semibold text-card-foreground hover:text-brand mb-1 leading-snug line-clamp-2">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {excerpt}
              </p>
            </Link>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1.5 flex-wrap flex-1">
                {tags?.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={(e) => navigate(e, `/search?tag=${tag.slug}`)}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:bg-sidebar-accent hover:border-zinc-300 transition-colors"
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={toggleLike.isPending}
                  className={`flex items-center gap-1 transition-colors ${
                    liked
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={14}
                    strokeWidth={2}
                    fill={liked ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleBookmark}
                  disabled={toggleBookmark.isPending}
                  className={`flex items-center gap-1 transition-colors ${
                    bookmarked
                      ? "text-amber-500"
                      : "text-muted-foreground hover:text-amber-500"
                  }`}
                >
                  <Bookmark
                    size={18}
                    strokeWidth={2}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </button>
                <Link
                  href={`/posts/${id}`}
                  className="flex items-center gap-1 hover:text-card-foreground transition-colors"
                >
                  <MessageCircle size={13} />
                  {comments_count}
                </Link>
                <span className="flex items-center gap-1">
                  <Eye size={13} />
                  {view_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
