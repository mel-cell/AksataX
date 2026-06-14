# 06. Notifikasi dan Laporan

## Sistem Notifikasi

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/notifications` | GET | Daftar notifikasi (paginated) |
| `/api/v1/notifications/unread-count` | GET | Jumlah notifikasi belum dibaca |
| `/api/v1/notifications/read-all` | PATCH | Tandai semua sudah dibaca |
| `/api/v1/notifications/{id}/read` | PATCH | Tandai satu notifikasi dibaca |
| `/api/v1/notifications/{id}` | DELETE | Hapus notifikasi |
| `/api/v1/notifications` | DELETE | Hapus semua notifikasi |

**Semua notifikasi menggunakan queue Redis** (`ShouldQueue` + `queue:work redis`).

### Jenis Notifikasi

| Class | Trigger | Dikirim ke |
|-------|---------|-----------|
| `VoteNotification` | Post/comment di-vote | Owner post/comment |
| `CommentNotification` | Post dikomentari | Owner post |
| `FollowNotification` | User di-follow | User yang di-follow |
| `AnswerAcceptedNotification` | Jawaban di-accept | Author jawaban |
| `ReportCreatedNotification` | Laporan baru dibuat | Semua moderator + admin |
| `ReportResolvedNotification` | Laporan di-resolve/dismiss | Pelapor |
| `ContentModeratedNotification` | Konten di-moderate | Owner konten |
| `PostAppealNotification` | Banding post | Semua moderator + admin |

### Tipe Notifikasi Frontend

| Type (dari backend) | Handler Frontend |
|--------------------|-----------------|
| `vote` | " memberi vote pada [postingan/komentar] mu" |
| `comment` | " mengomentari postingan mu" |
| `follow` | " mulai mengikuti mu" |
| `answer_accepted` | " menerima jawaban mu" |
| `report_resolved` | "Laporan yang kamu buat telah selesai (resolved)" |
| `report_created` | "Laporan baru masuk" |
| `content_moderated` | "Konten mu telah di-moderate" |
| `user_status` | "Kamu telah mendapat peringatan" (warned) |
| `post_appeal` | "Banding untuk post masuk" |

### Frontend
| Halaman | File |
|---------|------|
| Notifikasi | `app/(main)/notifications/page.tsx` |
| Dropdown | `components/layout/NotificationDropdown.tsx` |

---

## Report / Flag Konten

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Akses | Deskripsi |
|----------|--------|-------|-----------|
| `/api/v1/reports/reasons` | GET | Public | Daftar alasan report |
| `/api/v1/reports` | POST | Auth | Buat laporan |
| `/api/v1/reports` | GET | Mod/Admin | Daftar laporan |
| `/api/v1/reports/{id}` | GET | Mod/Admin | Detail laporan |
| `/api/v1/reports/{id}/resolve` | PATCH | Mod/Admin | Selesaikan laporan |

**Model:** `Report.php` — target_type (post/comment/user), status (pending/resolved/dismissed)

**Resolve flow:**
```
Resolve (resolved):
  1. Konten target → status = hidden
  2. Owner konten → -5 poin reputasi
  3. Kirim ContentModeratedNotification ke owner
  4. Kirim ReportResolvedNotification ke pelapor

Resolve (dismissed):
  1. Konten tetap (tidak diubah)
  2. Kirim ReportResolvedNotification ke pelapor (dismissed)
```

### Flow per Role

**Member:**
- Bisa lapor konten (post/comment/user)
- Bisa lihat notifikasi hasil laporannya
- Bisa banding (appeal) jika postingannya di-moderate

**Moderator:**
- Bisa lihat semua laporan
- Bisa resolve/dismiss laporan
- Bisa hide/restore konten dari halaman laporan

**Admin:**
- Sama seperti moderator
