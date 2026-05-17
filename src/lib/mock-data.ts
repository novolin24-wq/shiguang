// 食光 · mock 数据 · 从 design/data.jsx 迁移
// 今天 = 2026-05-16 周六
// 叙事背景：
//   · 上个月初有几天发烧，爸妈过来照顾了一周
//   · 工作日午餐通常各吃各的，晚上偶尔一起
//   · 上周六出差杭州
//   · 一年前的今天，在乌镇

export type Who =
  | "alone"
  | "together"
  | "her"
  | "parents"
  | "colleague"
  | "friend";

export type MealTag =
  | "早饭"
  | "家常"
  | "粉面"
  | "工作餐"
  | "日料"
  | "甜"
  | "外卖"
  | "出差";

export interface Meal {
  id: string;
  day: string; // YYYY-MM-DD
  time: string; // HH:mm
  who: Who;
  dish: string;
  place: string;
  tag?: MealTag;
  note?: string;
  photo?: string;
  /** CloudBase Storage 文件 ID，用于刷新时重新换临时 URL */
  photoFileId?: string;
  /** 真实照片 ObjectURL（来自记录 modal 上传的图） */
  photoUrl?: string;
}

// 「记一顿」中模拟 AI 识别的菜名 · 用户在 modal 里看到的默认值
export const MOCK_AI_DISH = "番茄牛腩饭";
// 「记一顿」三个 meta chip 里的"当前地点" · 写死
export const MOCK_CURRENT_PLACE = "家 · 美团";

// 根据时间推断餐次
export function inferMealType(time: string): "早餐" | "午餐" | "晚餐" | "宵夜" {
  const h = parseInt(time.slice(0, 2), 10);
  if (h >= 6 && h < 10) return "早餐";
  if (h >= 10 && h < 14) return "午餐";
  if (h >= 17 && h < 21) return "晚餐";
  return "宵夜";
}

export interface Memory {
  date: string;
  weekday: string;
  weather?: string;
  place: string;
  dish: string;
  quote: string;
  byline: string;
}

export const TODAY = "2026-05-16";

export const MEALS: Meal[] = [
  // ===== 今天 · 2026/05/16 周六 =====
  {
    id: "m1",
    day: "2026-05-16",
    time: "13:30",
    who: "alone",
    dish: "楼下的牛肉粉",
    place: "老地方 · 公司楼下",
    tag: "粉面",
    note: "她去看奶奶了。一个人下楼吃了碗粉，辣得出汗。",
  },
  {
    id: "m2",
    day: "2026-05-16",
    time: "09:14",
    who: "together",
    dish: "慢早饭",
    place: "家 · 厨房",
    tag: "早饭",
    note: "她煎了蛋，我煮的咖啡。窗户开着，楼下有人在遛狗。",
    photo: "荷包蛋 · 黑咖啡 · 桌上一支花",
  },

  // ===== 昨天 · 2026/05/15 周五 =====
  {
    id: "m3",
    day: "2026-05-15",
    time: "19:50",
    who: "together",
    dish: "番茄牛腩面",
    place: "家",
    tag: "家常",
    note: "她下班顺路买的牛腩。煮了挺久。",
    photo: "红汤 · 面条 · 一颗青菜",
  },
  {
    id: "m4",
    day: "2026-05-15",
    time: "12:50",
    who: "alone",
    dish: "鱼香肉丝盖饭",
    place: "公司食堂",
    tag: "工作餐",
    note: "照例的周五。下午两点的会取消了，多喝了一杯茶。",
  },

  // ===== 本周早些时候 =====
  {
    id: "m5",
    day: "2026-05-14",
    time: "19:30",
    who: "together",
    dish: "出差结束的那顿日料",
    place: "机场附近一家小馆",
    tag: "日料",
    note: "她来机场接我。鳗鱼饭。说好久没见我了。",
  },
  {
    id: "m6",
    day: "2026-05-13",
    time: "12:15",
    who: "colleague",
    dish: "老张生日的奶油蛋糕",
    place: "办公室",
    tag: "甜",
    note: "午饭就是它。下午饿得不行。",
  },
  {
    id: "m7",
    day: "2026-05-12",
    time: "21:00",
    who: "her",
    dish: "麻辣烫",
    place: "她加班 · 美团",
    tag: "外卖",
    note: "今天好累，叫了麻辣烫。土豆片煮老了。",
  },

  // ===== 上周末 =====
  {
    id: "m8",
    day: "2026-05-11",
    time: "11:00",
    who: "together",
    dish: "荠菜饺子",
    place: "新开的菜市场 · 家",
    tag: "家常",
    note: "逛了一圈，她非要买荠菜。中午包了一锅，她不会捏，全是我的形状。",
    photo: "一盘饺子 · 一碟醋 · 她的手",
  },
  {
    id: "m9",
    day: "2026-05-10",
    time: "19:30",
    who: "alone",
    dish: "片儿川",
    place: "杭州 · 虎跑路一家小店",
    tag: "出差",
    note: "出差。一个人吃。雪菜很咸，但汤喝完了。",
  },

  // ===== 上个月初 · 爸妈来的那几天 =====
  {
    id: "m10",
    day: "2026-05-03",
    time: "11:00",
    who: "parents",
    dish: "炖了一上午的鸡汤",
    place: "家 · 妈的灶",
    tag: "家常",
    note: "加了党参和枸杞。她舀了两碗。",
    photo: "砂锅 · 浮着的油花",
  },
  {
    id: "m11",
    day: "2026-05-02",
    time: "18:30",
    who: "parents",
    dish: "鸭血粉丝汤",
    place: "爸出门去买的",
    tag: "粉面",
    note: "那天我发烧 38.5。爸下楼走了二十分钟。",
  },
  {
    id: "m12",
    day: "2026-05-01",
    time: "12:00",
    who: "parents",
    dish: "白粥 · 腐乳 · 咸鸭蛋",
    place: "家",
    tag: "家常",
    note: '妈说"别硬撑"。我就没硬撑。',
  },
];

