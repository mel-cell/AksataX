"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { UserPlus, UserCheck } from "lucide-react";
import type { ApiResponse } from "@/types/api";
import type { Post } from "@/types/post";

interface TagData {
  id: string;
  name: string;
  slug: string;
  color: string;
  posts_count?: number;
}

function FollowUserRow({ user }: { user: Post["user"] }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const { data } = await api.post(`/users/${user.id}/follow`);
      setFollowing(data?.data?.followed ?? data?.data?.is_following ?? !following);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={`/user/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <UserAvatar name={user.username} avatarUrl={user.avatar_url} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-card-foreground truncate">{user.username}</p>
        </div>
      </Link>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
          following
            ? "border-sidebar-border text-muted-foreground"
            : "border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
        }`}
      >
        {loading ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : following ? (
          <UserCheck size={13} />
        ) : (
          <UserPlus size={13} />
        )}
        {following ? "Mengikuti" : "Ikuti"}
      </button>
    </div>
  );
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 flex-shrink-0">
      {initials}
    </div>
  );
}

export default function RightPanel() {
  const { data: tags } = useQuery<TagData[]>({
    queryKey: ["tags-popular"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TagData[]>>("/tags");
      return data.data ?? [];
    },
  });

  const { data: recentPosts } = useQuery<Post[]>({
    queryKey: ["recent-posts"],
    queryFn: async () => {
      const { data } = await api.get("/posts", {
        params: { sort: "created_at", order: "desc", per_page: 30 },
      });
      return (data.data ?? []) as Post[];
    },
  });

  const recommendedUsers = useMemo(() => {
    if (!recentPosts) return [];
    const seen = new Set<string>();
    const users = recentPosts
      .filter((p) => {
        const isAdminOrMod =
          p.user.username === "admin" ||
          p.user.username === "moderator" ||
          p.user.roles?.some(
            (r) => r.name.toLowerCase() === "admin" || r.name.toLowerCase() === "moderator",
          );
        if (isAdminOrMod) return false;
        if (seen.has(p.user.id)) return false;
        seen.add(p.user.id);
        return true;
      })
      .map((p) => p.user);
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }
    return users.slice(0, 5);
  }, [recentPosts]);

  const trendingTags = useMemo(() => {
    if (!tags) return [];
    const shuffled = [...tags];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 5);
  }, [tags]);

  return (
    <aside className="flex flex-col gap-4 w-full">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-card-foreground">Rekomendasi untukmu</span>
        </div>

        {recommendedUsers.length === 0 && (
          <div className="px-4 py-3 text-xs text-muted-foreground">Memuat rekomendasi...</div>
        )}

        <div className="divide-y divide-border">
          {recommendedUsers.map((user) => (
            <FollowUserRow key={user.id} user={user} />
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-card-foreground">Topik populer</span>
          <Link
            href="/topics"
            className="text-xs text-brand hover:underline transition-colors"
          >
            Lihat semua
          </Link>
        </div>

        <div className="divide-y divide-border">
          {trendingTags.length === 0 && (
            <div className="px-4 py-3 text-xs text-muted-foreground">Memuat topik...</div>
          )}
          {trendingTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?tag=${tag.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-sidebar-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-card-foreground truncate">#{tag.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tag.posts_count ?? 0} postingan
                </p>
              </div>
              <span className="text-xs text-brand shrink-0">Lihat &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
