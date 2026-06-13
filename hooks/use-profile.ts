"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/lib/services/profile-service";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, bio, avatar }: { username: string; bio: string; avatar?: File }) => {
      return profileService.updateProfile({ username, bio, avatar });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["profile-by-username"],
      });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.deleteAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
