"use client";

import { useState } from "react";
import { Loader2, MessageCircleWarning, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isPending: boolean;
}

export function PostAppealModal({ open, onClose, onSubmit, isPending }: Props) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim());
    setReason("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <MessageCircleWarning size={20} />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-card-foreground">
                  Ajukan Banding
                </Dialog.Title>
                <p className="text-sm text-muted-foreground">Postinganmu akan ditinjau moderator</p>
              </div>
            </div>
            <Dialog.Close className="text-muted-foreground hover:text-card-foreground transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Alasan banding
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan mengapa postinganmu seharusnya ditampilkan kembali..."
                rows={3}
                required
                className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending || !reason.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                Kirim Banding
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-card-foreground transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
