"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Tag } from "@/types/tag";

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Tag[]>>("/tags");
      return data.data;
    },
  });
}

export function useTag(id: string) {
  return useQuery<Tag>({
    queryKey: ["tag", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Tag>>(`/tags/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
