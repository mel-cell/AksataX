# Pembahasan Fitur AksataX

Dokumentasi fitur-fitur aplikasi forum AksataX, dibagi per modul dengan label backend/frontend dan flow untuk setiap role user.

## Daftar Modul

| # | File | Fitur |
|---|------|-------|
| 01 | [Autentikasi dan Multi-Role](./01-autentikasi-dan-role.md) | Register, Login, Role member/moderator/admin |
| 02 | [Profil dan Sosial](./02-profil-dan-sosial.md) | Profil, Avatar, Follow/Unfollow |
| 03 | [Postingan dan Komentar](./03-postingan-dan-komentar.md) | CRUD Post, Nested Comment, Edit History, Accepted Answer |
| 04 | [Vote, Like, dan Bookmark](./04-vote-like-bookmark.md) | Upvote/Downvote, Like, Bookmark |
| 05 | [Tag dan Kategori](./05-tag-dan-kategori.md) | Manajemen Tag, Kategori, Filter |
| 06 | [Notifikasi dan Laporan](./06-notifikasi-dan-laporan.md) | Notifikasi realtime, Report/Flag konten |
| 07 | [Reputasi dan Poin](./07-reputasi-dan-poin.md) | Point system, Level, Reputation |
| 08 | [Moderasi dan Admin](./08-moderasi-dan-admin.md) | Shadow Ban, Warn, Ban, Dashboard Statistik, Page View Tracking |
| 09 | [Pencarian dan Tren](./09-pencarian-dan-tren.md) | Search, Trending/Popular |
| 10 | [Redis dan Caching](./10-redis-dan-caching.md) | Queue worker, Cache strategy, Infrastruktur |

## Label

- **[Backend]** — Implementasi di Laravel (`api/apikelompok6/`)
- **[Frontend]** — Implementasi di Next.js (`api/AksataX/`)

## Role User

| Role | Akses |
|------|-------|
| **Member** | Fitur dasar: posting, comment, vote, like, bookmark, follow, notifikasi |
| **Moderator** | Semua fitur member + moderasi konten, shadow ban, warn, resolve report |
| **Admin** | Semua fitur moderator + ban permanent, CRUD kategori/tag, dashboard statistik |

> **Catatan:** Leaderboard, Badge/Achievement tidak diimplementasikan (skip by design).
