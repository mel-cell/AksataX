"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { User } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { Search, X, Users, Loader2, ShieldBan } from "lucide-react";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ShadowBanModal } from "@/components/ui/ShadowBanModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getInitials(name: string) {
  return name
    .split(/[_ ]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function getPrimaryRole(user: User): string {
  if (user.is_banned) return "banned";
  const names = user.roles.map((r) => r.name);
  if (names.includes("suspended")) return "suspended";
  if (names.includes("moderator")) return "moderator";
  if (names.includes("admin")) return "admin";
  return "user";
}

const ROLE_STYLE: Record<string, string> = {
  admin:     "bg-zinc-100 text-zinc-600 border-zinc-200",
  moderator: "bg-zinc-100 text-zinc-600 border-zinc-200",
  user:      "bg-zinc-100 text-zinc-500 border-zinc-200",
  suspended: "bg-amber-50 text-amber-700 border-amber-200",
  banned:    "bg-red-50 text-red-600 border-red-200",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${ROLE_STYLE[role] ?? ROLE_STYLE.user}`}>
      {role}
    </span>
  );
}

type Props = {
  users: User[];
  search: string;
  roleFilter: string;
  page: number;
  pageSize: number;
  totalPages: number;
  filteredCount: number;
  selectedUser: User | null;
  dialogOpen: boolean;
  onSearchChange: (val: string) => void;
  onRoleFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onOpenDetail: (user: User) => void;
  onCloseDetail: () => void;
};

export default function UserTable({
  users,
  search,
  roleFilter,
  page,
  pageSize,
  totalPages,
  filteredCount,
  selectedUser,
  dialogOpen,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
  onPageSizeChange,
  onOpenDetail,
  onCloseDetail,
}: Props) {
  const queryClient = useQueryClient();
  const [shadowBanTarget, setShadowBanTarget] = useState<{ userId: string; username: string } | null>(null);

  const handleToggleBan = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}/ban`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onCloseDetail();
    } catch {
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-card-foreground">Daftar User</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {filteredCount} user ditemukan
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari username..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
        >
          <option value="all">Semua Role</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Reputasi</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 flex-shrink-0">
                        {getInitials(user.username)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={getPrimaryRole(user)} />
                  </TableCell>
                  <TableCell className="text-sm text-card-foreground">
                    Lv.{Math.floor(user.reputation_points / 50)}
                  </TableCell>
                  <TableCell className="text-sm text-card-foreground">
                    {user.reputation_points.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-sm text-card-foreground">
                    {user.posts_count}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                      locale: localeId as any,
                    })}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onOpenDetail(user)}
                      className="text-xs text-brand hover:text-brand/80 font-medium transition-colors"
                    >
                      Detail →
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Tampil</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-border rounded-lg bg-card text-card-foreground text-sm cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>dari-{filteredCount}</span>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => { e.preventDefault(); if (page > 1) onPageChange(page - 1); }}
                  text="Prev"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={(e) => { e.preventDefault(); onPageChange(p); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => { e.preventDefault(); if (page < totalPages) onPageChange(page + 1); }}
                  text="Next"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        </div>

      <Dialog.Root open={dialogOpen} onOpenChange={(open) => !open && onCloseDetail()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            {selectedUser && (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-base font-bold text-zinc-600">
                      {getInitials(selectedUser.username)}
                    </div>
                    <div>
                      <Dialog.Title className="text-base font-semibold text-card-foreground">
                        {selectedUser.username}
                      </Dialog.Title>
                      <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                    </div>
                  </div>
                  <Dialog.Close className="text-muted-foreground hover:text-card-foreground transition-colors">
                    <X size={18} />
                  </Dialog.Close>
                </div>

                {selectedUser.bio && (
                  <p className="text-sm text-muted-foreground bg-sidebar-accent rounded-lg px-3 py-2.5 mb-4 leading-relaxed">
                    {selectedUser.bio}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Post", value: selectedUser.posts_count },
                    { label: "Followers", value: selectedUser.followers_count },
                    { label: "Following", value: selectedUser.following_count },
                  ].map((s) => (
                    <div key={s.label} className="bg-sidebar-accent rounded-lg p-3 text-center">
                      <p className="text-base font-semibold text-card-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-0 border border-border rounded-lg overflow-hidden mb-5">
                  {[
                    { label: "Role", value: <RoleBadge role={getPrimaryRole(selectedUser)} /> },
                    { label: "Level", value: `Lv.${Math.floor(selectedUser.reputation_points / 50)}` },
                    {
                      label: "Reputasi",
                      value: `${selectedUser.reputation_points.toLocaleString("id-ID")} poin`,
                    },
                    {
                      label: "Bergabung",
                      value: formatDistanceToNow(new Date(selectedUser.created_at), {
                        addSuffix: true,
                        locale: localeId as any,
                      }),
                    },
                  ].map((item, i, arr) => (
                    <div
                      key={item.label}
                      className={`flex justify-between items-center px-4 py-2.5 ${
                        i < arr.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShadowBanTarget({
                        userId: selectedUser.id,
                        username: selectedUser.username,
                      });
                    }}
                    className="flex-1 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldBan size={14} />
                    Shadow Ban
                  </button>
                  <button
                    onClick={() => handleToggleBan(selectedUser)}
                    className="flex-1 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    {getPrimaryRole(selectedUser) === "banned" ? "Unban" : "Ban"}
                  </button>
                  <button
                    onClick={onCloseDetail}
                    className="flex-1 py-2 rounded-lg bg-sidebar-accent border border-border text-muted-foreground text-sm font-medium hover:text-card-foreground transition-colors"
                  >
                    Tutup
                  </button>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-2 text-center">
                  Moderator: gunakan Shadow Ban. Ban hanya untuk admin.
                </p>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {shadowBanTarget && (
        <ShadowBanModal
          userId={shadowBanTarget.userId}
          username={shadowBanTarget.username}
          open={!!shadowBanTarget}
          onClose={() => setShadowBanTarget(null)}
        />
      )}
    </div>
  );
}
