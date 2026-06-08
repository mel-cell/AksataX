"use client";

import { useQuery } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function usePostDetail(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
}
