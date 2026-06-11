"use client";

import { CheckCheck, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale/id";
import { getToken } from "@/hooks/use-auth";
import {
    useNotifications,
    useUnreadCount,
    useMarkRead,
    useMarkAllRead,
    useDeleteNotification,
    useDeleteAllNotifications,
} from "@/hooks/use-notifications";

function notificationLabel(type: string) {
    const map: Record<string, string> = {
        reply: "membalas postinganmu",
        like: "menyukai postinganmu",
        upvote: "memberi upvote",
        follow: "mengikutimu",
        answer_accepted: "menerima jawabanmu",
    };
    return map[type] || type;
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
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1C1917]">
                        Notifikasi
                    </h1>
                    {unread && (
                        <p className="mt-1 text-xs text-[#A8A29E]">
                            {unread.unread_count} belum dibaca
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => markAllRead.mutate()}
                        disabled={markAllRead.isPending}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E7E5E4] px-3 py-2 text-xs font-medium text-[#78716C] hover:bg-[#FAFAF9] transition-colors disabled:opacity-50"
                    >
                        <CheckCheck size={14} />
                        Baca Semua
                    </button>
                    <button
                        onClick={() => deleteAll.mutate()}
                        disabled={deleteAll.isPending}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E7E5E4] px-3 py-2 text-xs font-medium text-red-500 hover:bg-[#FAFAF9] transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        Hapus Semua
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20 text-[#A8A29E]">
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
                    <p className="text-lg font-medium text-[#1C1917]">
                        Belum masuk akun
                    </p>
                    <p className="mt-1 mb-4 text-base text-[#A8A29E]">
                        Masuk dulu untuk melihat notifikasi
                    </p>
                    <Link
                        href="/login"
                        className="rounded-sm bg-[#1C1917] px-5 py-2 text-xs font-medium text-[#FAFAF9] transition hover:bg-[#292524]"
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
                    <p className="text-lg font-medium text-[#1C1917]">
                        Tidak ada notifikasi yang masuk
                    </p>
                    <p className="mt-1 text-base text-[#A8A29E]">
                        Kamu akan mendapat notifikasi saat ada yang berinteraksi
                        dengan postinganmu
                    </p>
                </div>
            )}

            {notifications && notifications.length > 0 && (
                <div className="space-y-1">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                notif.read_at
                                    ? "border-[#E7E5E4] bg-white"
                                    : "border-[#1C1917]/10 bg-[#FAFAF9]"
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#1C1917]">
                                    <span className="font-medium">
                                        {notificationLabel(notif.type)}
                                    </span>
                                </p>
                                <p className="mt-0.5 text-xs text-[#A8A29E]">
                                    {formatDistanceToNow(
                                        new Date(notif.created_at),
                                        { addSuffix: true, locale: id },
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {!notif.read_at && (
                                    <button
                                        onClick={() =>
                                            markRead.mutate(notif.id)
                                        }
                                        disabled={markRead.isPending}
                                        className="rounded-lg p-1.5 text-[#A8A29E] hover:bg-[#F5F5F4] hover:text-[#1C1917] transition-colors"
                                        title="Tandai dibaca"
                                    >
                                        <CheckCheck size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotif.mutate(notif.id)}
                                    disabled={deleteNotif.isPending}
                                    className="rounded-lg p-1.5 text-[#A8A29E] hover:bg-[#F5F5F4] hover:text-red-500 transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
