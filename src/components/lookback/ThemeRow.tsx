import type { ThemeEntry } from "@/lib/lookback-data";

export function ThemeRow({ theme }: { theme: ThemeEntry }) {
  return (
    <div className="flex items-center gap-3 bg-bg-card rounded-lg px-4 py-3 shadow-soft">
      {/* 一字印章 */}
      <div className="shrink-0 w-9 h-9 rounded-md bg-accent-paper grid place-items-center">
        <span className="text-[16px] font-serif text-accent leading-none">
          {theme.mark}
        </span>
      </div>

      {/* 标题 + meta */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-ink font-medium leading-snug truncate">
          {theme.title}
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] text-ink-faded mt-0.5">
          <span>{theme.count} 顿</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-faded/40" />
          <span>{theme.range}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-faded/40" />
          <span>{theme.cast}</span>
        </div>
      </div>

      {/* 箭头 */}
      <div className="shrink-0 text-ink-faded/50">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M3 6h6M6 3l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
