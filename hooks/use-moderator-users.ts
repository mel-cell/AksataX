"use client";

import { useState, useMemo } from "react";
import { User } from "@/types/user";

export function getPrimaryRole(user: User): string {
  if (user.is_banned) return "banned";
  const names = user.roles.map((r) => r.name);
  if (names.includes("suspended")) return "suspended";
  if (names.includes("moderator")) return "moderator";
  if (names.includes("admin")) return "admin";
  return "user";
}

export function useModeratorUsers(users: User[] = []) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(search.toLowerCase());
      const matchRole =
        roleFilter === "all" || getPrimaryRole(u) === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const closeDetail = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    search,
    roleFilter,
    page,
    pageSize,
    totalPages,
    paginated,
    filteredCount: filtered.length,
    selectedUser,
    dialogOpen,
    openDetail,
    closeDetail,
    handleSearchChange,
    handleRoleFilterChange,
    handlePageSizeChange,
    setPage,
  };
}
