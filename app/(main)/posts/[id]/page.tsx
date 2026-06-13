"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { usePostDetail } from "@/hooks/use-post-detail";
import { useCreateComment } from "@/hooks/use-comments";
import { useUser } from "@/hooks/use-auth";
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Send,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { postService } from "@/lib/services/post-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "@/components/ui/CommentItem";

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: post, isLoading, isError } = usePostDetail(id);
  const { data: currentUser } = useUser();
  const [newComment, setNewComment] = useState("");

  const currentUserId = currentUser?.id;
  const currentUserRoles = currentUser?.roles ?? [];

  const createComment = useCreateComment();

  const likeMutation = useMutation({
    mutationFn: () => postService.toggleLike(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", id] }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => postService.toggleBookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", id] }),
  });

  const voteMutation = useMutation({
    mutationFn: (type: "upvote" | "downvote") => postService.toggleVote(id, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", id] }),
  });

  function handleCommentSubmit() {
    if (!newComment.trim()) return;
    createComment.mutate(
      { postId: id, body: newComment },
      { onSuccess: () => setNewComment("") }
    );
  }

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4 animate-pulse">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-2/3 mt-4" />
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="space-y-2 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-base font-medium text-destructive">Post tidak ditemukan</p>
        <Link
          href="/"
          className="text-sm text-muted-foreground underline mt-2 inline-block"
        >
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    /* Outer page wrapper — centers & constrains everything */
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* ── Back button ── */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background group-hover:bg-muted transition-colors">
              <ArrowLeft size={15} />
            </span>
            <span>Kembali</span>
          </Link>
        </div>

        {/* ── Post card ── */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Card header */}
          <div className="px-6 pt-6 pb-5 border-b border-border">

            {/* Tags + answered badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.is_answered && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={11} />
                  Terjawab
                </span>
              )}
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}18` : undefined,
                    borderColor: tag.color ?? undefined,
                    color: tag.color ?? undefined,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Title row with vote */}
            <div className="flex gap-4 items-start">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-0.5 pt-0.5 flex-shrink-0">
                <button
                  onClick={() => voteMutation.mutate("upvote")}
                  disabled={voteMutation.isPending}
                  className={`p-1.5 rounded-lg transition-colors ${
                    post.user_vote === "upvote"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                  aria-label="Upvote"
                >
                  <ChevronUp size={18} />
                </button>
                <span
                  className={`text-sm font-bold tabular-nums leading-none ${
                    post.vote_score > 0
                      ? "text-emerald-600"
                      : post.vote_score < 0
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {post.vote_score}
                </span>
                <button
                  onClick={() => voteMutation.mutate("downvote")}
                  disabled={voteMutation.isPending}
                  className={`p-1.5 rounded-lg transition-colors ${
                    post.user_vote === "downvote"
                      ? "text-red-500 bg-red-50"
                      : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  }`}
                  aria-label="Downvote"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold leading-snug text-foreground">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mt-2.5 text-xs text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {getInitials(post.user.username)}
                  </div>
                  <span className="font-medium text-foreground/80">
                    {post.user.username}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {timeAgo}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {post.view_count} dilihat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card body — post content */}
          <div className="px-6 py-6">
            <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
              {post.body}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap mt-6 pt-5 border-t border-border">
              <button
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                  post.user_liked
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Heart
                  size={13}
                  className={post.user_liked ? "fill-rose-500" : ""}
                />
                Suka
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
              >
                <Share2 size={13} />
                Bagikan
              </button>
              <button
                onClick={() => bookmarkMutation.mutate()}
                disabled={bookmarkMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                  post.is_bookmarked
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Bookmark
                  size={13}
                  className={post.is_bookmarked ? "fill-blue-500" : ""}
                />
                {post.is_bookmarked ? "Tersimpan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Comments card ── */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Comments header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <MessageCircle size={16} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Komentar</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {post.comments_count}
            </span>
          </div>

          {/* New comment input */}
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {currentUser ? getInitials(currentUser.username) : "?"}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar atau jawaban..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition placeholder:text-muted-foreground"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={createComment.isPending || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {createComment.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    Kirim Komentar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment list */}
          {post.comments.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              <MessageCircle size={28} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {post.comments.map((comment) => (
                <div key={comment.id} className="px-6 py-1">
                  <CommentItem
                    comment={comment}
                    postId={post.id}
                    postAuthorId={post.user.id}
                    currentUserId={currentUserId}
                    currentUserRoles={currentUserRoles}
                    acceptedAnswerId={post.accepted_answer_id}
                    depth={0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}