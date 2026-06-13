import type { User } from "./user";

export interface Comment {
  id: string;
  body: string;
  vote_score: number;
  is_accepted: boolean;
  status?: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
  replies_count: number;
}
