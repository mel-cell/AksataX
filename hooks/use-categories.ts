"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/category";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>("/categories");
      return data.data;
    },
  });
}
