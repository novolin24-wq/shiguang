import { Calendar } from "@/components/lookback/Calendar";
import { PastTodayCard } from "@/components/lookback/PastTodayCard";
import { ThemeRow } from "@/components/lookback/ThemeRow";
import { PAST_TODAY, THEMES } from "@/lib/lookback-data";

export const metadata = { title: "食光 · 回望" };

export default function LookbackPage() {
  return (
    <div className="space-y-8 pt-2">
      {/* 页头 */}
      <header>
        <div className="font-serif text-[22px] text-ink leading-none tracking-wide">
          回望
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-[12px] text-ink-soft tracking-wider">
            二〇二六
          </span>
          <span className="text-[10px] text-ink-faded">·</span>
          <span className="text-[13px] text-ink-soft font-medium">五月</span>
        </div>
        <div className="text-[11px] text-ink-faded mt-1 italic font-serif">
          五月 1 — 16 · 你记下了 18 顿
        </div>
      </header>

      {/* 月历 */}
      <section>
        <Calendar />
      </section>

      {/* 过往的今天 */}
      <section>
        <div className="mb-3">
          <div className="text-[14px] text-ink font-medium">5 · 16 的过去</div>
          <div className="text-[11px] text-ink-faded mt-0.5">
            三年的同一天，你都吃了什么
          </div>
        </div>
        <div className="space-y-3">
          {PAST_TODAY.map((entry) => (
            <PastTodayCard key={entry.year} entry={entry} />
          ))}
        </div>
      </section>

      {/* 主题集 */}
      <section>
        <div className="mb-3">
          <div className="text-[14px] text-ink font-medium">你的集</div>
          <div className="text-[11px] text-ink-faded mt-0.5">
            那些自然成了一辑的食光
          </div>
        </div>
        <div className="space-y-2">
          {THEMES.map((theme) => (
            <ThemeRow key={theme.id} theme={theme} />
          ))}
        </div>
        <div className="text-center text-[11px] text-ink-faded mt-3 italic font-serif">
          在「集」看完整的归档 →
        </div>
      </section>
    </div>
  );
}
