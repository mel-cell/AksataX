"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";

interface PostsResponse {
  data: Post[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useModeratorPosts(params: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}) {
  return useQuery<PostsResponse>({
    queryKey: ["moderator", "posts", params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.status) query.set("status", params.status);
      if (params.page) query.set("page", String(params.page));
      if (params.per_page) query.set("per_page", String(params.per_page));
      const { data } = await api.get<PostsResponse>(`/posts?${query.toString()}`);
      return data;
    },
  });
}
