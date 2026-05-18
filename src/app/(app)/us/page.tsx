"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AvatarPair } from "@/components/us/Avatar";
import { Stats } from "@/components/us/Stats";
import { FuncList } from "@/components/us/FuncList";
import { BindFlow } from "@/components/us/BindFlow";

interface PartnerInfo {
  uid: string;
  phone: string;
}

export default function UsPage() {
  const { user, logout } = useAuth();
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const { getPartner } = await import("@/lib/relation");
        const p = await getPartner(user.uid);
        if (!cancelled) setPartner(p);
      } catch {
        // no partner
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-ink-faded text-sm">加载中…</div>
      </div>
    );
  }

  const bound = !!partner;

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-serif text-[22px] text-ink leading-none tracking-wide">
          我们
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-[11px] text-ink-faded hover:text-ink-soft transition-colors"
        >
          退出登录
        </button>
      </div>

      {bound ? (
        <>
          {/* Hero · Bound */}
          <header className="flex flex-col items-center gap-3 py-4">
            <AvatarPair
              a={nameChar(user?.phone)}
              b={nameChar(partner?.phone)}
            />
            <div className="text-center">
              <h1 className="text-[18px] font-serif text-ink leading-snug">
                {maskPhone(user?.phone ?? "")}
                <span className="text-accent-soft"> &amp; </span>
                {maskPhone(partner?.phone ?? "")}
              </h1>
            </div>
          </header>

          <Stats userId={user?.uid} partnerId={partner?.uid} />
          <FuncList partnerPhone={partner?.phone} />
        </>
      ) : (
        <BindFlow />
      )}

      {/* Footer */}
      <div className="text-center text-[10px] text-ink-faded/60 pt-4 pb-2">
        食光 · 0.5.0 · 你记下的，只在你这里
      </div>
    </div>
  );
}

function nameChar(phone?: string) {
  if (!phone) return "?";
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-1);
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 11) {
    return digits.slice(0, 3) + "****" + digits.slice(-4);
  }
  return phone;
}
