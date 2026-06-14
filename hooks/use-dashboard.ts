import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export type RangeKey = "7" | "30" | "90";

export interface StatItem {
  label: string;
  value: number | string;
  change: number;
  icon: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

export interface ChartPoint {
  date: string;
  value: number;
}

export interface OverviewPoint {
  date: string;
  users: number;
  posts: number;
  comments: number;
}

export interface DashboardData {
  stats: StatItem[];
  recentActivity: ActivityItem[];
  activeToday: number;
  peakHour: string;
  trafficData: ChartPoint[];
  reportsData: ChartPoint[];
  overviewData: OverviewPoint[];
}

export function useDashboard(range: RangeKey = "7") {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    api
      .get<{ success: boolean; data: DashboardData }>("/admin/dashboard", {
        params: { range },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [range]);

  return { data, isLoading };
}
