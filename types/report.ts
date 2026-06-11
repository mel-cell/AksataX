import type { User } from "./user";

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
}
