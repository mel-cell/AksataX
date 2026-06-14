# 08. Moderasi dan Admin

## Shadow Ban

**Label:** [Backend]

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/users/{id}/shadow-ban` | PATCH | Toggle shadow ban |

**Model:** `ShadowBan.php` — expires_at, restriction_type (post/comment/both)
**Middleware:** `User.php@canCreatePosts()` dan `canCreateComments()` — dicek sebelum create.

Shadow ban membatasi user tanpa memberi tahu — post/comment akan di-reject dengan pesan error umum.

---

## Warning User

**Label:** [Backend] [Frontend]

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/users/{id}/warn` | POST | Kirim peringatan ke user |

**Flow:**
```
Moderator warn user:
  1. Validasi reason (required)
  2. Kirim notifikasi ContentModeratedNotification? 
     — Tidak, langsung kirim notifikasi via database notification
     — User_status notification dengan action = 'warned'
  3. Catat ke ModerationLog
```

**Frontend:** Tombol "Peringatkan" di tabel user (UserTable), tersedia untuk moderator & admin.

---

## Ban Permanent

**Label:** [Backend] [Frontend]

| Endpoint | Method | Akses | Deskripsi |
|----------|--------|-------|-----------|
| `/api/v1/users/{id}/ban` | PATCH | Admin | Toggle ban user |

**Model:** `User.php` — field `is_banned` (boolean)

**Effect:** User yang di-ban tidak bisa login (dicek di middleware/auth).

**Frontend:** Tombol "Ban" hanya muncul untuk admin (di UserTable).

---

## Moderator Action Log

**Label:** [Backend]

**Model:** `ModerationLog.php` — mencatat semua aksi moderasi:
- moderator_id, target_type, target_id, action (hide/restore/warn/ban/shadow_ban), reason, created_at

Moderation Log di-create saat:
- Post di-moderate (hide/restore)
- Comment di-moderate (hide/restore)
- User di-warn
- User di-shadow ban
- User di-ban

---

## User List (Management)

**Label:** [Backend] [Frontend]

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/users` | GET | Daftar semua user (paginated, searchable) |

**Frontend:** `components/ui/UserTable.tsx` — tabel dengan fitur:
- Search by username/email
- Filter role
- Status (banned, shadow banned, active)
- Action: Peringatkan, Shadow Ban, Ban (admin only)

---

## Admin Dashboard

**Label:** [Backend] [Frontend]

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/admin/dashboard?range=7` | GET | Statistik dashboard |

### Data yang dikembalikan

```json
{
  "stats": [
    { "label": "Active Today", "value": "1284", "change": 12.4, "icon": "users" },
    { "label": "New Session", "value": "3921", "change": 8.1, "icon": "activity" },
    { "label": "Avg. Duration", "value": "4m 32s", "change": -2.3, "icon": "clock" },
    { "label": "Bounce Rate", "value": "24,1%", "change": -5.6, "icon": "trending-down" }
  ],
  "peakHour": "14.00 – 15.00",
  "activeToday": 1284,
  "trafficData": [...],
  "reportsData": [...],
  "overviewData": [...],
  "recentActivity": [...]
}
```

### Page View Tracking

**Label:** [Backend] [Frontend]

**Backend:** `PageViewController.php` — `POST /api/v1/page-views` (public, throttled 60/1min)
**Frontend:** `hooks/use-page-view.ts` — generate session_id (localStorage, 30 min TTL), POST otomatis tiap navigasi via `PageViewTracker` component

**Database:** `page_views` table — session_id, url, user_id (nullable), ip_address, user_agent, referer, visited_at

**Dashboard perhitungan:**
- Active Today → COUNT(DISTINCT session_id) hari ini
- Avg Duration → rata-rata (MAX - MIN visited_at) per session
- Bounce Rate → sessions dengan 1 page view / total sessions
- Peak Hour → jam dengan page view terbanyak

### Frontend
| Halaman | File |
|---------|------|
| Dashboard | `app/(main)/admin/dashboard/page.tsx` |
| Dashboard view | `components/admin/dashboard/index.tsx` |
| Stat card | `components/admin/dashboard/stat-card.tsx` |
| Traffic chart | `components/admin/dashboard/charts/traffic-chart.tsx` |
| Reports chart | `components/admin/dashboard/charts/reports-chart.tsx` |
| Overview chart | `components/admin/dashboard/charts/overview-chart.tsx` |

### Flow per Role

**Member:** Tidak ada akses ke halaman moderasi/admin.

**Moderator:**
- Shadow ban user
- Warn user
- Moderasi post/comment (hide/restore)
- Lihat & resolve report
- Lihat daftar user
- **Tidak bisa** ban permanent, kelola kategori/tag, lihat dashboard

**Admin:**
- Semua akses moderator
- Ban permanent user
- CRUD kategori & tag
- Akses dashboard statistik (`/admin/dashboard`)
