import { type Who, WHO_META } from "@/lib/mock-data";

interface WhoDotsProps {
  who: Who;
}

// 「一起」是双人头像点；其他全部单点 · 颜色由 token 决定
export function WhoDots({ who }: WhoDotsProps) {
  if (who === "together") {
    return (
      <span className="inline-flex items-center">
        <span
          className="inline-block w-[7px] h-[7px] rounded-full"
          style={{ background: "#D6C8AC" }}
        />
        <span
          className="inline-block w-[7px] h-[7px] rounded-full -ml-1.5"
          style={{ background: "var(--who-together)" }}
        />
      </span>
    );
  }
  return (
    <span
      className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
      style={{ background: WHO_META[who].cssVar }}
    />
  );
}
