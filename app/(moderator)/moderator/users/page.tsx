"use client";

import { useUsers } from "@/hooks/use-users";
import { useModeratorUsers } from "@/hooks/use-moderator-users";
import UserTable from "@/components/ui/UserTable";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  const { data, isLoading, isError } = useUsers();
  const table = useModeratorUsers(data ?? []);

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
      selectedUser={table.selectedUser}
      dialogOpen={table.dialogOpen}
      onSearchChange={table.handleSearchChange}
      onRoleFilterChange={table.handleRoleFilterChange}
      onPageChange={table.setPage}
      onOpenDetail={table.openDetail}
      onCloseDetail={table.closeDetail}
    />
  );
}