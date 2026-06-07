"use client";

import { useQuery } from "@tanstack/react-query";
import { postService } from "@/app/services/post-service";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getPosts(),
  });
}
