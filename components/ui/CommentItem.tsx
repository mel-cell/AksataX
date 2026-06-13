"use client";

import { useState } from "react";
import {
  Heart,
  Reply,
  Ban,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Comment } from "@/types/comment";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  useCreateComment,
  useGetReplies,
  useLikeComment,
  useBanComment,
  useDeleteComment,
} from "@/hooks/use-comments";
import type { Role } from "@/types/user";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  currentUserRoles?: Role[];
  acceptedAnswerId?: string | null;
  depth?: number;
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function getRoleColor(roles?: Role[]) {
  if (!roles?.length) return "bg-violet-100 text-violet-800";
  const names = roles.map((r) => r.name.toLowerCase());
  if (names.includes("admin")) return "bg-amber-100 text-amber-800";
  if (names.includes("moderator")) return "bg-emerald-100 text-emerald-800";
  return "bg-violet-100 text-violet-800";
}

function getRoleBadge(roles?: Role[]) {
  if (!roles?.length) return null;
  const names = roles.map((r) => r.name.toLowerCase());
  if (names.includes("admin"))
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
        Admin
      </span>
    );
  if (names.includes("moderator"))
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
        Moderator
      </span>
    );
  return null;
}

export function CommentItem({
  comment,
  postId,
  postAuthorId,
  currentUserId,
  currentUserRoles = [],
  acceptedAnswerId,
  depth = 0,
}: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");

  const isAccepted = comment.id === acceptedAnswerId;
  const isOwner = currentUserId === comment.user.id;
  const isPostAuthor = currentUserId === postAuthorId;
  const isMod = currentUserRoles.some((r) =>
    ["admin", "moderator"].includes(r.name.toLowerCase())
  );
  const canBan = isMod && !isOwner;
  const canDelete = isOwner || isMod;
  const canAccept = isPostAuthor && depth === 0;

  const likeMutation = useLikeComment();
  const banMutation = useBanComment();
  const deleteMutation = useDeleteComment();
  const createComment = useCreateComment();
  const repliesQuery = useGetReplies(comment.id, showReplies);

  const replies = repliesQuery.data ?? [];
  const replyCount = comment.replies_count ?? 0;

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  function handleReplySubmit() {
    if (!replyText.trim()) return;
    createComment.mutate(
      { postId, body: replyText, parent_id: comment.id },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyBox(false);
          setShowReplies(true);
        },
      }
    );
  }

  function handleBanSubmit() {
    banMutation.mutate(
      { id: comment.id, reason: banReason },
      { onSuccess: () => setShowBanModal(false) }
    );
  }

  return (
    <div className={depth > 0 ? "pl-4 border-l border-border" : ""}>
      <div
        className={`py-4 ${
          isAccepted
            ? "bg-emerald-50 rounded-lg px-3 -mx-3 border border-emerald-200"
            : ""
        }`}
      >
        {isAccepted && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-2">
            <CheckCircle2 size={13} />
            Jawaban diterima
          </div>
        )}

        {/* Konten komentar */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${getRoleColor(comment.user.roles)}`}
          >
            {getInitials(comment.user.username)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header: nama + badge + waktu */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-sm font-semibold text-foreground">
                {comment.user.username}
              </span>
              {getRoleBadge(comment.user.roles)}
              <span className="text-xs text-muted-foreground ml-auto">
                {timeAgo}
              </span>
            </div>

            {/* Isi komentar */}
            <p className="text-sm text-foreground leading-relaxed">
              {comment.body}
            </p>

            {/* Action row */}
            <div className="flex items-center gap-1 mt-2.5 flex-wrap -ml-1">
              {/* Like */}
              <button
                onClick={() => likeMutation.mutate(comment.id)}
                disabled={likeMutation.isPending}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  comment.user_liked
                    ? "bg-rose-50 text-rose-500"
                    : "text-muted-foreground hover:bg-muted hover:text-rose-500"
                }`}
              >
                <Heart
                  size={13}
                  className={comment.user_liked ? "fill-rose-500" : ""}
                />
                {comment.like_count > 0 && (
                  <span>{comment.like_count}</span>
                )}
                Suka
              </button>

              {/* Balas — hanya depth 0 */}
              {depth === 0 && (
                <button
                  onClick={() => setShowReplyBox((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted hover:text-indigo-600 transition-colors"
                >
                  <Reply size={13} />
                  Balas
                </button>
              )}

              {/* Terima jawaban */}
              {canAccept && (
                <button
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    isAccepted
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-muted-foreground hover:bg-muted hover:text-emerald-600"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  {isAccepted ? "Diterima" : "Terima jawaban"}
                </button>
              )}

              {/* Ban */}
              {canBan && (
                <button
                  onClick={() => setShowBanModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Ban size={13} />
                  Ban
                </button>
              )}

              {/* Hapus */}
              {canDelete && (
                <button
                  onClick={() => deleteMutation.mutate(comment.id)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input balas */}
      {showReplyBox && (
        <div className="flex gap-2 items-start mt-1 mb-3 pl-11">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas komentar ${comment.user.username}...`}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition placeholder:text-muted-foreground"
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={handleReplySubmit}
              disabled={createComment.isPending || !replyText.trim()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              {createComment.isPending && (
                <Loader2 size={12} className="animate-spin" />
              )}
              Kirim
            </button>
            <button
              onClick={() => {
                setShowReplyBox(false);
                setReplyText("");
              }}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Toggle lihat balasan */}
      {replyCount > 0 && depth === 0 && (
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="ml-11 mb-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ChevronRight
            size={14}
            className={`transition-transform ${showReplies ? "rotate-90" : ""}`}
          />
          {showReplies ? "Sembunyikan balasan" : `Lihat ${replyCount} balasan`}
        </button>
      )}

      {/* Daftar replies */}
      {showReplies && (
        <div className="ml-11 mt-1">
          {repliesQuery.isLoading ? (
            <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
              <Loader2 size={13} className="animate-spin" />
              Memuat balasan...
            </div>
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                postAuthorId={postAuthorId}
                currentUserId={currentUserId}
                currentUserRoles={currentUserRoles}
                acceptedAnswerId={acceptedAnswerId}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}

      {/* Modal ban */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Ban komentar
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Komentar dari{" "}
              <span className="font-medium">{comment.user.username}</span> akan
              disembunyikan dari publik.
            </p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Alasan ban (opsional)"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition placeholder:text-muted-foreground mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleBanSubmit}
                disabled={banMutation.isPending}
                className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {banMutation.isPending && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                Konfirmasi Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}