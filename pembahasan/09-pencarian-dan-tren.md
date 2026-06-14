# 09. Pencarian dan Tren

## Search Postingan

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/search/posts` | GET | Cari postingan |
| `/api/v1/search/comments` | GET | Cari komentar |
| `/api/v1/search/users` | GET | Cari user |

**Controller:** `SearchController.php`
**Search Engine:** Laravel Scout + Meilisearch (atau database fallback)

### Frontend
| Halaman | File |
|---------|------|
| Search | `app/(main)/search/page.tsx` |
| Search bar | `components/layout/Navbar.tsx` |

---

## Trending / Popular Posts

**Label:** [Frontend]

**Halaman:** `app/(main)/trending/page.tsx`

**Logic:** Postingan diurutkan berdasarkan `vote_score` atau `view_count` — sorting via query param di `/api/v1/posts?sort=view_count&order=desc`

### Flow per Role

Semua role bisa akses search dan trending. Tidak ada batasan.
