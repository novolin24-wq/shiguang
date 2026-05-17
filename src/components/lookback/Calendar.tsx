"use client";

import { buildCalendarGrid, DOT_COLOR } from "@/lib/lookback-data";

const HEADERS = ["一", "二", "三", "四", "五", "六", "日"];

export function Calendar() {
  const cells = buildCalendarGrid();

  return (
    <div>
      {/* 星期表头 */}
      <div className="grid grid-cols-7 mb-1">
        {HEADERS.map((h) => (
          <div
            key={h}
            className="text-center text-[10px] text-ink-faded tracking-wider py-1"
          >
            {h}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((c) => (
          <button
            key={c.iso}
            className={[
              "relative flex flex-col items-center justify-center py-1.5 rounded-md transition-colors",
              c.inMonth ? "text-ink" : "text-ink-faded/40",
              c.isToday ? "bg-accent text-white rounded-full" : "",
              c.records && !c.isToday ? "hover:bg-accent-paper/50" : "",
            ].join(" ")}
          >
            <span
              className={[
                "text-[13px] tabular-nums leading-none",
                c.isToday ? "font-medium" : "",
              ].join(" ")}
            >
              {c.day}
            </span>

            {/* 有记录的日期显示色点 */}
            {c.records && !c.isToday && (
              <span className="flex gap-[2px] mt-1">
                {c.records.slice(0, 3).map((who, j) => (
                  <span
                    key={j}
                    className="w-[4px] h-[4px] rounded-full"
                    style={{ background: DOT_COLOR[who] || "var(--who-alone)" }}
                  />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-divider/50">
        <span className="flex items-center gap-1 text-[10px] text-ink-faded">
          <i
            className="w-[6px] h-[6px] rounded-full inline-block"
            style={{ background: "var(--who-alone)" }}
          />
          独自
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-faded">
          <i
            className="w-[6px] h-[6px] rounded-full inline-block"
            style={{ background: "var(--who-together)" }}
          />
          和她
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-faded">
          <i
            className="w-[6px] h-[6px] rounded-full inline-block"
            style={{ background: "var(--who-parents)" }}
          />
          爸妈
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-faded">
          <i className="w-[6px] h-[6px] rounded-full inline-block bg-accent" />
          今天
        </span>
      </div>
    </div>
  );
}
