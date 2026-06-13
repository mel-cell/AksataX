export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      avatar_url: string;
      bio: string;
      reputation_points: number;
      created_at: string;
      roles: {
        id: string;
        name: string;
      }[];
      followers_count: number;
      following_count: number;
      posts_count: number;
    };
    token: string;
  };
  errors?: Record<string, string[]>;
}
