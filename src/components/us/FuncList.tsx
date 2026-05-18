interface FnRowProps {
  label: string;
  value: string;
  locked?: boolean;
  dot?: boolean;
}

function ChevR() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      className="text-ink-faded/50 ml-1"
    >
      <path
        d="M3 1.5L6 4.5L3 7.5"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FnRow({ label, value, locked, dot }: FnRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between py-3 border-b border-divider/40",
        locked ? "opacity-50" : "",
      ].join(" ")}
    >
      <span className="text-[13px] text-ink">{label}</span>
      <span className="flex items-center text-[12px] text-ink-faded">
        {dot && (
          <span
            className="w-[6px] h-[6px] rounded-full mr-1.5 inline-block"
            style={{ background: "var(--who-together)" }}
          />
        )}
        {value}
        {!locked && <ChevR />}
      </span>
    </div>
  );
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 11) {
    return digits.slice(0, 3) + "****" + digits.slice(-4);
  }
  return phone || "已绑定";
}

export function FuncList({ partnerPhone }: { partnerPhone?: string }) {
  const rows: FnRowProps[] = [
    { label: "关系绑定", value: partnerPhone ? maskPhone(partnerPhone) : "未绑定", dot: !!partnerPhone },
    { label: "提醒设置", value: "一年前的今天 · 开" },
    { label: "年度食物报告", value: "等 11 月再来打开", locked: true },
    { label: "导出我们的记录", value: "PDF · 相册" },
    { label: "关于食光", value: "" },
  ];

  return (
    <div className="bg-bg-card rounded-lg px-4 shadow-soft">
      {rows.map((r) => (
        <FnRow key={r.label} {...r} />
      ))}
    </div>
  );
}
