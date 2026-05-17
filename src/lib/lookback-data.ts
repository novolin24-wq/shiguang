// 食光 · 回望页数据 · 从 design/lookback.jsx 迁移
import type { Who } from "./mock-data";

export const TODAY = "2026-05-16";

// 月历 · 该日有记录的人物色相
export const DOT_COLOR: Record<string, string> = {
  alone: "var(--who-alone)",
  together: "var(--who-together)",
  her: "var(--who-together)",
  parents: "var(--who-parents)",
  colleague: "var(--who-colleague)",
  friend: "var(--who-friend)",
};

// 4 月 27 ~ 5 月 31 这五周里有过的记录
export const CAL: Record<string, Who[]> = {
  "2026-04-27": ["alone"],
  "2026-04-28": ["together"],
  "2026-04-29": ["alone", "her"],
  "2026-04-30": ["together"],
  "2026-05-01": ["parents", "parents"],
  "2026-05-02": ["parents", "parents"],
  "2026-05-03": ["parents", "parents"],
  "2026-05-04": ["alone"],
  "2026-05-05": ["alone", "her"],
  "2026-05-07": ["together"],
  "2026-05-08": ["her"],
  "2026-05-10": ["alone"],
  "2026-05-11": ["together", "together"],
  "2026-05-12": ["her"],
  "2026-05-13": ["colleague"],
  "2026-05-14": ["together"],
  "2026-05-15": ["alone", "together"],
  "2026-05-16": ["together", "alone"],
};

export interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  records: Who[] | null;
}

export function buildCalendarGrid(): CalendarCell[] {
  const start = new Date(2026, 3, 27); // 4月27日 周一
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${day}`;
    cells.push({
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() === 4, // 5月
      isToday: iso === TODAY,
      records: CAL[iso] || null,
    });
  }
  return cells;
}

// 「过往的今天」
export interface PastTodayEntry {
  year: number;
  label: string;
  weekday: string;
  title: string;
  sub: string;
  note: string;
  weather: string;
}

export const PAST_TODAY: PastTodayEntry[] = [
  {
    year: 2025,
    label: "去年",
    weekday: "周五",
    title: "乌镇之旅",
    sub: "3 顿 · 和她",
    note: "汤包烫到嘴。她笑了很久。回去的路上下了点雨。",
    weather: "雨",
  },
  {
    year: 2024,
    label: "两年前",
    weekday: "周四",
    title: "入职第一天",
    sub: "1 顿 · 一个人",
    note: "没人一起吃午饭。便利店饭团，蹲在公司楼下吃完的。",
    weather: "晴",
  },
  {
    year: 2023,
    label: "三年前",
    weekday: "周二",
    title: "大学最后一周",
    sub: "5 顿 · 朋友们",
    note: "通宵后的麦当劳。然后是中午的烧烤、傍晚的螺蛳粉、半夜的小酒馆。",
    weather: "阴",
  },
];

// 主题集
export interface ThemeEntry {
  id: string;
  mark: string;
  title: string;
  range: string;
  count: number;
  cast: string;
  summary: string;
}

export const THEMES: ThemeEntry[] = [
  {
    id: "parents",
    mark: "家",
    title: "爸妈来的那一周",
    range: "04.02 — 04.09",
    count: 21,
    cast: "三个人",
    summary:
      "和爸妈的那一周。21 顿饭。\n你爸爱吃辣，你妈爱喝汤。\n你们三个人，把家附近的小馆子吃了个遍。",
  },
  {
    id: "home",
    mark: "火",
    title: "在家做饭的尝试",
    range: "今年至今",
    count: 12,
    cast: "一起做",
    summary: "12 次。\n有 4 次煮糊了。其中 1 次她说\u201c这反而好吃\u201d。",
  },
  {
    id: "trip",
    mark: "行",
    title: "出差路上",
    range: "近半年",
    count: 8,
    cast: "一个人 · 3 个城市",
    summary:
      "杭州的片儿川。深圳的肠粉。北京的炸酱面。\n你不爱出差，但每次都会找一家小店。",
  },
  {
    id: "soup",
    mark: "汤",
    title: "感冒的时候喝的汤",
    range: "今春",
    count: 5,
    cast: "她做 / 妈炖",
    summary:
      "5 碗汤。\n2 碗鸡汤、1 碗萝卜汤、2 碗番茄汤。\n你每次喝完都说\u201c好多了\u201d。",
  },
];
