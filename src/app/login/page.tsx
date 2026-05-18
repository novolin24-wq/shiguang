"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Stage = "phone" | "code";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → go to app
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendCode = useCallback(async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 11) {
      setError("请输入 11 位手机号");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { sendSmsCode } = await import("@/lib/auth");
      await sendSmsCode(phone);
      setCountdown(60);
      setStage("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "发送失败");
    } finally {
      setBusy(false);
    }
  }, [phone]);

  const confirmLogin = useCallback(async () => {
    if (code.trim().length < 4) {
      setError("请输入验证码");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { signInWithSms } = await import("@/lib/auth");
      await signInWithSms(phone, code);
      await refresh();
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "登录失败");
    } finally {
      setBusy(false);
    }
  }, [phone, code, refresh, router]);

  if (loading) {
    return (
      <Shell>
        <div className="text-ink-faded text-sm">加载中…</div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Logo */}
      <h1 className="text-[42px] font-serif text-ink leading-none tracking-wider">
        食光
      </h1>
      <p className="text-[12px] text-ink-faded mt-2 mb-10 font-serif italic">
        一本食物的日记本
      </p>

      {/* Phone input */}
      <div className="w-full space-y-3">
        <input
          type="tel"
          inputMode="numeric"
          placeholder="手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={busy}
          className="w-full h-11 rounded-lg bg-bg-card border border-divider px-4 text-[15px] text-ink placeholder:text-ink-faded/50 outline-none focus:border-accent/50 transition-colors"
        />

        {stage === "code" && (
          <input
            type="text"
            inputMode="numeric"
            placeholder="验证码"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={busy}
            autoFocus
            className="w-full h-11 rounded-lg bg-bg-card border border-divider px-4 text-[15px] text-ink placeholder:text-ink-faded/50 outline-none focus:border-accent/50 transition-colors tracking-[0.3em]"
          />
        )}

        {error && (
          <p className="text-[12px] text-[#C05040]">{error}</p>
        )}

        {stage === "phone" ? (
          <button
            type="button"
            onClick={sendCode}
            disabled={busy || phone.replace(/\D/g, "").length < 11}
            className="w-full h-11 rounded-lg text-white text-[14px] font-medium transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {busy ? "发送中…" : "发送验证码"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={sendCode}
              disabled={busy || countdown > 0}
              className="h-11 px-4 rounded-lg border border-divider text-[13px] text-ink-faded transition-opacity disabled:opacity-40 shrink-0"
            >
              {countdown > 0 ? `${countdown}s` : "重发"}
            </button>
            <button
              type="button"
              onClick={confirmLogin}
              disabled={busy || code.trim().length < 4}
              className="flex-1 h-11 rounded-lg text-white text-[14px] font-medium transition-opacity disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              {busy ? "登录中…" : "确认登录"}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

/** Shared phone-frame shell (no bottom nav) */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-stage flex items-center justify-center md:py-8">
      <div
        className="relative w-full max-w-[400px] bg-bg flex flex-col items-center justify-center overflow-hidden px-10
                   h-screen md:h-[min(820px,95vh)] md:rounded-[32px] md:shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(184,105,74,0.04) 0%, transparent 55%), radial-gradient(circle at 82% 78%, rgba(139,115,85,0.05) 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
