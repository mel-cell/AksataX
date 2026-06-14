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
  action?: string;
  reason?: string;
  post_title?: string;
  post_id?: string;
  target_type?: string;
  target_id?: string;
  appeal_reason?: string;
  author_id?: string;
  report_id?: string;
  outcome?: string;
  resolver_id?: string;
  resolver_username?: string;
  moderator_id?: string;
  moderator_username?: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}
