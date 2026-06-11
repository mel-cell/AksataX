"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/use-auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.push("/");
    }
  }, [router]);

  if (getToken()) return null;

  return <>{children}</>;
}
