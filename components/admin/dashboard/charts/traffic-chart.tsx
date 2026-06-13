"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChartPoint } from "@/hooks/use-dashboard";

export function TrafficChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-5">
      <p className="text-sm font-semibold text-sidebar-foreground">Web Traffic</p>
      <p className="text-xs text-sidebar-foreground/40 mt-0.5 mb-4">Jumlah visitor per hari</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#78716C" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#78716C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E7E5E4" }}
            formatter={(v: number) => [v.toLocaleString("id-ID"), "Visitor"]}
          />
          <Area type="monotone" dataKey="value" stroke="#78716C" strokeWidth={2} fill="url(#trafficGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}