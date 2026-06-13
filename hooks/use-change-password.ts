"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (body: {
      current_password: string;
      password: string;
      password_confirmation: string;
    }) => {
      const { data } = await api.put<ApiResponse<null>>("/profile/password", body);
      return data;
    },
  });
}
