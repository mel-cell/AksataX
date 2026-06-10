import { useState } from "react";

export function useFollowButton(initialFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    setIsLoading(true);
    try {
      // TODO: ganti dengan API call sesungguhnya
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Gagal toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, isLoading, handleToggleFollow };
}