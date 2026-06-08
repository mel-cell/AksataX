export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  reputation_points: number;
  created_at: string;
  roles: Role[];
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  posts_count: number;
}

export interface Comment {
  id: string;
  body: string;
  vote_score: number;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;

  user: User;

  replies_count: number;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  status: string;

  vote_score: number;
  view_count: number;
  comments_count: number;
  bookmarks_count: number;

  is_answered: boolean;
  accepted_answer_id: string | null;

  created_at: string;
  updated_at: string;

  user: User;
  category: Category;
  tags: Tag[];

  comments: Comment[];

  user_vote: string | null;
  user_liked: boolean;
  is_bookmarked: boolean;
}
