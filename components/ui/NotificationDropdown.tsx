"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications, useUnreadCount, useMarkAllRead } from "@/hooks/use-notifications";
import type { Notification, NotificationData } from "@/types/notification";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}h`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function notifMessage(data: NotificationData): string {
  const actor = data.actor_username ?? "Seseorang";
  switch (data.type) {
    case "vote":
      return `${actor} memberi ${data.vote_type === "downvote" ? "downvote" : "upvote"} pada postingan Anda`;
    case "comment":
      return `${actor} berkomentar pada postingan Anda`;
    case "follow":
      return `${actor} mulai mengikuti Anda`;
    case "accepted_answer":
      return `${actor} menerima jawaban Anda`;
    case "report":
      return `Laporan Anda telah diproses`;
    default:
      return data.message ?? `${actor} melakukan interaksi`;
  }
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: notifications, isLoading } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markAllRead = useMarkAllRead();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = unread?.unread_count ?? 0;
  const latest = (notifications ?? []).slice(0, 10);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full min-w-4 text-center leading-tight">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-card-foreground">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="flex items-center gap-1 text-xs text-brand hover:underline disabled:opacity-50"
              >
                <CheckCheck size={13} />
                {markAllRead.isPending ? "..." : "Baca semua"}
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 size={16} className="animate-spin mr-2" />
                <span className="text-xs">Memuat...</span>
              </div>
            )}

            {!isLoading && latest.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Belum ada notifikasi
              </div>
            )}

            {!isLoading && latest.map((notif) => (
              <NotifItem key={notif.id} notif={notif} />
            ))}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-xs text-brand font-medium py-3 border-t border-border hover:bg-sidebar-accent transition-colors"
          >
            Lihat semua notifikasi
          </Link>
        </div>
      )}
    </div>
  );
}

function NotifItem({ notif }: { notif: Notification }) {
  const actorAvatar = notif.data.actor_avatar_url;
  const actorInitial = notif.data.actor_username?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 hover:bg-sidebar-accent transition-colors cursor-pointer ${
        !notif.read_at ? "bg-brand/[0.03]" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-xs font-semibold text-brand shrink-0 overflow-hidden">
        {actorAvatar ? (
          <img src={actorAvatar} alt="" className="w-full h-full object-cover" />
        ) : (
          actorInitial
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-card-foreground leading-snug">
          {notifMessage(notif.data)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {formatTime(notif.created_at)}
        </p>
      </div>
      {!notif.read_at && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
      )}
    </div>
  );
}
