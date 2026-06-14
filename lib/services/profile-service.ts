import { api } from "@/lib/api";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const profileService = {
  getProfile: async () => {
    const { data } = await api.get("/profile");

    console.log("PROFILE DATA:", data.data);

    return data.data;
  },

  async updateProfile(payload: {
    username: string;
    bio: string;
    avatar?: File;
  }) {
    const formData = new FormData();
    formData.append("username", payload.username);
    formData.append("bio", payload.bio);
    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }

    // use put for update data profile user
    const response = await api.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async deleteAvatar() {
    const response = await api.delete("/profile/avatar");

    return response.data.data as User;
  },

  async changePassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    const response = await api.put("/profile/password", payload);

    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete("/profile");

    return response.data;
  },
};
