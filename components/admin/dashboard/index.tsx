"use client";

import { useState } from "react";
import { useDashboard, RangeKey } from "@/hooks/use-dashboard";
import { StatCard } from "./stat-card";
import { TrafficChart } from "./charts/traffic-chart";
import { ReportsChart } from "./charts/reports-chart";
import { OverviewChart } from "./charts/overview-chart";
import * as Avatar from "@radix-ui/react-avatar";
import { Zap } from "lucide-react";

const RANGES: { label: string; value: RangeKey }[] = [
  { label: "7H", value: "7" },
  { label: "30H", value: "30" },
  { label: "90H", value: "90" },
];

export function DashboardView() {
  const [range, setRange] = useState<RangeKey>("7");
  const { data, isLoading } = useDashboard(range);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-sidebar-foreground/30 border-t-sidebar-foreground rounded-full animate-spin" />
          <p className="text-sm text-sidebar-foreground/40">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-sidebar-border bg-sidebar px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Dashboard</h1>
            <p className="text-sm text-sidebar-foreground/50 mt-1">
              Selamat datang kembali, Admin. Berikut ringkasan hari ini.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live · Update otomatis
          </span>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Peak Hour Banner */}
        <div className="bg-sidebar border border-sidebar-border rounded-xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sidebar-foreground/40 text-xs font-semibold uppercase tracking-wider mb-1">
              Peak Hour Hari Ini
            </p>
            <p className="text-sidebar-foreground text-2xl font-bold">{data.peakHour}</p>
            <p className="text-sidebar-foreground/50 text-sm mt-1">
              {data.activeToday.toLocaleString("id-ID")} pengguna aktif pada jam tersebut
            </p>
          </div>
          <Zap size={48} className="text-sidebar-foreground opacity-10" />
        </div>

        {/* Range Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-sidebar-foreground">Grafik & Statistik</p>
          <div className="flex items-center gap-1 bg-sidebar-accent border border-sidebar-border rounded-xl p-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  range === r.value
                    ? "bg-sidebar text-sidebar-foreground shadow-sm border border-sidebar-border"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TrafficChart data={data.trafficData} />
          <ReportsChart data={data.reportsData} />
        </div>

        {/* Charts Row 2 */}
        <OverviewChart data={data.overviewData} />

        {/* Recent Activity */}
        <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-sidebar-border flex items-center justify-between">
            <p className="text-sm font-semibold text-sidebar-foreground">Aktivitas Terbaru</p>
            <span className="text-xs text-sidebar-foreground/50 font-medium cursor-pointer hover:text-sidebar-foreground transition-colors">
              Lihat semua
            </span>
          </div>
          <div className="divide-y divide-sidebar-border">
            {data.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-sidebar-accent transition-colors"
              >
                <Avatar.Root className="w-8 h-8 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center shrink-0">
                  <Avatar.Fallback className="text-sidebar-foreground/70 text-xs font-bold">
                    {activity.avatar}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{activity.user}</p>
                  <p className="text-xs text-sidebar-foreground/40 truncate">{activity.action}</p>
                </div>
                <span className="text-[11px] text-sidebar-foreground/40 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}