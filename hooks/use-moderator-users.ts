"use client";

import { useState, useMemo } from "react";
import { User } from "@/types/user";

const PAGE_SIZE = 8;

export function getPrimaryRole(user: User): string {
  const names = user.roles.map((r) => r.name);
  if (names.includes("banned")) return "banned";
  if (names.includes("suspended")) return "suspended";
  if (names.includes("moderator")) return "moderator";
  if (names.includes("admin")) return "admin";
  return "user";
}

export function useModeratorUsers(users: User[] = []) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole =
        roleFilter === "all" || getPrimaryRole(u) === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  return {
    search,
    roleFilter,
    page,
    totalPages,
    paginated,
    filteredCount: filtered.length,
    selectedUser,
    dialogOpen,
    openDetail,
    closeDetail,
    handleSearchChange,
    handleRoleFilterChange,
    setPage,
  };
}