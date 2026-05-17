"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTimeline } from "./TimelineProvider";

type TabDef = { href: string; label: string };

const LEFT_TABS: TabDef[] = [
  { href: "/", label: "时间线" },
  { href: "/lookback", label: "回望" },
];

const RIGHT_TABS: TabDef[] = [
  { href: "/collections", label: "集" },
  { href: "/us", label: "我们" },
];

function TabItem({ href, label, active }: TabDef & { active: boolean }) {
  return (
    <Link
      href={href}
      prefetch
      className={[
        "flex flex-col items-center gap-1 py-2 px-3 transition-colors",
        active ? "text-accent" : "text-ink-faded hover:text-ink-soft",
      ].join(" ")}
    >
      <span
        className={[
          "w-1 h-1 rounded-full transition-opacity",
          active ? "bg-accent opacity-100" : "bg-ink-faded opacity-40",
        ].join(" ")}
      />
      <span className="text-[10.5px] tracking-[0.12em]">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { openRecord } = useTimeline();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="底部导航"
      className="absolute bottom-0 left-0 right-0 z-30"
    >
      <div className="relative border-t border-divider/70 bg-bg-card/85 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),12px)] pt-2 px-3">
        <div className="flex items-end justify-between">
          <div className="flex flex-1 justify-around">
            {LEFT_TABS.map((t) => (
              <TabItem key={t.href} {...t} active={isActive(t.href)} />
            ))}
          </div>

          {/* FAB 留位 · 实际按钮 abs-pos 在上面 */}
          <div className="w-[58px] shrink-0" aria-hidden />

          <div className="flex flex-1 justify-around">
            {RIGHT_TABS.map((t) => (
              <TabItem key={t.href} {...t} active={isActive(t.href)} />
            ))}
          </div>
        </div>

        {/* 中央 FAB · 陶土橙 · 浮在 tab bar 之上（负 margin） */}
        <button
          type="button"
          aria-label="记下一顿"
          onClick={openRecord}
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-[52px] h-[52px] rounded-full text-white grid place-items-center transition-transform hover:-translate-y-[2px] active:scale-95"
          style={{
            background: "var(--accent)",
            boxShadow: "0 6px 18px rgba(184,105,74,0.38)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path d="M10 3.5v13M3.5 10h13" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
