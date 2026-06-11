"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services/post-service";

export function useToggleVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      voteType,
    }: {
      postId: string;
      voteType: "upvote" | "downvote";
    }) => postService.toggleVote(postId, voteType),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
