"use client";

import { useState } from "react";
import { useModeratorPosts } from "@/hooks/use-moderator-posts";
import { useModeratePost } from "@/hooks/use-moderate-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import {
  Search,
  Loader2,
  FileText,
  ExternalLink,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ModeratorPostsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useModeratorPosts({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    per_page: 20,
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator", "posts"] });
    },
  });

  const moderatePost = useModeratePost();

  const posts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-card-foreground">Semua Postingan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {meta ? `${meta.total} postingan ditemukan` : "Memuat..."}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-4 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Memuat postingan...</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-red-500">Gagal memuat data. Coba refresh halaman.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Judul</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Vote</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Komentar</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dibuat</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-muted-foreground">
                      <FileText size={32} className="mx-auto mb-2 opacity-30" />
                      Tidak ada postingan ditemukan.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {post.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {post.user.username}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            post.status === "deleted"
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-card-foreground">
                        {post.vote_score}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-card-foreground">
                        {post.comments_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                          locale: localeId as any,
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/posts/${post.id}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors"
                            title="Lihat"
                          >
                            <ExternalLink size={14} />
                          </Link>
{(post.status === "deleted" || post.status === "hidden") && (
                            <button
                              onClick={() => moderatePost.mutate({ postId: post.id, action: "restore" })}
                              disabled={moderatePost.isPending}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                              title="Restore"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Hapus postingan "${post.title}"?`)) {
                                deleteMutation.mutate(post.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Halaman {meta.current_page} dari {meta.last_page}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-card text-card-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page >= meta.last_page}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-card text-card-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
