import { NextResponse } from "next/server";
import posts from "@/data/posts.json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ success: false, message: "Data tidak ditemukan", data: null }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "ok", data: post });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop();
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ success: false, message: "Data tidak ditemukan", data: null }, { status: 404 });
  }

  if (action === "like") {
    return NextResponse.json({ success: true, message: "ok", data: { liked: !post.user_liked } });
  }

  if (action === "bookmark") {
    return NextResponse.json({ success: true, message: "ok", data: { is_bookmarked: !post.is_bookmarked } });
  }

  return NextResponse.json({ success: false, message: "Aksi tidak dikenal", data: null }, { status: 400 });
}
