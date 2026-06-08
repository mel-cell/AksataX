"use client";

import { useMutation } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function useToggleBookmark() {
  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),
  });
}
