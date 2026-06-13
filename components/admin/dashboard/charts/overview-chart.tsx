"use client";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { OverviewPoint } from "@/hooks/use-dashboard";

export function OverviewChart({ data }: { data: OverviewPoint[] }) {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-5">
      <p className="text-sm font-semibold text-sidebar-foreground">Ringkasan Aktivitas</p>
      <p className="text-xs text-sidebar-foreground/40 mt-0.5 mb-4">User baru, postingan, dan komentar aktif</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E7E5E4" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          <Line type="monotone" dataKey="users" name="User Baru" stroke="#78716C" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="posts" name="Postingan" stroke="#A8A29E" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="comments" name="Komentar" stroke="#D6D3D1" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}