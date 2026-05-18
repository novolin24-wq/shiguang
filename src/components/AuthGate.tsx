"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-stage flex items-center justify-center">
        <div className="text-ink-faded/60 text-sm font-serif">食光</div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
