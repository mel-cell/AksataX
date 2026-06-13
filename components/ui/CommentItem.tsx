"use client";

import { useState } from "react";
import {
  Reply,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Flag,
  EyeOff,
} from "lucide-react";
import type { Comment } from "@/types/comment";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import {
  useCreateComment,
  useLikeComment,
  useDeleteComment,
} from "@/hooks/use-comments";
import { useCreateReport } from "@/hooks/use-reports";
import { useModerateComment } from "@/hooks/use-moderate-comment";
import { api } from "@/lib/api";
import type { Role } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";

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
  if (!roles?.length) return "bg-zinc-100 text-zinc-600";
  const names = roles.map((r) => r.name.toLowerCase());
  if (names.includes("admin")) return "bg-amber-100 text-amber-800";
  if (names.includes("moderator")) return "bg-emerald-100 text-emerald-800";
  return "bg-zinc-100 text-zinc-600";
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
  const queryClient = useQueryClient();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  const [showModerateModal, setShowModerateModal] = useState(false);
  const [moderateReason, setModerateReason] = useState("");

  const isAccepted = comment.id === acceptedAnswerId;
  const isOwner = currentUserId === comment.user.id;
  const isPostAuthor = currentUserId === postAuthorId;
  const isMod = currentUserRoles.some((r) =>
    ["admin", "moderator"].includes(r.name.toLowerCase())
  );
  const isLoggedIn = !!currentUserId;
  const canDelete = isOwner || isMod;
  const canAccept = isPostAuthor && depth === 0;
  const canReport = isLoggedIn && !isOwner && !isMod;

  const likeMutation = useLikeComment();
  const deleteMutation = useDeleteComment();
  const createComment = useCreateComment();
  const createReport = useCreateReport();
  const moderateComment = useModerateComment();

  const replies = comment.replies ?? [];

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

  function handleAcceptAnswer() {
    api.patch(`/posts/${postId}/accept/${comment.id}`).then(() => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    });
  }

  function handleReport() {
    createReport.mutate(
      {
        target_id: comment.id,
        target_type: "comment",
        reason: reportReason,
        description: reportDescription || undefined,
      },
      {
        onSuccess: () => {
          setReportSuccess(true);
        },
      }
    );
  }

  function handleModerate(action: "hide" | "restore") {
    moderateComment.mutate(
      { commentId: comment.id, action, reason: action === "hide" ? moderateReason : undefined },
      {
        onSuccess: () => {
          setShowModerateModal(false);
          setModerateReason("");
        },
      }
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

        <div className="flex gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${getRoleColor(comment.user.roles)}`}
          >
            {getInitials(comment.user.username)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-sm font-semibold text-foreground">
                {comment.user.username}
              </span>
              {getRoleBadge(comment.user.roles)}
              <span className="text-xs text-muted-foreground ml-auto">
                {timeAgo}
              </span>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {comment.body}
            </p>

            <div className="flex items-center gap-1 mt-2.5 flex-wrap -ml-1">
              {depth === 0 && (
                <button
                  onClick={() => setShowReplyBox((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Reply size={13} />
                  Balas
                </button>
              )}

              {canAccept && (
                <button
                  onClick={handleAcceptAnswer}
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

              {isMod && (
                <button
                  onClick={() => setShowModerateModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <EyeOff size={13} />
                  Sembunyikan
                </button>
              )}

              {canReport && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Flag size={13} />
                  Laporkan
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => deleteMutation.mutate({ id: comment.id, postId })}
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

      {showReplyBox && (
        <div className="flex gap-2 items-start mt-1 mb-3 pl-11">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas komentar ${comment.user.username}...`}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition placeholder:text-muted-foreground"
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={handleReplySubmit}
              disabled={createComment.isPending || !replyText.trim()}
              className="px-3 py-1.5 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
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

      {replyCount > 0 && depth === 0 && (
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="ml-11 mb-2 inline-flex items-center gap-1 text-xs text-brand hover:text-brand/80 font-medium"
        >
          <ChevronRight
            size={14}
            className={`transition-transform ${showReplies ? "rotate-90" : ""}`}
          />
          {showReplies ? "Sembunyikan balasan" : `Lihat ${replyCount} balasan`}
        </button>
      )}

      {showReplies && (
        <div className="ml-11 mt-1">
          {replies.map((reply) => (
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
          ))}
        </div>
      )}

      {showReportModal && !reportSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-1">Laporkan komentar</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Laporkan komentar dari {comment.user.username}
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition mb-3"
            >
              <option value="">Pilih alasan</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Konten tidak pantas</option>
              <option value="harassment">Pelecehan</option>
              <option value="misinformation">Informasi palsu</option>
              <option value="other">Lainnya</option>
            </select>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Penjelasan tambahan (opsional)"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition placeholder:text-muted-foreground mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReport}
                disabled={createReport.isPending || !reportReason}
                className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {createReport.isPending && <Loader2 size={12} className="animate-spin" />}
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && reportSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl text-center">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Laporan terkirim</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Komentar dari {comment.user.username} berhasil dilaporkan. Tim kami akan meninjau laporan Anda dalam waktu 1×24 jam.
            </p>
            <button
              onClick={() => { setShowReportModal(false); setReportSuccess(false); setReportReason(""); setReportDescription(""); }}
              className="px-4 py-2 text-xs bg-brand hover:opacity-90 text-white rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showModerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-1">Sembunyikan Komentar</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Komentar dari {comment.user.username}
            </p>
            <textarea
              value={moderateReason}
              onChange={(e) => setModerateReason(e.target.value)}
              placeholder="Alasan komentar ini disembunyikan..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition placeholder:text-muted-foreground mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowModerateModal(false); setModerateReason(""); }}
                className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleModerate("hide")}
                disabled={moderateComment.isPending || !moderateReason.trim()}
                className="px-3 py-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {moderateComment.isPending && <Loader2 size={12} className="animate-spin" />}
                Sembunyikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
