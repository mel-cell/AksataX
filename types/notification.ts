export interface NotificationData {
  actor_id?: string;
  actor_username?: string;
  actor_avatar_url?: string;
  type: string;
  vote_type?: string;
  reference_id?: string;
  reference_type?: string;
  message?: string;
  level?: number;
  points?: number;
  badge_name?: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}
