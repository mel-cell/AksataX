# 05. Tag dan Kategori

## Kategori

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Akses | Deskripsi |
|----------|--------|-------|-----------|
| `/api/v1/categories` | GET | Public | Daftar kategori |
| `/api/v1/categories/{id}` | GET | Public | Detail kategori |
| `/api/v1/categories` | POST | Admin | Buat kategori |
| `/api/v1/categories/{id}` | PUT | Admin | Update kategori |
| `/api/v1/categories/{id}` | DELETE | Admin | Hapus kategori |

**Controller:** `CategoryController.php`
**Model:** `Category.php` — parent_id untuk sub-kategori, slug

**Cache:** `Cache::remember('categories_all', 3600, ...)` — 1 jam

---

## Tag

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Akses | Deskripsi |
|----------|--------|-------|-----------|
| `/api/v1/tags` | GET | Public | Daftar tag |
| `/api/v1/tags/{id}` | GET | Public | Detail tag |
| `/api/v1/tags` | POST | Auth | Buat tag |
| `/api/v1/tags/{id}` | PUT | Admin | Update tag |
| `/api/v1/tags/{id}` | DELETE | Admin | Hapus tag |

**Controller:** `TagController.php`
**Model:** `Tag.php` — color field, slug

**Cache:** `Cache::remember('tags_all', 3600, ...)` — 1 jam

---

## Filter by Tag/Kategori/User

**Label:** [Frontend]

**FilterBar component:** `components/posts/FilterBar.tsx`
- Tab: Semua / Belum Terjawab / Terjawab
- Sort: Terbaru / Terpopuler / Vote Terbanyak
- Filter tag chips

**Filter di URL:** Search page menggunakan query params (`?tag=slug`, `?category=slug`, `?user=id`)

### Flow per Role

**Member:** Bisa lihat filter, tag, kategori
**Moderator:** Sama seperti member
**Admin:** Bisa CRUD kategori & tag. Member biasa cuma bisa lihat.
