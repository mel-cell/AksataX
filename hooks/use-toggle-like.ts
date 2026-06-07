"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/app/services/post-service";

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleLike(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}
