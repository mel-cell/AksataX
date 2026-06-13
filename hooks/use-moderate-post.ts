"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useModeratePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      action,
      reason,
    }: {
      postId: string;
      action: "hide" | "restore";
      reason?: string;
    }) => {
      const { data } = await api.post(`/posts/${postId}/moderate`, { action, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["moderator", "posts"] });
    },
  });
}

export function useAppealPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      reason,
    }: {
      postId: string;
      reason: string;
    }) => {
      const { data } = await api.post(`/posts/${postId}/appeal`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}
