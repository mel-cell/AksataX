'use client'

import { useState } from 'react'
import type { FilterState } from '@/types/post'

const TABS: FilterState['tab'][] = ['Semua', 'Belum Terjawab', 'Terjawab']
const SORT_OPTIONS: FilterState['sort'][] = ['Terbaru', 'Terpopuler', 'Vote Terbanyak']
const TAGS = ['#javascript', '#react', '#nextjs', '#database', '#css', '#typescript']

type Props = {
  onFilterChange?: (filters: FilterState) => void
}

export default function FilterBar({ onFilterChange }: Props) {
  const [activeTab, setActiveTab] = useState<FilterState['tab']>('Semua')
  const [activeSort, setActiveSort] = useState<FilterState['sort']>('Terbaru')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const handleTab = (tab: FilterState['tab']) => {
    setActiveTab(tab)
    onFilterChange?.({ tab, sort: activeSort, tags: activeTags })
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value as FilterState['sort']
    setActiveSort(sort)
    onFilterChange?.({ tab: activeTab, sort, tags: activeTags })
  }

  const handleTag = (tag: string) => {
    const updated = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag]
    setActiveTags(updated)
    onFilterChange?.({ tab: activeTab, sort: activeSort, tags: updated })
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <select
          value={activeSort}
          onChange={handleSort}
          className="text-sm px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTags.includes(tag)
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}