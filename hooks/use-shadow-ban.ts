"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ShadowBanPayload {
  reputation_penalty: number;
  restriction_type: "post" | "comment" | "both";
  restriction_duration: number;
  reason: string;
}

export function useShadowBan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      ...payload
    }: ShadowBanPayload & { userId: string }) => {
      const { data } = await api.patch(`/users/${userId}/shadow-ban`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
