"use client";

import { type Memory } from "@/lib/mock-data";

interface MemoryCardProps {
  memory: Memory;
  onReroll?: () => void;
}

// 「一年前的今天」hero 卡片
// 陶土橙只允许出现两处：顶部一条细渐变线 + 引文里 .em 强调
export function MemoryCard({ memory, onReroll }: MemoryCardProps) {
  return (
    <article
      className="relative rounded-[20px] p-6 pt-7 overflow-hidden shadow-warm"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,250,240,0.6) 0%, rgba(245,230,210,0.6) 100%), var(--paper)",
        border: "1px solid rgba(184,105,74,0.15)",
      }}
    >
      {/* 顶部陶土细线 · 1 */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, var(--accent) 0%, var(--accent-soft) 100%)",
        }}
      />

      {/* 邮戳行 */}
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-serif italic text-[13px] tracking-[0.05em] text-accent inline-flex items-center gap-1.5">
          <span className="text-base leading-none">⋆</span>
          一年前的今天
        </span>
        <span className="text-[11px] text-ink-faded tracking-[0.05em] font-mono">
          {memory.date} · {memory.weekday}
        </span>
      </div>

      {/* 引文 · 强调用 accent（陶土橙 · 2） */}
      <p className="font-serif italic text-[17px] leading-[1.7] text-ink-soft">
        你们在
        <span className="not-italic text-accent font-medium mx-0.5">
          {memory.place}
        </span>
        吃了一笼{memory.dish}。
        <br />
        她说&ldquo;
        <span className="not-italic text-accent font-medium mx-0.5">
          {memory.quote}
        </span>
        &rdquo;。
      </p>

      {/* 副线 */}
      <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-faded">
        <span
          className="inline-block w-1 h-1 rounded-full"
          style={{ background: "var(--ink-faded)" }}
        />
        {memory.byline}
      </div>

      {/* 再翻一张 */}
      <button
        type="button"
        onClick={onReroll}
        className="mt-5 text-[12px] tracking-wider text-ink-soft hover:text-accent transition"
      >
        再翻一张 →
      </button>
    </article>
  );
}
