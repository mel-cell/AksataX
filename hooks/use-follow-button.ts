import { useState } from "react";
import { api } from "@/lib/api";

export function useFollowButton(initialFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/users/${userId}/follow`);
      const followed = data?.data?.followed ?? data?.data?.is_following ?? !isFollowing;
      setIsFollowing(followed);
      return followed;
    } catch (error) {
      console.error("Gagal toggle follow:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, isLoading, handleToggleFollow };
}