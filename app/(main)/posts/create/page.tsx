"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/hooks/use-create-post";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import RichEditor from "@/components/ui/RichEditor";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const createPost = useCreatePost();
  const { data: categories } = useCategories();
  const { data: allTags } = useTags();
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  const TAGS_LIMIT = 8;

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  };

  const addCustomTag = (name: string) => {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed) return;
    setSelectedTags((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed],
    );
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCustomTag(tagInput);
    }
  };

  const sortedTags = useMemo(() => {
    const list = allTags ?? [];
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [allTags]);

  const limitedTags = useMemo(() => sortedTags.slice(0, TAGS_LIMIT), [sortedTags]);

  const totalTags = allTags?.length ?? 0;
  const hiddenCount = totalTags > TAGS_LIMIT ? totalTags - TAGS_LIMIT : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul harus diisi");
      return;
    }
    if (!body.trim()) {
      setError("Isi postingan harus diisi");
      return;
    }
    if (!categoryId) {
      setError("Kategori harus dipilih");
      return;
    }

    try {
      await createPost.mutateAsync({
        category_id: categoryId,
        title: title.trim(),
        body: body.trim(),
        tags: selectedTags,
      });

      router.push("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const message = error.response?.data?.message;
      const errors = error.response?.data?.errors;
      if (message === "Tidak terautentikasi") {
        setError("Silakan login terlebih dahulu");
        return;
      }
      if (errors) {
        const firstError = Object.values(errors).flat()[0];
        setError(firstError || "Validasi gagal");
        return;
      }
      setError(message || "Gagal membuat postingan");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Buat Postingan Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">
            Kategori
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="">Pilih kategori...</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">
            Judul
          </label>
          <input
            type="text"
            placeholder="Judul postingan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 text-sm placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">
            Isi Postingan
          </label>
          <RichEditor value={body} onChange={setBody} />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">
            Tag
          </label>

          <div className="flex items-center gap-2 mb-3">
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Ketik tag lalu tekan Enter..."
              className="flex-1 border border-border bg-card text-card-foreground rounded-lg px-3 py-2 text-sm placeholder-muted-foreground"
            />
            <button
              type="button"
              onClick={() => addCustomTag(tagInput)}
              disabled={!tagInput.trim()}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              Tambah
            </button>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-brand/10 text-brand px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => toggleTag(tag)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {(showAllTags ? sortedTags : limitedTags).map((tag) => {
              const active = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? "bg-brand/10 border-brand/30 text-brand"
                      : "border-border text-muted-foreground hover:border-zinc-300 hover:text-card-foreground"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTags(!showAllTags)}
              className="flex items-center gap-1 text-xs text-brand hover:underline mt-2"
            >
              {showAllTags ? (
                <>Sembunyikan <ChevronUp size={12} /></>
              ) : (
                <>Lihat semua ({hiddenCount} tag lainnya) <ChevronDown size={12} /></>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={createPost.isPending}
            className="px-5 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPost.isPending ? "Menyimpan..." : "Publikasikan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded-lg border border-border text-card-foreground text-sm font-medium hover:bg-sidebar-accent transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
