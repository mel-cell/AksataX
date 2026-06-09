import { NextResponse } from "next/server";
import posts from "@/data/posts.json";

export async function GET() {
  const data = posts.map(({ comments, ...p }) => ({
    ...p,
    comments_count: comments.length,
  }));

  return NextResponse.json({ success: true, message: "ok", data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = {
    id: `post-${Date.now()}`,
    title: body.title,
    body: body.body,
    slug: body.title.toLowerCase().replace(/\s+/g, "-"),
    status: "published",
    vote_score: 0,
    view_count: 0,
    comments_count: 0,
    bookmarks_count: 0,
    is_answered: false,
    accepted_answer_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: "user-1",
      username: "kingnasir17",
      avatar_url: "",
      bio: "",
      reputation_points: 0,
      created_at: "",
      roles: [],
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
    },
    category: { id: body.category_id, name: "Unknown", slug: "unknown", description: "" },
    tags: [],
    comments: [],
    user_vote: null,
    user_liked: false,
    is_bookmarked: false,
  };
  return NextResponse.json({ success: true, message: "Postingan berhasil dibuat", data: newPost }, { status: 201 });
}
