export interface ModerationLog {
  id: string;
  action: "hide" | "restore";
  reason: string | null;
  moderator: {
    id: string;
    username: string;
  };
  created_at: string;
}
