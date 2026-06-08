"use client";

import { useQuery } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getPosts(),
  });
}
