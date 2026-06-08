import { api } from "@/lib/api";
import { Post } from "@/types/post";

export const postService = {
  async getPosts() {
    const response = await api.get("/posts");

    return response.data.data as Post[];
  },

  async getPost(id: string) {
    const response = await api.get(`/posts/${id}`);

    return response.data.data as Post;
  },

  async toggleLike(postId: string) {
    const { data } = await api.post(`/posts/${postId}/like`);

    return data.data;
  },

  async createPost(payload: {
    category_id: string;
    title: string;
    body: string;
    tags: string[];
  }) {
    const { data } = await api.post("/posts", payload);

    return data;
  },

  async toggleBookmark(postId: string) {
    const { data } = await api.post(`/posts/${postId}/bookmark`);

    return data.data;
  },
};
