"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export function useProfile() {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>("/profile");
      return data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await api.put<ApiResponse<User>>("/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ApiResponse<User>>("/profile/avatar");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ApiResponse<null>>("/profile");
      return data.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
