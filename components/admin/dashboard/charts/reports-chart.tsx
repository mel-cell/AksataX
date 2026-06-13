"use client";

import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChartPoint } from "@/hooks/use-dashboard";

export function ReportsChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-5">
      <p className="text-sm font-semibold text-sidebar-foreground">Laporan Masuk</p>
      <p className="text-xs text-sidebar-foreground/40 mt-0.5 mb-4">Jumlah laporan konten per hari</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E7E5E4" }}
            formatter={(v: number) => [v, "Laporan"]}
          />
          <Bar dataKey="value" fill="#f87171" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}