export function Avatar({
  ch,
  size = 56,
  dim,
}: {
  ch: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-full bg-accent-paper grid place-items-center border border-accent/20",
        dim ? "opacity-40" : "",
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      <span
        className="font-serif text-accent leading-none"
        style={{ fontSize: size * 0.42 }}
      >
        {ch}
      </span>
    </div>
  );
}

export function AvatarPair({ a = "林", b = "雨" }: { a?: string; b?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar ch={a} />
      <span className="text-accent-soft text-[18px] leading-none">♡</span>
      <Avatar ch={b} />
    </div>
  );
}
