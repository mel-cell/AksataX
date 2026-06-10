"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>("/user");
      return data.data;
    },
    enabled: !!getToken(),
    retry: false,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (body: {
      username: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const { data } = await api.post<ApiResponse<{ token: string; user: User }>>("/register", body);
      return data.data;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { data } = await api.post<ApiResponse<{ token: string; user: User }>>("/login", body);
      return data.data;
    },
    onSuccess: (result) => {
      setToken(result.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },
    onSuccess: () => {
      clearToken();
      queryClient.clear();
    },
  });
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearToken(): void {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
}

const existingToken = getToken();
if (existingToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}
