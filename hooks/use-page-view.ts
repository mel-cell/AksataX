"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

const SESSION_KEY = "pv_session_id";
const SESSION_TIME_KEY = "pv_session_start";
const SESSION_TTL = 30 * 60 * 1000;

function getOrCreateSession(): string {
  const stored = localStorage.getItem(SESSION_KEY);
  const storedTime = localStorage.getItem(SESSION_TIME_KEY);
  const now = Date.now();

  if (stored && storedTime && now - Number(storedTime) < SESSION_TTL) {
    return stored;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  localStorage.setItem(SESSION_TIME_KEY, String(now));
  return id;
}

export function usePageView() {
  const pathname = usePathname();
  const lastUrl = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === lastUrl.current) return;
    lastUrl.current = pathname;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const sessionId = getOrCreateSession();
      api.post("/page-views", {
        session_id: sessionId,
        url: pathname,
        referer: document.referrer || null,
      }).catch(() => {});
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname]);
}
