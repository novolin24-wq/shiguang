import type { PastTodayEntry } from "@/lib/lookback-data";

export function PastTodayCard({ entry }: { entry: PastTodayEntry }) {
  return (
    <div className="bg-bg-card rounded-lg p-4 shadow-soft">
      <div className="flex items-start gap-3">
        {/* 年份标识 */}
        <div className="shrink-0 text-center">
          <div className="text-[22px] font-serif text-accent leading-none">
            {entry.year}
          </div>
          <div className="text-[10px] text-ink-faded mt-0.5">
            {entry.label}
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-ink-faded tracking-wider">
            5 · 16 · {entry.weekday} · 天气：{entry.weather}
          </div>
          <div className="text-[15px] text-ink font-medium mt-0.5 leading-snug">
            {entry.title}
          </div>
          <div className="text-[11px] text-ink-soft mt-0.5">{entry.sub}</div>
          <div className="text-[12px] text-ink-faded mt-2 leading-relaxed italic font-serif">
            {entry.note}
          </div>
        </div>

        {/* 箭头 */}
        <div className="shrink-0 text-ink-faded/60 mt-1">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M3 7h8M7 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function EmptyPastToday() {
  return (
    <div className="bg-bg-card rounded-lg p-5 shadow-soft text-center">
      <div className="font-serif italic text-[14px] text-ink-soft">
        等时间慢慢长出来 ——
      </div>
      <div className="text-[12px] text-ink-faded mt-2">
        你最早的记录是在 5 天前。
      </div>
    </div>
  );
}
