"use client";

import { MoreHorizontal } from "lucide-react";

// Ganti dengan fetch dari API
const SUGGESTED_USERS = [
  { id: "1", name: "Cristiano Ronaldo", username: "cristiano07", avatar_url: null },
  { id: "2", name: "Lionel Messi", username: "LionelI0", avatar_url: null },
  { id: "3", name: "Neymar Junior", username: "neyjunior11", avatar_url: null },
];

const TRENDING_TOPICS = [
  { id: "1", tag: "KaburAjaDulu", count: "12,5 rb" },
  { id: "2", tag: "KopstudAjaDulu", count: "9,1 rb" },
  { id: "3", tag: "Aksata", count: "8,9 rb" },
  { id: "4", tag: "Throwback", count: "8,7 rb" },
  { id: "5", tag: "BerbagiCerita", count: "7,6 rb" },
];

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
    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-xs font-semibold text-brand flex-shrink-0">
      {initials}
    </div>
  );
}

export default function RightPanel() {
  return (
    <aside className="flex flex-col gap-4 w-full">
      {/* Untuk diikuti */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-card-foreground">Untuk diikuti</span>
          <button className="text-xs text-brand hover:underline transition-colors">
            Lihat semua
          </button>
        </div>

        <div className="divide-y divide-border">
          {SUGGESTED_USERS.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar name={user.name} avatarUrl={user.avatar_url} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-full border border-border text-card-foreground hover:bg-sidebar-accent transition-colors flex-shrink-0">
                Ikuti
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Topik populer */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-card-foreground">Topik populer</span>
          <button className="text-xs text-brand hover:underline transition-colors">
            Lihat semua
          </button>
        </div>

        <div className="divide-y divide-border">
          {TRENDING_TOPICS.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between px-4 py-3 hover:bg-sidebar-accent transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-card-foreground">#{topic.tag}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{topic.count} postingan</p>
              </div>
              <button
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}