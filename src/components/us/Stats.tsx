const STATS = [
  { n: 468, l: "顿饭" },
  { n: 132, l: "一起吃" },
  { n: 23, l: "城市" },
];

export function Stats() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STATS.map((s) => (
        <div
          key={s.l}
          className="bg-bg-card rounded-lg py-3 text-center shadow-soft"
        >
          <div className="text-[24px] font-serif text-ink tabular-nums leading-none">
            {s.n}
          </div>
          <div className="text-[10px] text-ink-faded mt-1">{s.l}</div>
        </div>
      ))}
    </div>
  );
}
