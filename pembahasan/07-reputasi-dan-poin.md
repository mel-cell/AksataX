# 07. Reputasi dan Poin

## Point System (Reputation)

**Label:** [Backend]

### Model
`PointsLog.php` — mencatat setiap transaksi poin (user_id, points, action_type, reference_id, description)

### Event & Listener Chain

```
VoteCast (event)
  → AwardPoints (listener, via queue)
    → PointsLog::create(...)
    → User::increment('reputation_points', points)
    → User::update(['level' => calculateLevel(reputation_points)])
```

### Point Rules

| Aksi | Poin | Target |
|------|------|--------|
| Upvote post | +10 | Author post |
| Downvote post | -2 | Author post |
| Upvote comment | +5 | Author comment |
| Downvote comment | -1 | Author comment |
| Jawaban di-accept | +15 | Author jawaban |
| Laporan resolved | -5 | Owner konten |

### Level Calculation (Backend)

Level dihitung berdasarkan `reputation_points` di `AwardPoints` listener:

| Rentang Poin | Level |
|-------------|-------|
| 0 - 49 | 1 |
| 50 - 199 | 2 |
| 200 - 499 | 3 |
| 500 - 999 | 4 |
| 1000 - 1999 | 5 |
| 2000 - 4999 | 6 |
| 5000 - 9999 | 7 |
| 10000+ | 8 |

### Frontend

Level ditampilkan dari `profile.level` / `user.level` (langsung dari API backend), bukan dihitung client-side.

| Komponen | File |
|---------|------|
| Profile page | `app/(main)/profile/page.tsx` |
| PostCard | `components/posts/PostCard.tsx` |
| UserTable | `components/ui/UserTable.tsx` |
| Sidebar | `components/layout/sidebar.tsx` |
| CommentItem | `components/ui/CommentItem.tsx` |

### Flow per Role

Semua role mendapatkan poin dengan aturan yang sama — tidak ada bonus khusus untuk moderator/admin.
