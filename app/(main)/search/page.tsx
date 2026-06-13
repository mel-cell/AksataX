"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import type { Tag } from "@/types/tag";
import type { Category } from "@/types/category";
import type { ApiResponse } from "@/types/api";
import PostCard from "@/components/posts/PostCard";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import Link from "next/link";
import { Search, Loader2, Hash, FolderOpen } from "lucide-react";

type Tab = "Semua" | "Postingan" | "Pengguna" | "Tag" | "Kategori";
const TABS: Tab[] = ["Semua", "Postingan", "Pengguna", "Tag", "Kategori"];

const TAB_MAP: Record<string, Tab> = {
  tag: "Tag",
  category: "Kategori",
  posts: "Postingan",
  user: "Pengguna",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tagParam = searchParams.get("tag");
  const categoryParam = searchParams.get("category");

  const { data: categories } = useCategories();
  const { data: allTags } = useTags();

  const initialTab = tagParam ? "Tag" : categoryParam ? "Kategori" : "Semua";
  const initialQuery = tagParam
    ? allTags?.find((t: Tag) => t.slug === tagParam)?.name ?? ""
    : categoryParam
      ? categories?.find((c: Category) => c.slug === categoryParam)?.name ?? ""
      : "";

  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (tagParam && allTags) {
      const tag = allTags.find((t: Tag) => t.slug === tagParam);
      if (tag) {
        setQuery(tag.name);
        setDebounced(tag.name);
        setActiveTab("Tag");
      }
    }
  }, [tagParam, allTags]);

  useEffect(() => {
    if (categoryParam && categories) {
      const cat = categories.find((c: Category) => c.slug === categoryParam);
      if (cat) {
        setQuery(cat.name);
        setDebounced(cat.name);
        setActiveTab("Kategori");
      }
    }
  }, [categoryParam, categories]);

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["search-posts", debounced],
    queryFn: async () => {
      if (!debounced.trim()) return [];
      const { data } = await api.get<ApiResponse<Post[]>>("/search/posts", {
        params: { q: debounced, per_page: 30 },
      });
      return data.data ?? [];
    },
    enabled: debounced.trim().length > 0 && (activeTab === "Semua" || activeTab === "Postingan"),
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["search-users", debounced],
    queryFn: async () => {
      if (!debounced.trim()) return [];
      const { data } = await api.get<ApiResponse<User[]>>("/search/users", {
        params: { q: debounced, per_page: 10 },
      });
      return data.data ?? [];
    },
    enabled: debounced.trim().length > 0 && (activeTab === "Semua" || activeTab === "Pengguna"),
  });

  const filteredTags = useMemo(() => {
    if (!debounced.trim() || !allTags) return [];
    const q = debounced.toLowerCase();
    return allTags.filter((t: Tag) => t.name.toLowerCase().includes(q)).slice(0, 10);
  }, [allTags, debounced]);

  const filteredCategories = useMemo(() => {
    if (!debounced.trim() || !categories) return [];
    const q = debounced.toLowerCase();
    return categories.filter((c: Category) => c.name.toLowerCase().includes(q)).slice(0, 10);
  }, [categories, debounced]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = query.trim();
    setDebounced(val);
    if (!val) {
      router.replace("/search");
    }
  };

  const handleTab = (tab: Tab) => {
    setActiveTab(tab);
    router.replace("/search");
  };

  const loading = postsLoading || usersLoading;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Jelajahi</h1>

      <form onSubmit={handleSearch} className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari postingan, pengguna, tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-border bg-card text-card-foreground rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-muted-foreground"
        />
      </form>

      <div className="flex gap-1 bg-sidebar-accent rounded-lg p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {!debounced && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={32} className="mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Masukkan kata kunci untuk mencari</p>
        </div>
      )}

      {debounced && loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          Mencari...
        </div>
      )}

      {debounced && !loading && (
        <div className="space-y-6">
          {(activeTab === "Semua" || activeTab === "Postingan") && posts && posts.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-card-foreground mb-3">
                Postingan {activeTab === "Semua" && `(${posts.length})`}
              </h2>
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === "Semua" || activeTab === "Pengguna") && users && users.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-card-foreground mb-3">
                Pengguna {activeTab === "Semua" && `(${users.length})`}
              </h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/user/${user.username}`}
                    className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:bg-sidebar-accent transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 flex-shrink-0">
                      {user.username?.slice(0, 2).toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.bio || `${user.reputation_points} poin`}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "Semua" || activeTab === "Tag") && filteredTags.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-card-foreground mb-3">
                Tag {activeTab === "Semua" && `(${filteredTags.length})`}
              </h2>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/search?tag=${tag.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-card-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <Hash size={12} />
                    {tag.name}
                    <span className="text-muted-foreground">{tag.posts_count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "Semua" || activeTab === "Kategori") && filteredCategories.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-card-foreground mb-3">
                Kategori {activeTab === "Semua" && `(${filteredCategories.length})`}
              </h2>
              <div className="flex flex-wrap gap-2">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-card-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <FolderOpen size={12} />
                    {cat.name}
                    <span className="text-muted-foreground">{cat.posts_count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "Semua"
            ? (!posts || posts.length === 0) && (!users || users.length === 0) && filteredTags.length === 0 && filteredCategories.length === 0
            : activeTab === "Postingan" ? (!posts || posts.length === 0)
            : activeTab === "Pengguna" ? (!users || users.length === 0)
            : activeTab === "Tag" ? filteredTags.length === 0
            : activeTab === "Kategori" ? filteredCategories.length === 0
            : false) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={28} className="mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tidak ada hasil untuk &quot;{debounced}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded w-64" />
        <div className="h-64 bg-muted rounded" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}