"use client";

import { profileService } from "@/lib/services/profile-service";
import { useMutation } from "@tanstack/react-query";


export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => profileService.deleteAccount(),
  });
}
