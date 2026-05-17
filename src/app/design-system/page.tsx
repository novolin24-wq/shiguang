import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "食光 · 设计系统",
};

const COLOR_TOKENS = [
  { name: "--bg", value: "#F5EFE4", desc: "页面底色 · 暖米" },
  { name: "--bg-card", value: "#FDFAF3", desc: "卡片底色" },
  { name: "--bg-card-hover", value: "#FAF5EA", desc: "卡片 hover" },
  { name: "--paper", value: "#FFFEFA", desc: "纸张白 · 最高层" },
  { name: "--stage", value: "#1F1A14", desc: "桌面外侧 · 深墨", dark: true },
  { name: "--stage-soft", value: "#2A231B", desc: "桌面外侧 · 弱化", dark: true },
  { name: "--ink", value: "#2E2419", desc: "正文墨色" },
  { name: "--ink-soft", value: "#5C4A38", desc: "次级文字" },
  { name: "--ink-faded", value: "#8B7355", desc: "弱化文字 · meta" },
  { name: "--accent", value: "#B8694A", desc: "陶土橙 · 强调" },
  { name: "--accent-soft", value: "#D4A06B", desc: "陶土橙 · 柔和" },
  { name: "--accent-paper", value: "#F0E4D2", desc: "陶土橙 · 纸感" },
  { name: "--divider", value: "#E8DDC9", desc: "分隔线" },
];

const WHO_TOKENS = [
  { name: "--who-alone", value: "#B6A78F", label: "独自" },
  { name: "--who-together", value: "#B95A2C", label: "和她" },
  { name: "--who-her", value: "#B95A2C", label: "她记的" },
  { name: "--who-parents", value: "#5E6B3E", label: "爸妈" },
  { name: "--who-colleague", value: "#5C6B7A", label: "同事" },
  { name: "--who-friend", value: "#7A3B3F", label: "朋友" },
];

