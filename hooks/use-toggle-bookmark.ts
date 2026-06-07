"use client";

import { useMutation } from "@tanstack/react-query";
import { postService } from "@/app/services/post-service";

export function useToggleBookmark() {
  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),
  });
}
