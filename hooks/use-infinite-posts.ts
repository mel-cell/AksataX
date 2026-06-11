"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";

export function useInfinitePosts(sort: string = "created_at") {
  return useInfiniteQuery<Post[]>({
    queryKey: ["posts", "infinite", sort],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get("/posts", {
        params: { page: pageParam, per_page: 10, sort, order: "desc" },
      });
      return (data.data ?? []) as Post[];
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < 10) return undefined;
      return (lastPageParam as number) + 1;
    },
    initialPageParam: 1,
  });
}
