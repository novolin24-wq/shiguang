// 「已记入今天」· 不说"保存成功"。纯 presentational，message 由 ToastMount 传入
export function Toast({ message }: { message: string | null }) {
  const visible = !!message;
  return (
    <div
      aria-live="polite"
      className={[
        "absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none",
        "bottom-[100px]",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <div
        className="px-4 py-2 rounded-full text-[12.5px] text-bg-card font-serif tracking-wider inline-flex items-center gap-2 shadow-warm"
        style={{ background: "rgba(46,36,25,0.92)" }}
      >
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--accent-soft)" }}
        />
        {message ?? ""}
      </div>
    </div>
  );
}
