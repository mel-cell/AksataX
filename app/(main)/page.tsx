"use client";

import { useState } from "react";
import { ImageIcon, FileText, Smile, MoreHorizontal } from "lucide-react";
import PostCard from "@/components/posts/post-card";
import RightPanel from "@/components/posts/RightPanel";
import { usePosts } from "@/hooks/use-posts";

// Dummy user — ganti dengan session/auth yang sudah ada
const CURRENT_USER = {
  name: "Muhammad King Nasir",
  username: "kingnasir17",
  avatar_url: null as string | null,
};

function ComposeAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
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
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand flex-shrink-0">
      {initials}
    </div>
  );
}

function ComposeBox() {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    // TODO: panggil API create post
    console.log("post:", text);
    setText("");
    setFocused(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex gap-3">
        <ComposeAvatar name={CURRENT_USER.name} avatarUrl={CURRENT_USER.avatar_url} />
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Apa yang sedang kamu pikirkan?"
            rows={focused ? 3 : 1}
            className="w-full bg-transparent text-sm text-card-foreground placeholder-muted-foreground resize-none outline-none leading-relaxed py-1.5 transition-all"
          />

          {focused && <div className="border-t border-border mb-2" />}

          <div className="flex items-center gap-3 mt-1">
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Unggah gambar"
            >
              <ImageIcon size={17} />
            </button>
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Unggah artikel"
            >
              <FileText size={17} />
            </button>
            <button
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Tambah emoji"
            >
              <Smile size={17} />
            </button>

            <div className="flex-1" />

            {focused && (
              <span className={`text-xs tabular-nums ${text.length > 260 ? "text-destructive" : "text-muted-foreground"}`}>
                {text.length}/280
              </span>
            )}

            <button
              onClick={handlePost}
              disabled={!text.trim() || text.length > 280}
              className="px-4 py-1.5 rounded-full bg-brand hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
            >
              Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeedPage() {
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Feed tengah */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-foreground mb-4">Beranda</h1>

          <ComposeBox />

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-4 animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-muted-foreground text-sm">Belum ada postingan.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Jadilah yang pertama posting sesuatu!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Panel kanan — sembunyikan di mobile */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}