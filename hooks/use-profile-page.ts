"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUser } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import type { ApiResponse } from "@/types/api";
import type { User, UserWithLevel } from "@/types/user";
import type { Post } from "@/types/post";

export const TABS = [
  { key: "posts", label: "Postingan" },
  { key: "followers", label: "Pengikut" },
  { key: "following", label: "Mengikuti" },
];

export type TabKey = "posts" | "followers" | "following";

export interface FollowerItem {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

export function useProfilePage(username?: string) {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const { data: currentUser } = useUser();
  const { data: profileUser } = useProfile();

  const targetUsername = username || profileUser?.username;

  const profileQuery = useQuery<UserWithLevel>({
    queryKey: ["profile-by-username", targetUsername],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>(
        `/users/by-username/${targetUsername}`,
      );

      return {
        ...data.data,
        level: Math.floor(data.data.reputation_points / 50),
      };
    },
    enabled: !!targetUsername,
  });

  const profile = profileQuery.data;

  const isOwnProfile = profile?.id === currentUser?.id;

  const postsQuery = useQuery<Post[]>({
    queryKey: ["user-posts", profile?.id],
    queryFn: async () => {
      const { data } = await api.get("/posts", {
        params: {
          user: profile?.id,
          per_page: 50,
        },
      });

      return (data.data ?? []) as Post[];
    },
    enabled: !!profile?.id,
  });

  const followersQuery = useQuery<FollowerItem[]>({
    queryKey: ["user-followers", profile?.id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${profile?.id}/followers`);

      const items = (data.data ?? []) as {
        follower?: {
          id: string;
          username: string;
          avatar_url: string;
        };
        id: string;
      }[];

      return items.map((item) => ({
        id: item.follower?.id ?? item.id,
        username: item.follower?.username ?? "",
        name: item.follower?.username ?? "",
        avatar: item.follower?.avatar_url ?? "",
        isFollowing: false,
      }));
    },
    enabled: !!profile?.id,
  });

  const followingQuery = useQuery<FollowerItem[]>({
    queryKey: ["user-following", profile?.id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${profile?.id}/following`);

      const items = (data.data ?? []) as {
        following?: {
          id: string;
          username: string;
          avatar_url: string;
        };
        id: string;
      }[];

      return items.map((item) => ({
        id: item.following?.id ?? item.id,
        username: item.following?.username ?? "",
        name: item.following?.username ?? "",
        avatar: item.following?.avatar_url ?? "",
        isFollowing: false,
      }));
    },
    enabled: !!profile?.id,
  });

  const tabContent = {
    posts: postsQuery.data ?? [],
    followers: followersQuery.data ?? [],
    following: followingQuery.data ?? [],
  };

  return {
    profile:
      profile ??
      ({
        id: "",
        username: "",
        avatar_url: "",
        bio: null,
        reputation_points: 0,
        level: 0,
        created_at: "",
        roles: [],
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        is_following: false,
      } as UserWithLevel),

    activeTab,
    setActiveTab,
    tabContent,
    isOwnProfile,
    isLoading: profileQuery.isLoading,
  };
}
