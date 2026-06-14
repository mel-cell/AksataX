"use client";

import { CheckCheck, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getToken } from "@/hooks/use-auth";
import {
    useNotifications,
    useUnreadCount,
    useMarkRead,
    useMarkAllRead,
    useDeleteNotification,
    useDeleteAllNotifications,
} from "@/hooks/use-notifications";
import type { Notification } from "@/types/notification";

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

function formatFullDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (now.getTime() - d.getTime() < 7 * 86400000) return formatTime(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function notifMessage(notif: Notification): { text: string; href: string | null } {
  const { data } = notif;
  const actor = data.actor_username ?? "Seseorang";

  switch (data.type) {
    case "vote":
      return {
        text: `${actor} memberi ${data.vote_type === "downvote" ? "downvote" : "upvote"} pada postingan Anda`,
        href: data.reference_id ? `/posts/${data.reference_id}` : null,
      };
    case "comment":
      return {
        text: `${actor} berkomentar pada postingan Anda`,
        href: data.reference_id ? `/posts/${data.reference_id}` : null,
      };
    case "follow":
      return {
        text: `${actor} mulai mengikuti Anda`,
        href: data.actor_username ? `/user/${data.actor_username}` : null,
      };
    case "answer_accepted":
      return {
        text: `${actor} menerima jawaban Anda`,
        href: data.reference_id ? `/posts/${data.reference_id}` : null,
      };
    case "report_resolved":
      return {
        text: data.outcome === "dismissed"
          ? "Laporan Anda tidak dapat ditindaklanjuti"
          : "Laporan Anda telah diproses, konten disembunyikan",
        href: null,
      };
    case "content_moderated":
      return {
        text: `${data.action === "hide" ? "Konten" : "Postingan"} Anda telah ${data.action === "hide" ? "disembunyikan" : "dipulihkan"} oleh moderator`,
        href: null,
      };
    case "user_status":
      return {
        text: data.action === "warned"
          ? `Anda mendapat peringatan: ${data.reason ?? ""}`
          : `Akun Anda telah dikenakan sanksi: ${data.action === "shadow_banned" ? "Shadow Ban" : data.action ?? "status berubah"}`,
        href: null,
      };
    case "report_created":
      return {
        text: `Laporan baru dari ${actor}: ${data.reason ?? ""}`,
        href: null,
      };
    case "post_appeal":
      return {
        text: `${actor} mengajukan banding untuk postingan "${data.post_title ?? ""}"`,
        href: null,
      };
    default:
      return {
        text: data.message ?? `${actor} melakukan interaksi`,
        href: data.reference_id ? `/posts/${data.reference_id}` : null,
      };
  }
}

export default function NotificationsPage() {
  const [isAuth, setIsAuth] = useState(false);
  const { data: notifications, isLoading, error } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const deleteNotif = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Notifikasi</h1>
          {unread && (
            <p className="mt-1 text-sm text-muted-foreground">
              {unread.unread_count} belum dibaca
            </p>
          )}
        </div>

        {isAuth && notifications && notifications.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <CheckCheck size={14} />
              Baca Semua
            </button>
            <button
              onClick={() => deleteAll.mutate()}
              disabled={deleteAll.isPending}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-red-500 hover:bg-accent transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Memuat notifikasi...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">
          Gagal memuat notifikasi.
        </div>
      )}

      {!isAuth && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <Image
              src="/catontea.svg"
              alt="Notifikasi"
              width={400}
              height={400}
              className="mix-blend-multiply"
            />
          </div>
          <p className="text-lg font-medium text-card-foreground">
            Belum masuk akun
          </p>
          <p className="mt-1 mb-4 text-base text-muted-foreground">
            Masuk dulu untuk melihat notifikasi
          </p>
          <Link
            href="/login"
            className="rounded-sm bg-[#1C1917] px-5 py-2 text-sm font-medium text-[#FAFAF9] transition hover:bg-[#292524]"
          >
            Masuk
          </Link>
        </div>
      )}

      {isAuth && notifications && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <Image
              src="/catontea.svg"
              alt="Tidak ada notifikasi"
              width={400}
              height={400}
              className="mix-blend-multiply"
            />
          </div>
          <p className="text-lg font-medium text-card-foreground">
            Tidak ada notifikasi yang masuk
          </p>
          <p className="mt-1 text-base text-muted-foreground">
            Kamu akan mendapat notifikasi saat ada yang berinteraksi dengan
            postinganmu
          </p>
        </div>
      )}

      {isAuth && notifications && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const { text, href } = notifMessage(notif);
            const avatarUrl = notif.data.actor_avatar_url;
            const initial = notif.data.actor_username?.[0]?.toUpperCase() ?? "?";

            const card = (
              <div
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  notif.read_at
                    ? "border-border bg-card"
                    : "border-brand/20 bg-brand/[0.03]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand shrink-0 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground leading-snug">{text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatFullDate(notif.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read_at && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markRead.mutate(notif.id);
                      }}
                      disabled={markRead.isPending}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-card-foreground transition-colors"
                      title="Tandai dibaca"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteNotif.mutate(notif.id);
                    }}
                    disabled={deleteNotif.isPending}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );

            if (href) {
              return (
                <Link key={notif.id} href={href} className="block">
                  {card}
                </Link>
              );
            }
            return <div key={notif.id}>{card}</div>;
          })}
        </div>
      )}
    </div>
  );
}
