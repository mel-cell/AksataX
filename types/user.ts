export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  level: number;
  is_banned: boolean;
  created_at: string;
  roles: { id: string; name: string }[];
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
}
