"use client";

import { useState } from "react";
import { type Meal, TAG_META, WHO_META } from "@/lib/mock-data";
import { WhoDots } from "./WhoDots";
import { PhotoSlot } from "./PhotoSlot";

interface MealCardProps {
  meal: Meal;
  expanded: boolean;
  highlighted?: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onDelete: (meal: Meal) => void;
}

// 三种主要视觉变体：
//   · 独自 / 爸妈 / 同事 / 朋友 = 单点 + 标准底色
//   · 一起 = 双人点 + 微暖渐变底色
//   · 她记的 = 左侧细竖线 + 「她记的」邮戳 + note 以引文样式呈现
export function MealCard({
  meal,
  expanded,
  highlighted,
  onToggle,
  onDelete,
}: MealCardProps) {
  const isHer = meal.who === "her";
  const isTogether = meal.who === "together";
  const meta = WHO_META[meal.who];
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const showPhoto = Boolean(meal.photoUrl && failedPhotoUrl !== meal.photoUrl);

  return (
    <div
      onClick={onToggle}
      className={[
        "relative rounded-[16px] p-4 pl-[18px] cursor-pointer transition-all",
        "border border-transparent",
        isTogether
          ? "bg-[linear-gradient(135deg,#FBF4E5_0%,#F5E8D0_100%)] hover:brightness-[0.99]"
          : "bg-bg-card hover:bg-bg-card-hover",
        isHer && "pl-5",
        "hover:-translate-y-[1px]",
        highlighted && "animate-[justSaved_1.1s_ease-out]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 「她记的」: 左侧 1px 陶土细线（短信感） */}
      {isHer && (
        <span
          className="absolute left-0 top-3 bottom-3 w-px"
          style={{ background: "var(--accent-soft)" }}
        />
      )}

      {/* 头部：who 头像点 + label · 时间 */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="inline-flex items-center gap-1.5">
          <WhoDots who={meal.who} />
          <span className="text-[10.5px] tracking-[0.12em] text-ink-faded">
            {meta.label}
          </span>
        </span>
        <span
          className={[
            "text-[11.5px] font-mono tabular-nums",
            isTogether ? "text-accent" : "text-ink-faded",
          ].join(" ")}
        >
          {meal.time}
        </span>
      </div>

      {/* 主菜名 */}
      <h3 className="text-[15px] text-ink leading-snug font-medium">
        {meal.dish}
      </h3>

      {/* 地点 + 食物类型 tag */}
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-[11.5px] text-ink-faded truncate">
          {meal.place}
        </span>
        {meal.tag && (
          <span
            className="shrink-0 text-[10px] tracking-[0.05em] px-1.5 py-px rounded-md font-medium"
            style={{
              background: TAG_META[meal.tag].bg,
              color: TAG_META[meal.tag].fg,
            }}
          >
            {meal.tag}
          </span>
        )}
      </div>

      {/* 照片：有真实 url 就显示图，否则走斜纹纸占位 */}
      {showPhoto ? (
        <div className="relative my-3 h-40 rounded-[10px] overflow-hidden border border-divider/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meal.photoUrl}
            alt={meal.dish}
            onError={() => setFailedPhotoUrl(meal.photoUrl ?? null)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : meal.photoUrl ? (
        <PhotoSlot caption="照片暂时打不开" />
      ) : meal.photo ? (
        <PhotoSlot caption={meal.photo} />
      ) : null}

      {/* 备注 · 「她记的」走引文样式 */}
      {meal.note &&
        (isHer ? (
          <p className="font-serif italic text-[13.5px] text-ink-soft leading-[1.65] mt-2 relative pl-1">
            <span
              aria-hidden
              className="font-serif text-accent-soft absolute -left-0.5 -top-1 text-lg leading-none opacity-60"
            >
              &ldquo;
            </span>
            {meal.note}
            <span
              aria-hidden
              className="font-serif text-accent-soft text-lg leading-none opacity-60 ml-0.5"
            >
              &rdquo;
            </span>
          </p>
        ) : (
          <p className="font-serif italic text-[13px] text-ink-soft leading-[1.6] mt-1.5">
            {meal.note}
          </p>
        ))}

      {/* 「她记的」邮戳 · 右上 */}
      {isHer && (
        <span
          className="absolute top-3 right-3 text-[10px] tracking-[0.18em] font-serif italic"
          style={{ color: "var(--accent)" }}
        >
          她记的
        </span>
      )}

      {/* 展开操作 */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-divider/60 flex items-center gap-3 text-[12px] text-ink-soft">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-ink transition"
          >
            编辑
          </button>
          <span className="w-px h-3 bg-divider" />
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-ink transition"
          >
            复制
          </button>
          <span className="w-px h-3 bg-divider" />
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-ink transition"
          >
            加标签
          </button>
          <span className="w-px h-3 bg-divider" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(meal);
            }}
            className="hover:text-accent transition ml-auto"
            style={{ color: "var(--accent)" }}
          >
            删除
          </button>
        </div>
      )}
    </div>
  );
}
