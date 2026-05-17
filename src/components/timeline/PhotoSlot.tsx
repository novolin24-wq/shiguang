// 照片占位 · 斜纹纸 + mono caption · 等真实照片上线前的视觉占位
export function PhotoSlot({ caption }: { caption: string }) {
  return (
    <div
      className="relative my-3 h-32 rounded-[10px] overflow-hidden border border-divider/60 flex items-end px-3 pb-2"
      style={{
        background:
          "repeating-linear-gradient(135deg, var(--bg-card-hover) 0 9px, var(--paper) 9px 18px)",
      }}
    >
      <span className="text-[10px] tracking-[0.08em] font-mono text-ink-faded/80 lowercase">
        photo · {caption}
      </span>
    </div>
  );
}
