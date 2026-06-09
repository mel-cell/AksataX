"use client";

import { useState } from "react";
import { useCreatePost } from "@/hooks/use-create-post";

export default function CreatePostPage() {
  const createPost = useCreatePost();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createPost.mutateAsync({
        category_id: categoryId,
        title,
        body,
        tags: tags.split(",").map((tag) => tag.trim()),
      });

      alert(result.message);

      setTitle("");
      setBody("");
      setCategoryId("");
      setTags("");
    } catch (error: any) {
      const message = error.response?.data?.message;

      if (message === "Tidak terautentikasi") {
        alert("Silakan login terlebih dahulu");
        return;
      }

      if (message === "Validasi gagal") {
        alert("Data belum lengkap");
        return;
      }

      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Postingan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Judul Postingan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <textarea
          placeholder="Isi Postingan"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Tag ID pisahkan dengan koma"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          disabled={createPost.isPending}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {createPost.isPending ? "Menyimpan..." : "Publikasikan"}
        </button>
      </form>
    </div>
  );
}