function Swatch({
  name,
  value,
  desc,
  dark,
}: {
  name: string;
  value: string;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-divider/60">
      <div
        className="h-20 w-full rounded-xl mb-3 border border-divider/40"
        style={{ background: value }}
      />
      <div className="flex items-baseline justify-between gap-2">
        <code className="text-[12px] text-ink-soft font-mono">{name}</code>
        <code
          className={`text-[11px] font-mono ${dark ? "text-ink-faded" : "text-ink-faded"}`}
        >
          {value}
        </code>
      </div>
      {desc && <div className="text-[12px] text-ink-faded mt-1">{desc}</div>}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <header className="mb-14">
          <div className="text-[12px] tracking-[0.18em] uppercase text-ink-faded mb-3">
            Shiguang · Design System · v0.1
          </div>
          <h1 className="font-serif text-5xl text-ink mb-3 leading-tight">
            食<span className="text-accent">光</span> · 设计系统
          </h1>
          <p className="font-serif italic text-ink-soft text-lg max-w-xl leading-relaxed">
            一本食物的日记本 —— 暖米的纸、淡墨的字、陶土橙只在你想起来的地方。
          </p>
        </header>

        {/* Type specimens */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            字体
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Typography
            </span>
          </h2>

          <div className="space-y-8">
            <div className="bg-bg-card rounded-2xl p-7 border border-divider/60">
              <div className="text-[11px] text-ink-faded tracking-[0.1em] uppercase mb-2">
                font-serif · Noto Serif SC + Cormorant Garamond
              </div>
              <div className="font-serif text-4xl text-ink leading-tight mb-2">
                那家藕粉店旁的小巷
              </div>
              <div className="font-serif italic text-xl text-ink-soft mb-3">
                Shiguang — a quiet diary of meals.
              </div>
              <div className="font-serif text-base text-ink-soft leading-relaxed">
                你们在乌镇吃了一笼小笼。她说&ldquo;汤太烫了&rdquo;。回去的路上下了点雨。
              </div>
            </div>

            <div className="bg-bg-card rounded-2xl p-7 border border-divider/60">
              <div className="text-[11px] text-ink-faded tracking-[0.1em] uppercase mb-2">
                font-sans · Noto Sans SC
              </div>
              <div className="text-2xl text-ink mb-2">楼下的牛肉粉</div>
              <div className="text-base text-ink-soft leading-relaxed mb-2">
                老地方 · 公司楼下 · 13:30
              </div>
              <div className="text-[13px] text-ink-faded leading-relaxed">
                她去看奶奶了。一个人下楼吃了碗粉，辣得出汗。
              </div>
            </div>
          </div>
        </section>

        {/* Color tokens */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            色彩
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Color tokens
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COLOR_TOKENS.map((t) => (
              <Swatch key={t.name} {...t} />
            ))}
          </div>
        </section>

        {/* Who dot colors */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            谁吃的
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Who · dot palette
            </span>
          </h2>
          <div className="bg-bg-card rounded-2xl p-6 border border-divider/60">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              {WHO_TOKENS.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: t.value }}
                  />
                  <span className="text-[14px] text-ink min-w-[3em]">
                    {t.label}
                  </span>
                  <code className="text-[12px] text-ink-faded font-mono ml-auto">
                    {t.value}
                  </code>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <span className="inline-flex">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "#D6C8AC" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full -ml-1.5"
                    style={{ background: "#B95A2C" }}
                  />
                </span>
                <span className="text-[14px] text-ink min-w-[3em]">一起</span>
                <code className="text-[12px] text-ink-faded font-mono ml-auto">
                  双点
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            阴影
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Elevation
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-7 bg-bg-card shadow-soft">
              <code className="text-[12px] text-ink-faded font-mono">
                --shadow-soft
              </code>
              <div className="font-serif text-xl text-ink mt-2">淡墨阴影</div>
              <div className="text-[13px] text-ink-faded mt-1">
                日常卡片 · 几乎不打扰
              </div>
            </div>
            <div className="rounded-2xl p-7 bg-paper shadow-warm">
              <code className="text-[12px] text-ink-faded font-mono">
                --shadow-warm
              </code>
              <div className="font-serif text-xl text-ink mt-2">陶土阴影</div>
              <div className="text-[13px] text-ink-faded mt-1">
                记忆卡 · 像晒过太阳
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            间距
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Spacing
            </span>
          </h2>
          <div className="bg-bg-card rounded-2xl p-6 border border-divider/60 space-y-3">
            {[4, 8, 12, 16, 20, 24, 32, 48].map((px) => (
              <div key={px} className="flex items-center gap-4">
                <code className="text-[12px] text-ink-faded font-mono w-12">
                  {px}px
                </code>
                <div
                  className="h-3 bg-accent/70 rounded-sm"
                  style={{ width: px }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Radii */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            圆角
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Radii
            </span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { r: 6, label: "rounded-md · 标签" },
              { r: 12, label: "rounded-xl · 小卡" },
              { r: 16, label: "meal card" },
              { r: 20, label: "memory card" },
              { r: 24, label: "modal" },
            ].map((x) => (
              <div key={x.r} className="text-center">
                <div
                  className="w-24 h-24 bg-bg-card border border-divider/60 mb-2"
                  style={{ borderRadius: x.r }}
                />
                <div className="text-[11px] text-ink-faded">{x.label}</div>
                <code className="text-[11px] text-ink-faded font-mono">
                  {x.r}px
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Sample atoms */}
        <section className="mb-20">
          <h2 className="font-serif text-2xl mb-6 flex items-baseline gap-3">
            原子组件预览
            <span className="text-[12px] text-ink-faded tracking-[0.1em] uppercase">
              Atoms
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* memory card */}
            <div
              className="rounded-[20px] p-6 relative overflow-hidden shadow-warm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,250,240,0.6) 0%, rgba(245,230,210,0.6) 100%), var(--paper)",
                border: "1px solid rgba(184,105,74,0.15)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent) 0%, var(--accent-soft) 100%)",
                }}
              />
              <div className="font-serif italic text-accent text-[13px] tracking-wider mb-1">
                ⋆ 一年前的今天
              </div>
              <div className="text-[12px] text-ink-faded mb-3">
                2025 · 05 · 16 · 周五
              </div>
              <div className="font-serif text-[17px] text-ink-soft leading-relaxed italic">
                你们在<span className="text-accent not-italic">乌镇</span>
                吃了一笼小笼。<br />
                她说&ldquo;
                <span className="text-accent not-italic">汤太烫了</span>
                &rdquo;。
              </div>
            </div>

            {/* meal card */}
            <div className="rounded-[16px] p-4 bg-bg-card border border-transparent hover:bg-bg-card-hover transition">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--who-alone)" }}
                  />
                  <span className="text-[11px] text-ink-faded tracking-wider">
                    独自
                  </span>
                </span>
                <span className="text-[12px] text-ink-faded">13:30</span>
              </div>
              <h3 className="text-[15px] text-ink font-medium mb-0.5">
                楼下的牛肉粉
              </h3>
              <div className="text-[12px] text-ink-faded mb-2">
                老地方 · 公司楼下
              </div>
              <p className="font-serif italic text-[13px] text-ink-soft leading-relaxed">
                她去看奶奶了。一个人下楼吃了碗粉，辣得出汗。
              </p>
            </div>
          </div>
        </section>

        <footer className="text-[12px] text-ink-faded text-center pb-8">
          食光 · v0.1 · 设计系统验收页 · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
