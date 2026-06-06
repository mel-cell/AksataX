"use client";

import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {category.posts_count} post{category.posts_count !== 1 ? "s" : ""}
      </p>
      {category.description && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Categories
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
