"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";
import Link from "next/link";
import { getToken } from "@/hooks/use-auth";

export default function UserHoverCard({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["user-hover", username],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>(
        `/users/by-username/${username}`
      );
      return data.data;
    },
    enabled: show && !!username && !!getToken(),
  });

  const handleMouseEnter = () => {
    timer.current = setTimeout(() => setShow(true), 500);
  };

  const handleMouseLeave = () => {
    if (timer.current) clearTimeout(timer.current);
    setShow(false);
  };

  if (!username) return <>{children}</>;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && user && (
        <div
          className="absolute z-50 top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl p-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/user/${username}`}
            className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
            onClick={() => setShow(false)}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600 flex-shrink-0">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">
                {username}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{username}
              </p>
            </div>
          </Link>
          {user.bio && (
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
              {user.bio}
            </p>
          )}
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>
              <strong className="text-card-foreground">{user.posts_count}</strong>{" "}
              postingan
            </span>
            <span>
              <strong className="text-card-foreground">
                {user.followers_count}
              </strong>{" "}
              pengikut
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
