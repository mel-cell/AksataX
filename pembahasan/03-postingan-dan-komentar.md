# 03. Postingan dan Komentar

## CRUD Postingan

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts` | GET | Daftar post (dengan filter, search, pagination) |
| `/api/v1/posts` | POST | Buat post baru |
| `/api/v1/posts/{id}` | GET | Detail post |
| `/api/v1/posts/{id}` | PUT | Update post (owner/moderator) |
| `/api/v1/posts/{id}` | DELETE | Soft delete (status = deleted) |

**Controller:** `PostController.php`
**Model:** `Post.php` — UUID, status field (open/hidden/deleted)

**Optimasi listing (index):**
- Body di-truncate ke 200 karakter (`strip_tags` + `Str::limit`)
- `withCount(['comments', 'bookmarks'])` untuk jumlah komentar & bookmark
- Cache Redis 60 detik per kombinasi query
- Eager load roles untuk cek moderator (gak ada lazy load)

### Frontend
| Halaman | File |
|---------|------|
| Beranda (feed) | `app/(main)/page.tsx` |
| Detail post | `app/(main)/posts/[id]/page.tsx` |
| Buat post | `app/(main)/posts/create/page.tsx` |
| Post card | `components/posts/PostCard.tsx` |
| Infinite scroll | `components/ui/InfiniteScroll.tsx` |

---

## Komentar & Reply (Nested)

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts/{id}/comments` | GET | Komentar per post |
| `/api/v1/posts/{id}/comments` | POST | Tambah komentar |
| `/api/v1/comments/{id}` | PUT | Edit komentar |
| `/api/v1/comments/{id}` | DELETE | Hapus komentar |
| `/api/v1/comments/{id}/history` | GET | Riwayat edit komentar |

**Model:** `Comment.php` — parent_id untuk nested replies, is_accepted, status

### Frontend
| Komponen | File |
|---------|------|
| Comment item | `components/ui/CommentItem.tsx` |
| Comment form | `components/ui/CommentForm.tsx` |

---

## Edit History

**Label:** [Backend]

**Post:** `PostEditHistory.php` — menyimpan body_before, body_after, reason, edited_by
**Comment:** `CommentEditHistory.php` — menyimpan body_before, body_after, reason, edited_by

Frontend menampilkan riwayat di halaman detail post/komentar (khusus owner & moderator).

---

## Mark as Accepted Answer

**Label:** [Backend] [Frontend]

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts/{postId}/accept/{commentId}` | PATCH | Tandai komentar sebagai jawaban |

**Flow:**
1. Hanya **owner post** yang bisa accept answer
2. Jika sudah ada jawaban sebelumnya, di-unset dulu
3. Dispatch event `AnswerAccepted` untuk kasih poin (+15) via `AwardPoints` listener
4. Kirim `AnswerAcceptedNotification` ke author komentar

### Flow per Role

**Member:**
- CRUD postingan sendiri
- Nested comment & reply
- Accept answer (hanya untuk post milik sendiri)

**Moderator:**
- Bisa edit/hapus postingan & komentar **siapa pun**
- Bisa hide/restore konten via `/posts/{id}/moderate` dan `/comments/{id}/moderate`
- Gak bisa accept answer (hanya owner post)

**Admin:**
- Sama seperti moderator
