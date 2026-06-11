export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url: string;
  bio: string | null;
  reputation_points: number;
  level: number;
  created_at: string;
  roles: Role[];
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following?: boolean;
}
