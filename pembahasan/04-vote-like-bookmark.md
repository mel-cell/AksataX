# 04. Vote, Like, dan Bookmark

## Upvote / Downvote

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts/{id}/vote` | POST | Toggle vote post (upvote/downvote/netral) |
| `/api/v1/comments/{id}/vote` | POST | Toggle vote komentar |

**Controller:** `VoteController.php`
**Model:** `Vote.php` — user_id, target_id, target_type (polymorphic), vote_type (up/down)

**Perhitungan skor:**
- `vote_score` di Post/Comment dihitung: COUNT(up) - COUNT(down)
- Tiap vote dispatch `VoteCast` event → `AwardPoints` listener kasih poin

**Dispatch flow:**
```
VoteController@togglePost
  → VoteCast(post_id, user_id, vote_type)
    → AwardPoints (via queue worker)
      → +10 upvote, -2 downvote untuk vote post
      → +5 upvote, -1 downvote untuk vote comment
```

### Frontend
| Component | Icon | Behavior |
|-----------|------|----------|
| PostCard | ChevronUp / ChevronDown | Vote post, active = orange/blue |
| CommentItem | ChevronUp / ChevronDown | Vote comment, active = green/red |

Vote state disimpan di localStorage per user + post/comment untuk persistensi optimis.

---

## Like

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts/{id}/like` | POST | Toggle like post |
| `/api/v1/comments/{id}/like` | POST | Toggle like comment |

**Controller:** `LikeController.php`
**Model:** `Like.php` — user_id, target_id, target_type (polymorphic)

**Response:** `{ liked: boolean }`

### Frontend
| Component | Icon | Behavior |
|-----------|------|----------|
| PostCard | Heart | Like post, optimis update |
| CommentItem | Heart | Like comment, optimis update |

**Hooks:**
- `useLikePost()` — return `{ liked, toggleLike }`
- `useLikeComment()` — return `{ liked, toggleLike }`

---

## Bookmark

**Label:** [Backend] [Frontend]

### Backend
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/posts/{id}/bookmark` | POST | Toggle bookmark |

**Response:** `{ is_bookmarked: boolean }`
**Model:** `Bookmark.php` — user_id, post_id

### Frontend
| Component | Icon | Behavior |
|-----------|------|----------|
| PostCard | Bookmark icon | Toggle bookmark |

### Flow per Role

**Member:** Vote, like, bookmark bebas
**Moderator & Admin:** Sama seperti member
