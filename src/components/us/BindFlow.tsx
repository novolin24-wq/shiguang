"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar } from "./Avatar";

type View = "idle" | "generated" | "input";

const INVITE_TTL_MS = 24 * 60 * 60 * 1000;

export function BindFlow() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("idle");
  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [remaining, setRemaining] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown for generated invite code
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setRemaining("已过期");
        setView("idle");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setRemaining(`${h}h ${m}m`);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const handleGenerate = useCallback(async () => {
    if (!user) return;
    setError("");
    setBusy(true);
    try {
      const { generateInviteCode } = await import("@/lib/relation");
      const code = await generateInviteCode(user.uid);
      setInviteCode(code);
      setExpiresAt(Date.now() + INVITE_TTL_MS);
      setView("generated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setBusy(false);
    }
  }, [user]);

  const handleAccept = useCallback(async () => {
    if (!user) return;
    setError("");
    setBusy(true);
    try {
      const { acceptInvite } = await import("@/lib/relation");
      await acceptInvite(inputCode, user.uid);
      setSuccess("绑定成功！刷新页面即可看到");
      // Reload after a moment to refresh partner state
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "绑定失败");
    } finally {
      setBusy(false);
    }
  }, [user, inputCode]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setSuccess("已复制");
      setTimeout(() => setSuccess(""), 1500);
    });
  }, [inviteCode]);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="text-accent text-[14px]">{success}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Single avatar */}
      <Avatar ch={user?.phone?.slice(-1) ?? "我"} size={64} />
      <div className="text-center">
        <div className="text-[15px] font-serif text-ink">
          {user?.phone ? maskPhone(user.phone) : "我"}
        </div>
        <div className="text-[11px] text-ink-faded mt-1">
          还没有绑定伙伴
        </div>
      </div>

      {error && (
        <p className="text-[12px] text-[#C05040] text-center">{error}</p>
      )}

      {view === "idle" && (
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={busy}
            className="w-full h-11 rounded-lg text-white text-[14px] font-medium transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {busy ? "生成中…" : "生成邀请码"}
          </button>
          <button
            type="button"
            onClick={() => setView("input")}
            className="w-full h-11 rounded-lg border border-divider text-[14px] text-ink-soft transition-colors"
          >
            我有邀请码
          </button>
        </div>
      )}

      {view === "generated" && (
        <div className="w-full space-y-3">
          <div className="bg-bg-card rounded-lg py-5 text-center shadow-soft">
            <div className="text-[32px] font-serif text-accent tracking-[0.4em] leading-none">
              {inviteCode}
            </div>
            <div className="text-[11px] text-ink-faded mt-2">
              有效期 {remaining}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="flex-1 h-10 rounded-lg border border-divider text-[13px] text-ink-soft"
            >
              复制
            </button>
            <button
              type="button"
              onClick={() => {
                const text = `来食光一起记录吧！我的邀请码：${inviteCode}`;
                if (!navigator.share) {
                  navigator.clipboard.writeText(text);
                  setSuccess("已复制到剪贴板");
                  setTimeout(() => setSuccess(""), 1500);
                  return;
                }
                navigator.share({ text }).catch(() => {
                  navigator.clipboard.writeText(text);
                  setSuccess("已复制到剪贴板");
                  setTimeout(() => setSuccess(""), 1500);
                });
              }}
              className="flex-1 h-10 rounded-lg text-white text-[13px]"
              style={{ background: "var(--accent)" }}
            >
              发给 ta
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setView("input"); setError(""); }}
            className="w-full text-center text-[12px] text-ink-faded py-1"
          >
            我有邀请码
          </button>
        </div>
      )}

      {view === "input" && (
        <div className="w-full space-y-3">
          <input
            type="text"
            inputMode="numeric"
            placeholder="输入 6 位邀请码"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            disabled={busy}
            className="w-full h-11 rounded-lg bg-bg-card border border-divider px-4 text-center text-[18px] text-ink tracking-[0.4em] placeholder:text-ink-faded/50 placeholder:tracking-normal placeholder:text-[14px] outline-none focus:border-accent/50 transition-colors"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setView("idle"); setError(""); }}
              className="h-10 px-5 rounded-lg border border-divider text-[13px] text-ink-faded"
            >
              返回
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={busy || inputCode.trim().length < 6}
              className="flex-1 h-10 rounded-lg text-white text-[13px] font-medium transition-opacity disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              {busy ? "绑定中…" : "确认绑定"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 11) {
    return digits.slice(0, 3) + "****" + digits.slice(-4);
  }
  return phone;
}
