"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Flag, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-auth";
import { postService } from "@/lib/services/post-service";
import { useCreateReport } from "@/hooks/use-reports";
import { useModeratePost } from "@/hooks/use-moderate-post";
import { ModeratePostModal } from "@/components/ui/ModeratePostModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostMenuProps {
  postId: string;
  postTitle: string;
  authorId: string;
  authorUsername: string;
}

export default function PostMenu({ postId, postTitle, authorId, authorUsername }: PostMenuProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showModerateModal, setShowModerateModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useUser();
  const createReport = useCreateReport();
  const moderatePost = useModeratePost();

  const isOwner = currentUser?.id === authorId;
  const isMod = currentUser?.roles?.some((r) =>
    ["admin", "moderator"].includes(r.name.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
  });

  function handleDelete() {
    deleteMutation.mutate();
  }

  function handleReport() {
    createReport.mutate(
      {
        target_id: postId,
        target_type: "post",
        reason: reportReason,
        description: reportDescription || undefined,
      },
      {
        onSuccess: () => {
          setReportSuccess(true);
        },
      },
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-accent transition-colors"
        aria-label="Menu postingan"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {isMod && (
            <button
              onClick={() => { setShowModerateModal(true); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
            >
              <EyeOff size={14} />
              Sembunyikan
            </button>
          )}
          {isOwner ? (
            <>
              <Link
                href={`/posts/${postId}/edit`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
              >
                <Pencil size={14} />
                Edit
              </Link>
              <button
                onClick={() => { setShowDeleteConfirm(true); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </>
          ) : (
            <button
              onClick={() => { setShowReportModal(true); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors w-full text-left"
            >
              <Flag size={14} />
              Laporkan
            </button>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-1">Hapus postingan</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && !reportSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-5 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-1">Laporkan postingan</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Laporkan postingan &ldquo;{postTitle}&rdquo; dari {authorUsername}
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
              Postingan &ldquo;{postTitle}&rdquo; dari {authorUsername} berhasil dilaporkan.
              Tim kami akan meninjau laporan Anda dalam waktu 1×24 jam.
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

      <ModeratePostModal
        postId={postId}
        postTitle={postTitle}
        open={showModerateModal}
        onClose={() => setShowModerateModal(false)}
        onSubmit={(reason) => {
          moderatePost.mutate(
            { postId, action: "hide", reason },
            { onSuccess: () => setShowModerateModal(false) },
          );
        }}
        isPending={moderatePost.isPending}
      />
    </div>
  );
}
