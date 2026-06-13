import { useState, useEffect } from "react";

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

function generateDays(n: number, base: number, variance: number): ChartPoint[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return {
      date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      value: Math.max(0, base + Math.floor((Math.random() - 0.5) * variance)),
    };
  });
}

function generateOverview(n: number): OverviewPoint[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return {
      date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      users: Math.floor(20 + Math.random() * 80),
      posts: Math.floor(10 + Math.random() * 50),
      comments: Math.floor(30 + Math.random() * 120),
    };
  });
}

export function useDashboard(range: RangeKey = "7") {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const n = parseInt(range);

    const timer = setTimeout(() => {
      setData({
        activeToday: 1284,
        peakHour: "14.00 – 15.00",
        stats: [
          { label: "Active Today", value: "1.284", change: +12.4, icon: "users" },
          { label: "New Session", value: "3.921", change: +8.1, icon: "activity" },
          { label: "Avg. Duration", value: "4m 32s", change: -2.3, icon: "clock" },
          { label: "Bounce Rate", value: "24,1%", change: -5.6, icon: "trending-down" },
        ],
        recentActivity: [
          { id: "1", user: "Andi Pratama", action: "Membuat postingan baru", time: "2 menit lalu", avatar: "AP" },
          { id: "2", user: "Siti Rahma", action: "Mengomentari diskusi", time: "5 menit lalu", avatar: "SR" },
          { id: "3", user: "Budi Santoso", action: "Melaporkan konten", time: "12 menit lalu", avatar: "BS" },
          { id: "4", user: "Dewi Lestari", action: "Mendaftar akun baru", time: "18 menit lalu", avatar: "DL" },
          { id: "5", user: "Reza Firmansyah", action: "Membuat postingan baru", time: "24 menit lalu", avatar: "RF" },
        ],
        trafficData: generateDays(n, 3200, 1800),
        reportsData: generateDays(n, 18, 20),
        overviewData: generateOverview(n),
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [range]);

  return { data, isLoading };
}