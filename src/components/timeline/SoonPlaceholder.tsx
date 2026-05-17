// 还没做完的 tab · 安静地说一句「即将开启」
export function SoonPlaceholder({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 py-20">
      <div className="text-[11px] tracking-[0.16em] uppercase text-ink-faded mb-3">
        {eyebrow}
      </div>
      <h2 className="font-serif text-3xl text-ink mb-3 leading-tight">
        {title}
      </h2>
      <p className="font-serif italic text-[14px] text-ink-soft leading-relaxed max-w-[260px]">
        {body}
      </p>
      <div className="mt-10 flex items-center gap-2 text-[11px] text-ink-faded/70 tracking-wider">
        <span className="w-6 h-px bg-divider" />
        soon
        <span className="w-6 h-px bg-divider" />
      </div>
    </div>
  );
}
