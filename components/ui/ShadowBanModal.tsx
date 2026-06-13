"use client";

import { useState } from "react";
import { Loader2, TriangleAlert, X } from "lucide-react";
import { useShadowBan, type ShadowBanPayload } from "@/hooks/use-shadow-ban";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  userId: string;
  username: string;
  open: boolean;
  onClose: () => void;
}

export function ShadowBanModal({ userId, username, open, onClose }: Props) {
  const shadowBan = useShadowBan();
  const [reason, setReason] = useState("");
  const [reputationPenalty, setReputationPenalty] = useState(50);
  const [restrictionType, setRestrictionType] = useState<ShadowBanPayload["restriction_type"]>("both");
  const [restrictionDuration, setRestrictionDuration] = useState(24);
  const [durationUnit, setDurationUnit] = useState<"hours" | "days">("hours");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const durationInHours = durationUnit === "days" ? restrictionDuration * 24 : restrictionDuration;

    await shadowBan.mutateAsync({
      userId,
      reputation_penalty: reputationPenalty,
      restriction_type: restrictionType,
      restriction_duration: durationInHours,
      reason: reason.trim(),
    });

    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <TriangleAlert size={20} />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-card-foreground">
                  Shadow Ban
                </Dialog.Title>
                <p className="text-sm text-muted-foreground">@{username}</p>
              </div>
            </div>
            <Dialog.Close className="text-muted-foreground hover:text-card-foreground transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Alasan
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Alasan shadow ban..."
                rows={2}
                required
                className="w-full resize-none rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Penalti Reputasi
                </label>
                <input
                  type="number"
                  min={0}
                  value={reputationPenalty}
                  onChange={(e) => setReputationPenalty(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Durasi
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min={1}
                    value={restrictionDuration}
                    onChange={(e) => setRestrictionDuration(Number(e.target.value))}
                    className="w-16 rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as "hours" | "days")}
                    className="flex-1 rounded-xl border border-border bg-background text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition"
                  >
                    <option value="hours">Jam</option>
                    <option value="days">Hari</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Pembatasan
              </label>
              <select
                value={restrictionType}
                onChange={(e) => setRestrictionType(e.target.value as ShadowBanPayload["restriction_type"])}
                className="w-full rounded-xl border border-border bg-background text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition"
              >
                <option value="post">Tidak bisa membuat postingan</option>
                <option value="comment">Tidak bisa berkomentar</option>
                <option value="both">Tidak bisa posting & komentar</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={shadowBan.isPending || !reason.trim()}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                {shadowBan.isPending && <Loader2 size={14} className="animate-spin" />}
                Terapkan Shadow Ban
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
