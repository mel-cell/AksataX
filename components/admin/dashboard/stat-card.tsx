import { Users, Activity, Clock, TrendingDown, BarChart2 } from "lucide-react";
import { StatItem } from "@/hooks/use-dashboard";

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  activity: Activity,
  clock: Clock,
  "trending-down": TrendingDown,
};

export function StatCard({ label, value, change, icon }: StatItem) {
  const isPositive = change >= 0;
  const Icon = iconMap[icon] ?? BarChart2;

  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          {label}
        </span>
        <Icon size={16} className="text-sidebar-foreground/30" />
      </div>

      <p className="text-2xl font-bold text-sidebar-foreground">{value}</p>

      <div className="flex items-center gap-1.5">
        <span
          className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-[11px] text-sidebar-foreground/40">vs kemarin</span>
      </div>
    </div>
  );
}