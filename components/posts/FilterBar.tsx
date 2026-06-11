"use client";

import { useState, useMemo } from "react";
import type { FilterState } from "@/types/post";
import { ChevronDown } from "lucide-react";
import { useTags } from "@/hooks/use-tags";

const TABS: FilterState["tab"][] = ["Semua", "Belum Terjawab", "Terjawab"];
const SORT_OPTIONS: FilterState["sort"][] = ["Terbaru", "Terpopuler", "Vote Terbanyak"];

type Props = {
  onFilterChange?: (filters: FilterState) => void;
};

export default function FilterBar({ onFilterChange }: Props) {
  const [activeTab, setActiveTab] = useState<FilterState["tab"]>("Semua");
  const [activeSort, setActiveSort] = useState<FilterState["sort"]>("Terbaru");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const { data: allTags } = useTags();
  const sortedTags = useMemo(
    () =>
      (allTags ?? [])
        .sort((a, b) => (b.posts_count ?? 0) - (a.posts_count ?? 0))
        .map((t) => `#${t.name}`),
    [allTags],
  );
  const tags = showAllTags ? sortedTags : sortedTags.slice(0, 6);

  const handleTab = (tab: FilterState["tab"]) => {
    setActiveTab(tab);
    onFilterChange?.({ tab, sort: activeSort, tags: activeTags });
  };

  const handleSort = (sort: FilterState["sort"]) => {
    setActiveSort(sort);
    setSortOpen(false);
    onFilterChange?.({ tab: activeTab, sort, tags: activeTags });
  };

  const handleTag = (tag: string) => {
    const updated = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    setActiveTags(updated);
    onFilterChange?.({ tab: activeTab, sort: activeSort, tags: updated });
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-sidebar-accent rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-border bg-card text-card-foreground hover:bg-sidebar-accent transition-colors"
          >
            {activeSort}
            <ChevronDown
              size={14}
              className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-card border border-border rounded-xl shadow-xl py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSort(opt)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeSort === opt
                        ? "bg-sidebar-accent text-card-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-card-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTags.includes(tag)
                ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                : "border-border text-muted-foreground hover:border-zinc-300 hover:text-card-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
        {sortedTags.length > 6 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-xs text-brand hover:underline transition-colors ml-1 shrink-0"
          >
            {showAllTags ? "Sembunyikan" : `+${sortedTags.length - 6} lagi`}
          </button>
        )}
      </div>
    </div>
  );
}