// 「一年前的今天」
export const MEMORY: Memory = {
  date: "2025 · 05 · 16",
  weekday: "周五",
  weather: "那天下了雨",
  place: "乌镇",
  dish: "小笼",
  quote: "汤太烫了",
  byline: "她笑了很久 · 回去的路上下了点雨",
};

export type GroupKey =
  | "今天"
  | "昨天"
  | "本周早些时候"
  | "上周末"
  | "上个月初 · 爸妈来的那几天";

export interface GroupedSection {
  key: GroupKey;
  sub?: string | null;
  fade: boolean;
  meals: Meal[];
}

// 把 meals 按"自然语言时间段"分组（不是机械的 today/yesterday/...）
export function groupMeals(meals: Meal[], today: string = TODAY): GroupedSection[] {
  const groups: Record<GroupKey, Meal[]> = {
    今天: [],
    昨天: [],
    本周早些时候: [],
    上周末: [],
    "上个月初 · 爸妈来的那几天": [],
  };
  const todayD = new Date(today + "T00:00:00").getTime();
  const dayDiff = (d: string) =>
    Math.round((todayD - new Date(d + "T00:00:00").getTime()) / 86400000);

  for (const m of meals) {
    const diff = dayDiff(m.day);
    if (diff === 0) groups["今天"].push(m);
    else if (diff === 1) groups["昨天"].push(m);
    else if (diff <= 4) groups["本周早些时候"].push(m);
    else if (diff <= 6) groups["上周末"].push(m);
    else groups["上个月初 · 爸妈来的那几天"].push(m);
  }

  const ordered: { key: GroupKey; sub: string | null; fade: boolean }[] = [
    { key: "今天", sub: null, fade: false },
    { key: "昨天", sub: null, fade: false },
    { key: "本周早些时候", sub: null, fade: false },
    { key: "上周末", sub: null, fade: true },
    {
      key: "上个月初 · 爸妈来的那几天",
      sub: "那几天有点晕",
      fade: true,
    },
  ];

  return ordered
    .map((s) => ({ ...s, meals: groups[s.key] }))
    .filter((s) => s.meals.length > 0);
}

// 「谁吃的」的标签 + 颜色 token 名（CSS 变量名，组件层引用）
export const WHO_META: Record<
  Who,
  { label: string; cssVar: string }
> = {
  alone: { label: "独自", cssVar: "var(--who-alone)" },
  together: { label: "和她", cssVar: "var(--who-together)" },
  her: { label: "她记的", cssVar: "var(--who-her)" },
  parents: { label: "爸妈", cssVar: "var(--who-parents)" },
  colleague: { label: "同事", cssVar: "var(--who-colleague)" },
  friend: { label: "朋友", cssVar: "var(--who-friend)" },
};

// 食物类型 tag · 小色块底色 + 文字
// 整体在暖米/陶土色系内浮动 · 不是 emoji，不是高饱和
export const TAG_META: Record<MealTag, { bg: string; fg: string }> = {
  早饭: { bg: "#F5E6C5", fg: "#6B5532" },
  家常: { bg: "#E4E8D5", fg: "#535B3F" },
  粉面: { bg: "#F0DDC5", fg: "#6B4F35" },
  工作餐: { bg: "#E0DBD0", fg: "#4F4A40" },
  日料: { bg: "#D8DDE0", fg: "#3F4B55" },
  甜: { bg: "#F0D8D5", fg: "#6B3F3F" },
  外卖: { bg: "#DDD0C5", fg: "#4F3F30" },
  出差: { bg: "#DAD3DD", fg: "#4A4252" },
};
