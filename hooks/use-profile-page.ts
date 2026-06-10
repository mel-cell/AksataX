import { useState } from "react";

const DUMMY_CURRENT_USER = {
  id: "u001",
  username: "budi_dev",
};

const DUMMY_PROFILE = {
  id: "u002",
  username: "anisa_ui",
  name: "Anisa Putri",
  bio: "UI/UX Designer & Frontend Dev 🎨 | Ngoding sambil ngopi ☕ | Open for collab!",
  avatar: "https://i.pravatar.cc/150?img=47",
  postsCount: 24,
  followersCount: 1340,
  followingCount: 287,
  isFollowing: false,
};

const DUMMY_POSTS = [
  {
    id: "p1",
    title: "Redesign Landing Page Klien",
    body: "Baru selesai redesign landing page klien, hasilnya cukup memuaskan!",
    user: { username: "anisa_ui" },
    category: { name: "Design" },
    comments_count: 12,
    view_count: 340,
    user_liked: false,
    is_bookmarked: false,
  },
  {
    id: "p2",
    title: "Tips Tailwind CSS yang Jarang Diketahui",
    body: "Gunakan @apply di CSS global untuk class yang sering dipakai biar lebih rapi.",
    user: { username: "anisa_ui" },
    category: { name: "Frontend" },
    comments_count: 38,
    view_count: 912,
    user_liked: true,
    is_bookmarked: false,
  },
  {
    id: "p3",
    title: "Kesan Ikut Meetup Next.js",
    body: "Senang banget bisa ikut meetup Next.js kemarin! Banyak insight baru soal App Router.",
    user: { username: "anisa_ui" },
    category: { name: "Event" },
    comments_count: 7,
    view_count: 210,
    user_liked: false,
    is_bookmarked: true,
  },
];

const DUMMY_FOLLOWERS = [
  { id: "u003", username: "rizky_fs", name: "Rizky Fullstack", avatar: "https://i.pravatar.cc/150?img=12", isFollowing: true },
  { id: "u004", username: "mila_design", name: "Mila Designer", avatar: "https://i.pravatar.cc/150?img=21", isFollowing: false },
  { id: "u005", username: "dani_code", name: "Dani Coder", avatar: "https://i.pravatar.cc/150?img=33", isFollowing: true },
];

const DUMMY_FOLLOWING = [
  { id: "u006", username: "tegar_be", name: "Tegar Backend", avatar: "https://i.pravatar.cc/150?img=15", isFollowing: true },
  { id: "u007", username: "sari_react", name: "Sari React Dev", avatar: "https://i.pravatar.cc/150?img=25", isFollowing: true },
];

export const TABS = [
  { key: "posts", label: "Postingan" },
  { key: "followers", label: "Pengikut" },
  { key: "following", label: "Mengikuti" },
];

export type TabKey = "posts" | "followers" | "following";

export function useProfilePage(username: string) {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const isOwnProfile = username === DUMMY_CURRENT_USER.username;

  const tabContent = {
    posts: DUMMY_POSTS,
    followers: DUMMY_FOLLOWERS,
    following: DUMMY_FOLLOWING,
  };

  return {
    profile: DUMMY_PROFILE,
    activeTab,
    setActiveTab,
    tabContent,
    isOwnProfile,
  };
}