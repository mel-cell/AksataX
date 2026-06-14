"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Comment } from "@/types/comment";

export function useComments(postId: string) {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
      const comments = data.data ?? [];
      // Sort: newest first, but comments with higher votes stay higher when same time
      return [...comments].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    },
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      body,
      parent_id,
    }: {
      postId: string;
      body: string;
      parent_id?: string;
    }) => {
      const { data } = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, {
        body,
        parent_id,
      });
      return data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body, postId }: { id: string; body: string; postId?: string }) => {
      const { data } = await api.put<ApiResponse<Comment>>(`/comments/${id}`, { body });
      return data.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId?: string }) => {
      const { data } = await api.delete<ApiResponse<null>>(`/comments/${id}`);
      return data.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
        queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

export function useVoteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, postId }: { id: string; type: "upvote" | "downvote"; postId?: string }) => {
      const { data } = await api.post<ApiResponse<{ vote_type?: "upvote" | "downvote"; vote_score: number }>>(`/comments/${id}/vote`, {
        vote_type: type,
      });
      return data.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId?: string }) => {
      const { data } = await api.post<ApiResponse<{ liked: boolean }>>(`/comments/${id}/like`);
      return data.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}
