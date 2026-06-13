"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useModerateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      action,
      reason,
    }: {
      commentId: string;
      action: "hide" | "restore";
      reason?: string;
    }) => {
      const { data } = await api.post(`/comments/${commentId}/moderate`, { action, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["moderator", "posts"] });
    },
  });
}
