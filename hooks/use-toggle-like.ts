"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleLike(postId),

    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}
