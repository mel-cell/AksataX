import type { User } from "./user";

export interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: "post" | "comment";
  reason: string;
  description: string | null;
  status: "pending" | "resolved" | "dismissed";
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter: Pick<User, "id" | "username">;
  resolver?: Pick<User, "id" | "username"> | null;
}
