import type { User } from "./user";

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  vote_score: number;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  user: Pick<User, "id" | "username" | "avatar_url">;
  replies?: Comment[];
}
