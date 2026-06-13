"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export default function InfiniteScroll({ onLoadMore, hasMore, isLoading }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-6 text-muted-foreground">
      {isLoading && <Loader2 size={18} className="animate-spin" />}
    </div>
  );
}
