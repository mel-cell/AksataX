"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),

    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarked-posts"] });
    },
  });
}
