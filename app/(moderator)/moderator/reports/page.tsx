"use client";

import { useState } from "react";
import { useReports, useResolveReport } from "@/hooks/use-reports";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { Loader2, ShieldBan, CheckCircle2 } from "lucide-react";
import { ShadowBanModal } from "@/components/ui/ShadowBanModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLE: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  resolved: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

export default function ModeratorReportsPage() {
  const { data: reports, isLoading, isError } = useReports();
  const resolveReport = useResolveReport();
  const [filter, setFilter] = useState<string>("all");
  const [shadowBanTarget, setShadowBanTarget] = useState<{ userId: string; username: string } | null>(null);

  const filtered = reports?.filter((r) => filter === "all" || r.status === filter) ?? [];

  const handleResolve = (id: string, status: "resolved" | "dismissed") => {
    resolveReport.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Memuat laporan...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Gagal memuat laporan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-card-foreground">Laporan Masuk</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} laporan</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground cursor-pointer"
        >
          <option value="all">Semua</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alasan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pelapor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                  Tidak ada laporan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((report) => {
                const targetUser = report.target_type === "post"
                  ? (report as any).post?.user
                  : (report as any).comment?.user;
                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium text-card-foreground">
                      {report.reason}
                    </TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLE[report.status] ?? ""}`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.reporter?.username ?? "Unknown"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {targetUser ? `@${targetUser.username}` : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {report.target_type}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: localeId as any })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {report.status === "pending" && targetUser && (
                          <button
                            onClick={() => setShadowBanTarget({ userId: targetUser.id, username: targetUser.username })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors"
                            title="Shadow Ban"
                          >
                            <ShieldBan size={12} />
                          </button>
                        )}
                        {report.status === "pending" && (
                          <button
                            onClick={() => handleResolve(report.id, "resolved")}
                            disabled={resolveReport.isPending}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
                            title="Resolve"
                          >
                            <CheckCircle2 size={12} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {shadowBanTarget && (
        <ShadowBanModal
          userId={shadowBanTarget.userId}
          username={shadowBanTarget.username}
          open={!!shadowBanTarget}
          onClose={() => setShadowBanTarget(null)}
        />
      )}
    </>
  );
}
