# 10. Redis dan Caching

## Arsitektur Redis

**Label:** [Backend]

Aplikasi menggunakan **satu server Redis** dengan **dua database terpisah**:

| Kegunaan | Database Redis | Config Key | Driver |
|----------|---------------|------------|--------|
| **Queue (Antrian)** | `db 0` | `REDIS_DB=0` | `predis` |
| **Cache** | `db 1` | `REDIS_CACHE_DB=1` | `redis` |

Konfigurasi ini ada di `config/database.php`:
```php
'default' => [              // Untuk queue
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_DB', '0'),      // db 0
],
'cache' => [                // Untuk cache
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_CACHE_DB', '1'), // db 1
],
```

### .env terkait Redis
```
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
QUEUE_CONNECTION=redis
CACHE_STORE=redis
```

**Client:** `predis` (library PHP murni, bukan ekstensi C)

---

## 1. Queue Worker (Redis db 0)

**Label:** [Backend]

Semua notifikasi dan event listener yang berat dijalankan **async via queue**.

### Yang di-queue

| Class | Fungsi |
|-------|--------|
| `VoteNotification` | Notifikasi saat post/comment di-vote |
| `CommentNotification` | Notifikasi saat post dikomentari |
| `FollowNotification` | Notifikasi saat di-follow |
| `AnswerAcceptedNotification` | Notifikasi jawaban di-accept |
| `AwardPoints` | Perhitungan poin reputasi + level (listener dari VoteCast) |

Semua class ini implement `ShouldQueue` — otomatis dikirim ke Redis queue.

### Worker

Berjalan di container terpisah `apikel6-worker` dengan command:
```bash
php artisan queue:work redis --sleep=3 --tries=3
```

- `--sleep=3`: tidur 3 detik jika tidak ada job
- `--tries=3`: coba ulang 3x jika gagal, lalu masuk `failed_jobs`

**Tanpa worker ini, semua notifikasi dan poin reputasi tidak akan pernah diproses** — job menumpuk di Redis.

---

## 2. Cache (Redis db 1)

**Label:** [Backend]

Semua operasi cache menggunakan facade `Cache::remember()`, `Cache::forget()`.

### Daftar Cache per Fitur

| Cache Key | TTL | Dipakai di | Di-clear saat |
|-----------|-----|-----------|--------------|
| `tags_all` | 3600s (1 jam) | `TagController@index` | Tag dibuat/diedit/dihapus (via `TagObserver`) |
| `tag_{id}` | 3600s (1 jam) | `TagController@show` | Tag diedit/dihapus |
| `categories_all` | 3600s (1 jam) | `CategoryController@index` | Kategori dibuat/diedit/dihapus (via `CategoryObserver`) |
| `category_{id}` | 3600s (1 jam) | `CategoryController@show` | Kategori diedit/dihapus |
| `user_{id}` | 3600s (1 jam) | `UserController@show` | Profil diupdate, follow/unfollow |
| `post_{id}` | 30s (30 detik) | `PostController@show` | Post diupdate/dihapus (via `PostObserver`) |
| `posts_index_{hash}` | 60s (1 menit) | `PostController@index` | Otomatis expire 60 detik |

### Detail Cache Postingan

#### `post_{id}` — Detail Post (30 detik)

Menyimpan hasil query `Post::with(['user', 'category', 'tags', 'acceptedAnswer'])->withCount(['comments','bookmarks'])`.

TTL pendek (30s) karena:
- `view_count` berubah setiap kali dilihat
- Data harus relatif segar
- Cache di-clear oleh `PostObserver` saat post diupdate/dihapus

#### `posts_index_{hash}` — Listing Post (60 detik)

Key di-hash dari semua parameter query + user ID + page:
```php
$cacheKey = 'posts_index_' . hash('xxh3', json_encode([
    'q' => $request->all(),       // Semua query params
    'uid' => $currentUser?->id ?? 'g',  // User ID atau 'guest'
    'p' => $request->input('page', 1),  // Halaman
    'mod' => $isMod,              // Status moderator
]));
```

TTL 60 detik — cukup untuk mengurangi beban query berulang tanpa data terlalu basi.

### Cache Tags & Kategori (1 jam)

Tags dan kategori jarang berubah, jadi TTL 1 jam aman. Saat ada perubahan (create/update/delete), observer langsung clear cache-nya:

- `TagObserver.php` — `created`/`updated`/`deleted` → `Cache::forget('tags_all')`
- `CategoryObserver.php` — `created`/`updated`/`deleted` → `Cache::forget('categories_all')`

### Cache User (1 jam)

Data user (profil) jarang berubah. Cache di-clear oleh:
- `UserObserver.php` — `updated` → `Cache::forget("user_{$user->id}")`
- `UserController@updateProfile` → manual `Cache::forget`
- `UserController@toggleFollow` → manual `Cache::forget` (karena followers_count berubah)

---

## 3. Infrastruktur Docker

**Label:** [Backend]

### Root docker-compose (`~/MultyApp-Project/docker-compose.yml`)

```yaml
redis:
  image: redis:alpine
  container_name: redis_docker
  command: redis-server --save "" --appendonly no  # No persistence (cache-only)
  ports: ["0.0.0.0:6379:6379"]
  limits: cpus=0.25, memory=128M
```

- **Tanpa persistensi** (`--save "" --appendonly no`) — data Redis boleh hilang karena cache & queue sifatnya sementara
- **Resource terbatas**: 0.25 CPU, 128MB RAM

### Backend docker-compose (`api/apikelompok6/docker/docker-compose.yml`)

```yaml
environment:
  - REDIS_HOST=host.docker.internal
  - REDIS_PORT=6379
  - QUEUE_CONNECTION=redis
  - CACHE_STORE=redis
```

Backend container konek ke Redis yang jalan di host (`host.docker.internal`).

---

## 4. Diagram Alur

```
                         ┌──────────────────┐
                         │   redis_docker    │
                         │  (Redis Alpine)   │
                         │   port 6379       │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
           db 0 (queue)                 db 1 (cache)
                    │                           │
    ┌───────────────┴───────┐       ┌───────────┴───────────┐
    │  Queue Worker         │       │  Cache::remember()    │
    │  (apikel6-worker)     │       │  tags_all (3600s)     │
    │                       │       │  categories_all(3600s)│
    │  VoteNotification     │       │  user_{id} (3600s)    │
    │  AwardPoints          │       │  post_{id} (30s)      │
    │  CommentNotification  │       │  posts_index_{hash}(60s)│
    │  FollowNotification   │       └────────────────────────┘
    │  AnswerAccepted       │
    └───────────────────────┘
```

---

## 5. Catatan Penting

| No | Hal | Keterangan |
|----|-----|-----------|
| 1 | Worker WAJIB jalan | Tanpa worker, notifikasi & poin tidak diproses |
| 2 | Redis db 0 vs db 1 | Queue dan cache dipisah biar saling ganggu |
| 3 | TTL singkat untuk post | View count berubah cepat, cache 30-60 detik cukup |
| 4 | Observer maintain cache | Tag/Category/Post/User observer auto-clear cache saat ada perubahan |
| 5 | `predis` vs `phpredis` | Pakai predis (PHP murni), bukan ekstensi C |
| 6 | Redis tanpa persistensi | Data boleh hilang — hanya cache & queue sementara |
