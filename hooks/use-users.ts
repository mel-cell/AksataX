"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users", "admin"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>("/users");
      return data.data;
    },
  });
}
