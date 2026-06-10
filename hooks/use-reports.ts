"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Report } from "@/types/report";

export function useReports(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const qs = searchParams.toString();

  return useQuery<Report[]>({
    queryKey: ["reports", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Report[]>>(`/reports${qs ? `?${qs}` : ""}`);
      return data.data;
    },
  });
}

export function useReport(id: string) {
  return useQuery<Report>({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Report>>(`/reports/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      target_id: string;
      target_type: "post" | "comment";
      reason: string;
      description?: string;
    }) => {
      const { data } = await api.post<ApiResponse<Report>>("/reports", body);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "resolved" | "dismissed" }) => {
      const { data } = await api.patch<ApiResponse<Report>>(`/reports/${id}/resolve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useReportReasons() {
  return useQuery<{ value: string; label: string }[]>({
    queryKey: ["reports", "reasons"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ value: string; label: string }[]>>(
        "/reports/reasons"
      );
      return data.data;
    },
  });
}
