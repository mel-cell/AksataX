export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
  posts_count?: number;
}
