"use client";

import { TriangleAlert } from "lucide-react";
import type { ModerationLog } from "@/types/moderation";

interface Props {
  moderation: ModerationLog;
  isOwner?: boolean;
  onAppeal?: () => void;
}

export function PostModerationBanner({ moderation, isOwner, onAppeal }: Props) {
  if (moderation.action === "restore") return null;

  return (
    <div className="px-6 pt-6">
      <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <TriangleAlert size={18} className="text-rose-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-rose-700">Postingan tidak ditampilkan ke publik</p>
          {moderation.reason && (
            <p className="text-sm text-rose-600 mt-0.5">Alasan: {moderation.reason}</p>
          )}
          <p className="text-xs text-rose-500 mt-1">
            Dimoderasi oleh @{moderation.moderator.username}
          </p>
          {isOwner && onAppeal && (
            <button
              onClick={onAppeal}
              className="mt-2 text-xs font-medium text-rose-600 underline underline-offset-2 hover:text-rose-700 transition-colors"
            >
              Ajukan Banding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
