import type { User } from "./user";
import type { Category } from "./category";
import type { Tag } from "./tag";
import type { Comment } from "./comment";
import type { ModerationLog } from "./moderation";

export interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  status: string;
  vote_score: number;
  view_count: number;
  is_answered: boolean;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
  tags: Tag[];
  comments: Comment[];
  accepted_answer: Comment | null;
  comments_count: number;
  bookmarks_count: number;
  user_vote: string | null;
  user_liked: boolean;
  is_bookmarked: boolean;
  moderation?: ModerationLog | null;
}

export type FilterTab = "Semua" | "Belum Terjawab" | "Terjawab";
export type FilterSort = "Terbaru" | "Terpopuler" | "Vote Terbanyak";

export interface FilterState {
  tab: FilterTab;
  sort: FilterSort;
  tags: string[];
}
