'use client'

import type { Post } from '@/types/post'
import Link from 'next/link'

type Props = {
  post: Post
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split('_')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)

  return (
    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-medium text-indigo-300 flex-shrink-0">
      {initials}
    </div>
  )
}

export default function PostCard({ post }: Props) {
  const {
    id,
    title,
    excerpt,
    author,
    category,
    tags,
    voteScore,
    commentsCount,
    viewCount,
    createdAt,
    isAnswered,
  } = post

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.preventDefault()
    // TODO: handle vote logic
    console.log('vote', type, id)
  }

  return (
    <Link href={`/posts/${id}`} className="block group">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 min-w-[32px]">
            <button
              onClick={(e) => handleVote(e, 'up')}
              className="w-7 h-7 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30 transition-colors"
              aria-label="Upvote"
            >
              ▲
            </button>
            <span className="text-sm font-medium text-zinc-200">{voteScore}</span>
            <button
              onClick={(e) => handleVote(e, 'down')}
              className="w-7 h-7 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
              aria-label="Downvote"
            >
              ▼
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Avatar name={author} />
              <span className="text-sm text-zinc-400">{author}</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs text-zinc-500">{createdAt}</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {category}
              </span>
              {isAnswered ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  ✓ Terjawab
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  Belum Terjawab
                </span>
              )}
            </div>

            <h2 className="text-sm font-medium text-zinc-100 group-hover:text-white mb-1.5 leading-snug line-clamp-2">
              {title}
            </h2>

            <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
              {excerpt}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1.5 flex-wrap flex-1">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span>💬 {commentsCount}</span>
                <span>👁 {viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}