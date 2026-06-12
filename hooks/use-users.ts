"use client";

import { User } from "@/types/user";

const MOCK_USERS: User[] = [
  {
    id: "usr_001",
    username: "andi_pratama",
    email: "andi@example.com",
    avatar_url: "",
    bio: "Frontend developer yang suka ngopi sambil coding.",
    reputation_points: 1240,
    level: 5,
    created_at: "2024-01-12T08:00:00Z",
    roles: [{ id: "role_1", name: "user" }],
    followers_count: 120,
    following_count: 85,
    posts_count: 34,
  },
  {
    id: "usr_002",
    username: "siti_rahayu",
    email: "siti@example.com",
    avatar_url: "",
    bio: "UI/UX designer.",
    reputation_points: 870,
    level: 4,
    created_at: "2024-02-08T10:30:00Z",
    roles: [{ id: "role_1", name: "user" }],
    followers_count: 200,
    following_count: 60,
    posts_count: 21,
  },
  {
    id: "usr_003",
    username: "budi_mod",
    email: "budi@example.com",
    avatar_url: "",
    bio: null,
    reputation_points: 3500,
    level: 10,
    created_at: "2023-11-20T07:00:00Z",
    roles: [
      { id: "role_1", name: "user" },
      { id: "role_2", name: "moderator" },
    ],
    followers_count: 450,
    following_count: 30,
    posts_count: 88,
  },
  {
    id: "usr_004",
    username: "dewi_banned",
    email: "dewi@example.com",
    avatar_url: "",
    bio: null,
    reputation_points: 50,
    level: 1,
    created_at: "2024-03-01T14:00:00Z",
    roles: [{ id: "role_3", name: "banned" }],
    followers_count: 10,
    following_count: 5,
    posts_count: 3,
  },
  {
    id: "usr_005",
    username: "raka_wijaya",
    email: "raka@example.com",
    avatar_url: "",
    bio: "Gamer & content creator.",
    reputation_points: 610,
    level: 3,
    created_at: "2024-04-15T09:00:00Z",
    roles: [{ id: "role_4", name: "suspended" }],
    followers_count: 75,
    following_count: 90,
    posts_count: 15,
  },
];

export function useUsers() {
  return {
    data: MOCK_USERS,
    isLoading: false,
    isError: false,
  };
}