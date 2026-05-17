interface DaySeparatorProps {
  label: string;
  sub?: string | null;
  fade?: boolean;
}

// 分组分隔 · 越靠下越淡（看到的不是"更旧"，而是"更远"）
export function DaySeparator({ label, sub, fade }: DaySeparatorProps) {
  return (
    <div
      className={[
        "flex items-baseline gap-3 mt-7 mb-3 transition-opacity",
        fade ? "opacity-60" : "opacity-100",
      ].join(" ")}
    >
      <span className="font-serif text-[18px] text-ink leading-none">
        {label}
      </span>
      {sub && (
        <span className="font-serif italic text-[12px] text-ink-faded">
          · {sub}
        </span>
      )}
      <span className="flex-1 h-px bg-divider/70 self-center ml-1" />
    </div>
  );
}
