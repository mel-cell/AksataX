"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
}
