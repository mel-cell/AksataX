"use client";

import { useUsers } from "@/hooks/use-users";
import { useModeratorUsers } from "@/hooks/use-moderator-users";
import UserTable from "@/components/ui/UserTable";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function UsersPage() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const table = useModeratorUsers(users ?? []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Memuat data user...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Gagal memuat data. Coba refresh halaman.</p>
      </div>
    );
  }

  return (
    <UserTable
      users={table.paginated}
      search={table.search}
      roleFilter={table.roleFilter}
      page={table.page}
      totalPages={table.totalPages}
      filteredCount={table.filteredCount}
      pageSize={table.pageSize}
      selectedUser={table.selectedUser}
      dialogOpen={table.dialogOpen}
      onSearchChange={table.handleSearchChange}
      onRoleFilterChange={table.handleRoleFilterChange}
      onPageChange={table.setPage}
      onPageSizeChange={table.handlePageSizeChange}
      onOpenDetail={table.openDetail}
      onCloseDetail={table.closeDetail}
    />
  );
}
