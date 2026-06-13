import type { User } from "./user";
import type { Post } from "./post";
import type { Comment } from "./comment";

export interface Report {
  id: string;
  target_id: string;
  target_type: "post" | "comment";
  reason: string;
  description: string | null;
  status: "pending" | "resolved";
  created_at: string;
  resolved_at: string | null;
  reporter: User;
  resolver: User | null;
  post?: Post & { user: User };
  comment?: Comment & { user: User };
}
