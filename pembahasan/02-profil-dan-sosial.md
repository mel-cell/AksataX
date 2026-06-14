# 02. Profil dan Sosial

## Profil User

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/profile` | GET | Profil user sendiri |
| `/api/v1/profile` | PUT | Update profil (bio, avatar) |
| `/api/v1/profile/password` | PUT | Update password |
| `/api/v1/profile/avatar` | DELETE | Hapus avatar |
| `/api/v1/profile` | DELETE | Hapus akun |
| `/api/v1/users/by-username/{username}` | GET | Cari user by username |
| `/api/v1/users/{id}` | GET | Detail user |

**Controller:** `ProfileController.php`, `UserController.php`

**Avatar upload:** Menggunakan `api.put` dengan FormData langsung — method spoofing (`_method=PUT`) tidak support di Laravel API routes.

### Frontend
| Halaman | File |
|---------|------|
| Settings | `app/(main)/settings/page.tsx` |
| Profile | `app/(main)/profile/page.tsx` |
| Profile user lain | `app/(main)/user/[username]/page.tsx` |

---

## Follow/Unfollow

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/users/{id}/follow` | POST | Toggle follow/unfollow |
| `/api/v1/users/{id}/followers` | GET | Daftar followers |
| `/api/v1/users/{id}/following` | GET | Daftar following |

**Model:** `Follow.php` — follower_id, following_id

### Flow per Role

**Member:**
- Bisa follow/unfollow user lain
- Bisa lihat followers & following

**Moderator & Admin:**
- Sama seperti member
- Tidak ada fitur follow khusus untuk moderator
