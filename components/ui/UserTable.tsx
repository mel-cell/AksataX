"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { User } from "@/types/user";
import { getPrimaryRole } from "@/hooks/use-moderator-users";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { Search, X, Users } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(/[_ ]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

const ROLE_STYLE: Record<string, string> = {
  admin:     "bg-violet-50 text-violet-700 border-violet-200",
  moderator: "bg-indigo-50 text-indigo-600 border-indigo-200",
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

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 flex-shrink-0">
      {getInitials(name)}
    </div>
  );
}

// ── props ─────────────────────────────────────────────────────────────────────

type Props = {
  users: User[];
  search: string;
  roleFilter: string;
  page: number;
  totalPages: number;
  filteredCount: number;
  selectedUser: User | null;
  dialogOpen: boolean;
  onSearchChange: (val: string) => void;
  onRoleFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onOpenDetail: (user: User) => void;
  onCloseDetail: () => void;
};

// ── component ─────────────────────────────────────────────────────────────────

export default function UserTable({
  users,
  search,
  roleFilter,
  page,
  totalPages,
  filteredCount,
  selectedUser,
  dialogOpen,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
  onOpenDetail,
  onCloseDetail,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-card-foreground">Daftar User</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredCount} user ditemukan
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari username atau email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-300 transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:border-indigo-300 transition-colors cursor-pointer"
        >
          <option value="all">Semua Role</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-sidebar-accent">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reputasi</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bergabung</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <Users size={32} className="text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">Tidak ada user ditemukan.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-sidebar-accent transition-colors"
                >
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.username} />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <RoleBadge role={getPrimaryRole(user)} />
                  </td>

                  {/* Reputasi */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">
                        Lv.{user.level}
                      </span>
                      <span className="text-sm text-card-foreground">
                        {user.reputation_points.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </td>

                  {/* Post */}
                  <td className="px-4 py-3 text-sm text-card-foreground">
                    {user.posts_count}
                  </td>

                  {/* Bergabung */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                      locale: localeId as any,
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpenDetail(user)}
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                    >
                      Detail →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">
          Halaman {page} dari {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-card-foreground hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-card-foreground hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={(open) => !open && onCloseDetail()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">
            {selectedUser && (
              <>
                {/* Header dialog */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-base font-bold text-indigo-600">
                      {getInitials(selectedUser.username)}
                    </div>
                    <div>
                      <Dialog.Title className="text-base font-semibold text-card-foreground">
                        {selectedUser.username}
                      </Dialog.Title>
                      <p className="text-sm text-muted-foreground">{selectedUser.email ?? "—"}</p>
                    </div>
                  </div>
                  <Dialog.Close className="text-muted-foreground hover:text-card-foreground transition-colors">
                    <X size={18} />
                  </Dialog.Close>
                </div>

                {/* Bio */}
                {selectedUser.bio && (
                  <p className="text-sm text-muted-foreground bg-sidebar-accent rounded-lg px-3 py-2.5 mb-4 leading-relaxed">
                    {selectedUser.bio}
                  </p>
                )}

                {/* Stats */}
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

                {/* Info rows */}
                <div className="space-y-0 border border-border rounded-lg overflow-hidden mb-5">
                  {[
                    { label: "Role", value: <RoleBadge role={getPrimaryRole(selectedUser)} /> },
                    { label: "Level", value: `Lv.${selectedUser.level}` },
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

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors">
                    Suspend
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                    Ban
                  </button>
                  <button
                    onClick={onCloseDetail}
                    className="flex-1 py-2 rounded-lg bg-sidebar-accent border border-border text-muted-foreground text-sm font-medium hover:text-card-foreground transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}