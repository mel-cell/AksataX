"use client";

import { Button } from "@/components/ui/button";
import { useFollowButton } from "@/hooks/use-follow-button";

interface Props {
  initialFollowing?: boolean;
}

export default function FollowButton({ initialFollowing = false }: Props) {
  const { isFollowing, isLoading, handleToggleFollow } = useFollowButton(initialFollowing);

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      disabled={isLoading}
      onClick={handleToggleFollow}
      className={isFollowing ? "hover:border-red-300 hover:text-red-500" : ""}
    >
      {isLoading ? "Loading..." : isFollowing ? "Mengikuti" : "Ikuti"}
    </Button>
  );
}