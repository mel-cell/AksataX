# 01. Autentikasi dan Multi-Role

## Register & Login

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Middleware | Deskripsi |
|----------|--------|-----------|-----------|
| `/api/v1/register` | POST | `throttle:auth` | Registrasi user baru |
| `/api/v1/login` | POST | `throttle:auth` | Login, return token |
| `/api/v1/logout` | POST | `auth:sanctum` | Hapus token |
| `/api/v1/user` | GET | `auth:sanctum` | Data user saat ini |

**Controller:** `AuthController.php`
**Model:** `User.php` — UUID primary key, roles via pivot `user_roles`

### Frontend
| Halaman | File |
|---------|------|
| Login | `app/(auth)/login/page.tsx` |
| Register | `app/(auth)/register/page.tsx` |
| Token management | `hooks/use-auth.ts` |

---

## Multi-Role System

**Label:** [Backend]

### Role Structure
Tiga role: `member` (default), `moderator`, `admin`.

- Tabel `roles` berisi seed: member, moderator, admin
- Relasi many-to-many via `user_roles` (user_id, role_id, assigned_at)
- Middleware `CheckRole.php` — `role:moderator,admin` atau `role:admin`

### Flow per Role

**Member:**
- Default saat register
- Bisa CRUD postingan sendiri, komentar, vote, like, bookmark
- Tidak bisa moderasi konten orang lain
- Tidak bisa akses halaman admin

**Moderator:**
- Bisa shadow ban user, warn user
- Bisa moderasi post/komentar (hide/restore)
- Bisa lihat & resolve report
- Bisa lihat daftar semua user
- **Tidak bisa** ban permanent, kelola kategori/tag

**Admin:**
- Semua akses moderator
- Bisa ban permanent user (toggleBan)
- Bisa CRUD kategori & tag
- Bisa akses dashboard statistik

### Route Groups
```php
// Moderator + Admin
Route::middleware(['role:moderator,admin'])->group(function () {
    '/users', '/users/{id}/shadow-ban', '/users/{id}/warn',
    '/reports', '/reports/{id}/resolve',
    '/posts/{id}/moderate', '/comments/{id}/moderate'
});

// Admin only
Route::middleware(['role:admin'])->group(function () {
    '/admin/dashboard',
    '/users/{id}/ban',
    '/categories', '/tags' (write operations)
});
```
