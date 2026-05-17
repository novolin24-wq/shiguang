import { AvatarPair } from "@/components/us/Avatar";
import { Stats } from "@/components/us/Stats";
import { FuncList } from "@/components/us/FuncList";

export const metadata = { title: "食光 · 我们" };

export default function UsPage() {
  return (
    <div className="space-y-6 pt-2">
      {/* 页眉 */}
      <div className="font-serif text-[22px] text-ink leading-none tracking-wide">
        我们
      </div>

      {/* Hero · 已绑定态 */}
      <header className="flex flex-col items-center gap-3 py-4">
        <AvatarPair />
        <div className="text-center">
          <h1 className="text-[18px] font-serif text-ink leading-snug">
            小林 <span className="text-accent-soft">&amp;</span> 小雨
          </h1>
          <div className="text-[11px] text-ink-faded mt-1 italic font-serif">
            一起记录 · 327 天
          </div>
        </div>
      </header>

      {/* 统计 */}
      <Stats />

      {/* 功能列表 */}
      <FuncList />

      {/* 底部 */}
      <div className="text-center text-[10px] text-ink-faded/60 pt-4 pb-2">
        食光 · 0.4.2 · 你记下的，只在你这里
      </div>
    </div>
  );
}
