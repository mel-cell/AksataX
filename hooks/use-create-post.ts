"use client";

import { postService } from "@/lib/services/post-service";
import { useMutation } from "@tanstack/react-query";


export function useCreatePost() {
  return useMutation({
    mutationFn: postService.createPost,
  });
}
