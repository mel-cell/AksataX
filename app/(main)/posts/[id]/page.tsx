"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { usePostDetail } from "@/hooks/use-post-detail";
import { useComments, useCreateComment } from "@/hooks/use-comments";
import { useUser } from "@/hooks/use-auth";
import {
    ArrowLeft,
    Clock,
    Eye,
    Share2,
    Bookmark,
    MessageCircle,
    Send,
    Loader2,
    CheckCircle2,
    ChevronUp,
    ChevronDown,
    Link2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { postService } from "@/lib/services/post-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "@/components/ui/CommentItem";
import PostMenu from "@/components/ui/PostMenu";

function getInitials(name: string) {
    return name.slice(0, 2).toUpperCase();
}

export default function PostDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();
    const commentsRef = useRef<HTMLDivElement>(null);

    const { data: post, isLoading, isError } = usePostDetail(id);
    const { data: comments, isLoading: commentsLoading } = useComments(id);
    const { data: currentUser } = useUser();
    const [newComment, setNewComment] = useState("");
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const sharePost = useCallback(() => {
        if (!post) return;
        const url = window.location.href;
        const hasNativeShare = typeof navigator !== 'undefined' && (navigator as any).share;
        
        if (hasNativeShare) {
            (navigator as any).share({
                title: post.title,
                url: url,
            }).catch(() => {});
        } else {
            const fallback = () => {
                const input = document.createElement("input");
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }).catch(fallback);
            } else {
                fallback();
            }
        }
        setShareOpen(false);
    }, [post]);

    const currentUserId = currentUser?.id;
    const currentUserRoles = currentUser?.roles ?? [];

    const createComment = useCreateComment();

    const bookmarkMutation = useMutation({
        mutationFn: () => postService.toggleBookmark(id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["post", id] }),
    });

    const voteMutation = useMutation({
        mutationFn: (type: "upvote" | "downvote") =>
            postService.toggleVote(id, type),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["post", id] }),
    });

    function handleCommentSubmit() {
        if (!newComment.trim()) return;
        createComment.mutate(
            { postId: id, body: newComment },
            {
                onSuccess: () => {
                    setNewComment("");
                    setTimeout(
                        () =>
                            commentsRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            }),
                        100,
                    );
                },
            },
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 space-y-4 animate-pulse">
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

    if (isError || !post) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-base font-medium text-destructive">
                    Post tidak ditemukan
                </p>
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
        <div className="min-h-screen bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
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

                <div className="bg-background border border-border rounded-2xl shadow-sm">
                    <div className="px-6 pt-6 bg-gray-50 pb-5 border-b border-border">
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
                                    className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex flex-col items-center gap-1 w-9 pt-0.5 flex-shrink-0">
                                <button
                                    onClick={() =>
                                        voteMutation.mutate("upvote")
                                    }
                                    disabled={voteMutation.isPending}
                                    className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors text-xs ${
                                        post.user_vote === "upvote"
                                            ? "bg-green-50 text-green-600 border-green-300"
                                            : "bg-card text-muted-foreground border-border hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                    }`}
                                    aria-label="Upvote"
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <span
                                    className={`text-xs font-semibold tabular-nums ${
                                        post.user_vote === "upvote"
                                            ? "text-green-600"
                                            : post.user_vote === "downvote"
                                              ? "text-red-500"
                                              : "text-card-foreground"
                                    }`}
                                >
                                    {post.vote_score}
                                </span>
                                <button
                                    onClick={() =>
                                        voteMutation.mutate("downvote")
                                    }
                                    disabled={voteMutation.isPending}
                                    className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors text-xs ${
                                        post.user_vote === "downvote"
                                            ? "bg-red-50 text-red-500 border-red-300"
                                            : "bg-card text-muted-foreground border-border hover:bg-red-50 hover:text-red-500 hover:border-red-300"
                                    }`}
                                    aria-label="Downvote"
                                >
                                    <ChevronDown size={14} />
                                </button>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-semibold leading-snug text-foreground">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap mt-2.5 text-xs text-muted-foreground">
                                    <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
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
                                    <span className="ml-auto">
                                        <PostMenu
                                            postId={post.id}
                                            postTitle={post.title}
                                            authorId={post.user.id}
                                            authorUsername={post.user.username}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 bg-gray-50">
                        <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
                            {post.body}
                        </div>

                        <div className="flex gap-2 flex-wrap mt-6 pt-5 border-t border-border">
                            <div ref={shareRef} className="relative">
                                <button
                                    onClick={() => setShareOpen(!shareOpen)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                                        copied
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Share2 size={13} />
                                    {copied ? "Tersalin!" : "Bagikan"}
                                </button>
                                {shareOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                                        <div className="py-1">
                                            <button
                                                onClick={sharePost}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-card-foreground hover:bg-accent transition-colors"
                                            >
                                                <Link2 size={13} />
                                                Salin tautan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => bookmarkMutation.mutate()}
                                disabled={bookmarkMutation.isPending}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                                    post.is_bookmarked
                                        ? "bg-amber-50 border-amber-200 text-amber-600"
                                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                <Bookmark
                                    size={13}
                                    className={
                                        post.is_bookmarked
                                            ? "fill-amber-500"
                                            : ""
                                    }
                                />
                                {post.is_bookmarked ? "Tersimpan" : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={commentsRef}
                    className="bg-gray-50 border border-border rounded-2xl shadow-sm"
                >
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
                        <MessageCircle size={16} className="text-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                            Komentar
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                {post.comments_count}
                            </span>
                        </div>

                    <div className="px-6 py-4 border-b border-border bg-muted/20">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                {currentUser
                                    ? getInitials(currentUser.username)
                                    : "?"}
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <textarea
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleCommentSubmit();
                                        }
                                    }}
                                    placeholder="Tulis komentar atau jawaban... "
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition placeholder:text-muted-foreground"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCommentSubmit}
                                        disabled={
                                            createComment.isPending ||
                                            !newComment.trim()
                                        }
                                        className="px-4 py-2 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                                    >
                                        {createComment.isPending ? (
                                            <Loader2
                                                size={12}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Send size={12} />
                                        )}
                                        Kirim Komentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {commentsLoading ? (
                        <div className="divide-y divide-border">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="px-6 py-5 animate-pulse"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-muted rounded w-1/4" />
                                            <div className="h-3 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : comments && comments.length === 0 ? (
                        <div className="text-center py-14 text-muted-foreground">
                            <MessageCircle
                                size={28}
                                className="mx-auto mb-2 opacity-25"
                            />
                            <p className="text-sm">
                                Belum ada komentar. Jadilah yang pertama!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {(comments ?? []).map((comment) => (
                                <div key={comment.id} className="px-6 py-1">
                                    <CommentItem
                                        comment={comment}
                                        postId={post.id}
                                        postAuthorId={post.user.id}
                                        currentUserId={currentUserId}
                                        currentUserRoles={currentUserRoles}
                                        acceptedAnswerId={
                                            post.accepted_answer_id
                                        }
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
