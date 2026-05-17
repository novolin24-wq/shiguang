// 顶部 · 品牌 + 日期 + 「今天 · 还在写」副线
export function PageHeader({
  brand = "食光",
  date = "2026 · 05 · 16",
  weekday = "周六",
  sub = "今天 · 还在写",
}: {
  brand?: string;
  date?: string;
  weekday?: string;
  sub?: string;
}) {
  return (
    <header className="pt-5 pb-2">
      <div className="flex items-end justify-between">
        <div className="font-serif text-[28px] leading-none text-ink tracking-wide">
          {brand.slice(0, 1)}
          <span className="text-accent">{brand.slice(1)}</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-[12px] text-ink-soft tabular-nums tracking-wider">
            {date}
          </div>
          <div className="text-[11px] text-ink-faded mt-0.5">{weekday}</div>
        </div>
      </div>
      <div className="font-serif italic text-[13px] text-ink-faded mt-2">
        {sub}
      </div>
    </header>
  );
}
