"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("image", file);
      const { data } = await api.post<ApiResponse<{ url: string }>>("/uploads/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data.url;
    },
  });
}
