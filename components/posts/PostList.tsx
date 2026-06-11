'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/types/post'
import { ImageIcon, FileText, Smile } from 'lucide-react'

type Props = {
  posts: Post[]
  postsPerPage?: number
}

type PageItem = number | '...'

export default function PostList({ posts, postsPerPage = 10 }: Props) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const paginated = posts.slice((page - 1) * postsPerPage, page * postsPerPage)

  const getPageNumbers = (): PageItem[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, '...', totalPages]
    if (page >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <div>
      {/* Input Buat Postingan */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 flex-shrink-0">
            MK
          </div>
          <input
            type="text"
            placeholder="Apa yang sedang kamu pikirkan?"
            className="flex-1 text-sm text-gray-500 placeholder-gray-400 bg-gray-100 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            readOnly
          />
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 pl-13">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-500 transition-colors">
            <ImageIcon size={16} />
            <span>Gambar</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-500 transition-colors">
            <FileText size={16} />
            <span>Artikel</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-500 transition-colors">
            <Smile size={16} />
            <span>Perasaan</span>
          </button>
          <button className="ml-auto text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full font-medium transition-colors">
            Posting
          </button>
        </div>
      </div>

      {/* Post List */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-400 text-sm">Belum ada postingan yang sesuai filter.</p>
          <p className="text-gray-500 text-xs mt-1">Coba ubah filter atau buat postingan baru.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center disabled:opacity-30 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            ‹
          </button>

          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-indigo-50 border border-indigo-300 text-indigo-600'
                    : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center disabled:opacity-30 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}