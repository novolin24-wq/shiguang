"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MOCK_CURRENT_PLACE,
  inferMealType,
  type Who,
  WHO_META,
} from "@/lib/mock-data";
import { prepareMealPhotoForUpload } from "@/lib/image-upload";
import { useTimeline } from "./TimelineProvider";

type Stage = 1 | 2 | 3;

const WHO_OPTIONS: { who: Who; label: string }[] = [
  { who: "alone", label: "自己" },
  { who: "together", label: "对象" },
  { who: "parents", label: "父母" },
  { who: "friend", label: "朋友" },
  { who: "colleague", label: "同事" },
];

function nowHHmm() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

// ───────────────────────────── 共用 · sheet 顶部
function SheetHeader({
  onClose,
  stage,
}: {
  onClose: () => void;
  stage: Stage;
}) {
  return (
    <div className="relative px-5 pt-3 pb-2">
      <div className="w-10 h-1 rounded-full bg-divider mx-auto mb-3" />
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={[
              "h-1 rounded-full transition-all",
              stage >= (n as Stage)
                ? "w-5 bg-accent"
                : "w-2 bg-divider",
            ].join(" ")}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭"
        className="absolute top-2.5 right-3 w-8 h-8 grid place-items-center rounded-full text-ink-faded hover:text-ink hover:bg-divider/40 transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3l8 8M11 3l-8 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ───────────────────────────── Stage 1 · 选图
function StageCapture({
  onPicked,
}: {
  onPicked: (file: File) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPicked(f);
    e.target.value = "";
  };

  return (
    <div className="px-6 pb-10 pt-2">
      {/* 占位取景框 · 四角 + 提示 */}
      <div
        className="relative aspect-[4/3] rounded-[14px] mb-7 overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(135deg, var(--bg-card-hover) 0 9px, var(--paper) 9px 18px)",
        }}
      >
        {/* 四角线 */}
        {[
          "top-3 left-3 border-t border-l",
          "top-3 right-3 border-t border-r",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute w-5 h-5 ${pos}`}
            style={{ borderColor: "var(--ink-faded)" }}
          />
        ))}
        <div className="absolute inset-0 grid place-items-center">
          <div className="font-serif italic text-[14px] text-ink-faded">
            把它框进去
          </div>
        </div>
      </div>

      {/* 拍 · 衬线大字 · 仪式感 */}
      <button
        type="button"
        onClick={() => cameraRef.current?.click()}
        className="mx-auto block w-[88px] h-[88px] rounded-full bg-accent text-bg-card font-serif text-[26px] tracking-widest transition-transform active:scale-95 hover:-translate-y-[2px]"
        style={{ boxShadow: "0 8px 24px rgba(184,105,74,0.4)" }}
      >
        拍
      </button>

      <div className="flex flex-col items-center mt-5 gap-3">
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="text-[13px] text-ink-soft hover:text-accent transition tracking-wider"
        >
          或从相册选
        </button>
      </div>

      {/* 隐藏的两个 file input · 一个走相机一个走相册 */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handle}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handle}
      />
    </div>
  );
}

// ───────────────────────────── Stage 2 · AI 识别中
function StageScanning({ photoUrl }: { photoUrl: string }) {
  return (
    <div className="px-6 pb-10">
      <div
        className="relative h-[40%] aspect-[4/3] rounded-[14px] overflow-hidden mb-7"
        style={{ background: "var(--bg-card-hover)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 一道光 · 上下扫过 */}
        <div className="absolute inset-x-0 h-[34%] pointer-events-none animate-[sweep_1.4s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,250,240,0.65), transparent)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div className="text-center">
        <div className="font-serif italic text-[16px] text-ink-soft mb-2">
          正在认这道菜
        </div>
        <div className="inline-flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent-soft animate-[bounce_1.1s_infinite]"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Stage 3 · 确认 + 补充
interface ConfirmForm {
  dish: string;
  time: string;
  place: string;
  meal: ReturnType<typeof inferMealType>;
  who: Who;
  note: string;
  noteOpen: boolean;
}

type RecognitionStatus = "success" | "miss";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, ""));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function recognizeDish(file: File): Promise<string | null> {
  let timeout: number | undefined;
  try {
    const uploadReadyFile = await prepareMealPhotoForUpload(file);
    const image = await fileToBase64(uploadReadyFile);
    const controller = new AbortController();
    timeout = window.setTimeout(() => controller.abort(), 5000);

    const res = await fetch("/api/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { name: string | null };
    return data.name;
  } catch {
    return null;
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}

function StageConfirm({
  photoUrl,
  form,
  setForm,
  onDone,
  recognitionStatus,
}: {
  photoUrl: string;
  form: ConfirmForm;
  setForm: React.Dispatch<React.SetStateAction<ConfirmForm>>;
  onDone: () => void;
  recognitionStatus: RecognitionStatus;
}) {
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (form.noteOpen) noteRef.current?.focus();
  }, [form.noteOpen]);

  const metaChips = useMemo(
    () => [
      { k: "时", v: form.time },
      { k: "处", v: form.place },
      { k: "餐", v: form.meal },
    ],
    [form.time, form.place, form.meal],
  );

  return (
    <div className="px-5 pb-8 overflow-y-auto no-scrollbar">
      {/* 照片缩到顶部 */}
      <div
        className="relative h-[140px] rounded-[14px] overflow-hidden mb-5"
        style={{ background: "var(--bg-card-hover)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* 菜名 + AI 已识别 */}
      <div className="relative">
        <input
          type="text"
          value={form.dish}
          placeholder={
            recognitionStatus === "miss"
              ? "我看不太清，你来告诉我？"
              : undefined
          }
          onChange={(e) =>
            setForm((f) => ({ ...f, dish: e.target.value }))
          }
          className="w-full font-serif text-[22px] text-ink bg-transparent border-b border-divider pb-1.5 pr-20 focus:outline-none focus:border-accent-soft transition-colors"
        />
        {recognitionStatus === "success" && (
          <span
            className="absolute right-0 bottom-2 text-[10px] tracking-[0.1em] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              background: "var(--accent-paper)",
              color: "var(--accent)",
            }}
          >
            AI 已识别
          </span>
        )}
      </div>

      {/* 三 meta chip */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {metaChips.map((c) => (
          <span
            key={c.k}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-card border border-divider/70 text-[12px] text-ink-soft"
          >
            <span className="font-serif text-ink-faded text-[10.5px]">
              {c.k}
            </span>
            {c.v}
          </span>
        ))}
      </div>

      {/* 和谁一起 */}
      <div className="mt-5">
        <div className="font-serif italic text-[12px] text-ink-faded mb-2 tracking-wider">
          和谁一起
        </div>
        <div className="flex flex-wrap gap-2">
          {WHO_OPTIONS.map(({ who, label }) => {
            const selected = form.who === who;
            return (
              <button
                key={who}
                type="button"
                onClick={() => setForm((f) => ({ ...f, who }))}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition",
                  selected
                    ? "bg-accent-paper border-accent text-accent"
                    : "bg-bg-card border-divider text-ink-soft hover:border-ink-faded",
                ].join(" ")}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: WHO_META[who].cssVar }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* + 加一句话 → textarea */}
      <div className="mt-5">
        {!form.noteOpen ? (
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, noteOpen: true }))}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-faded hover:text-accent transition"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M5.5 1.5v8M1.5 5.5h8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            加一句话
          </button>
        ) : (
          <textarea
            ref={noteRef}
            value={form.note}
            onChange={(e) =>
              setForm((f) => ({ ...f, note: e.target.value }))
            }
            placeholder="今天的心情、当时的感受、或者一个微小的瞬间……"
            rows={3}
            className="w-full mt-1 px-3 py-2 rounded-[10px] bg-bg-card border border-divider/70 font-serif italic text-[13.5px] text-ink-soft leading-[1.6] placeholder:text-ink-faded/70 focus:outline-none focus:border-accent-soft resize-none"
          />
        )}
      </div>

      {/* 完　成 */}
      <button
        type="button"
        onClick={onDone}
        className="mt-7 w-full py-3.5 rounded-full font-serif text-[15px] tracking-[0.4em] text-bg-card transition-transform active:scale-[0.99] hover:-translate-y-[1px]"
        style={{
          background: "var(--accent)",
          boxShadow: "0 6px 18px rgba(184,105,74,0.32)",
        }}
      >
        {"完　成"}
      </button>
    </div>
  );
}

// ───────────────────────────── 外壳 · 只决定是否挂载内层
// 每次打开 modal，RecordModalInner 都从头 mount 一次 —— 内部 state
// 通过 useState 初始化器天然重置，不需要 effect 同步
export function RecordModal() {
  const { recordOpen } = useTimeline();
  if (!recordOpen) return null;
  return <RecordModalInner />;
}

// ───────────────────────────── 内层 · 拥有 stage / photo / form 状态
function RecordModalInner() {
  const { closeRecord, addMeal } = useTimeline();

  const [stage, setStage] = useState<Stage>(1);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [recognitionStatus, setRecognitionStatus] =
    useState<RecognitionStatus>("miss");
  const [form, setForm] = useState<ConfirmForm>(() => {
    const t = nowHHmm();
    return {
      dish: "",
      time: t,
      place: MOCK_CURRENT_PLACE,
      meal: inferMealType(t),
      who: "alone",
      note: "",
      noteOpen: false,
    };
  });

  // 卸载时若仍持有未 hand-off 的 blob，则回收。已 hand-off 给卡片的不在此处
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc 在 stage 1 关闭（其它 stage 不响应，避免误关已识别中的流程）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage === 1) closeRecord();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, closeRecord]);

  const onPicked = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhotoFile(file);
    setRecognitionStatus("miss");
    setStage(2);

    void recognizeDish(file).then((dish) => {
      if (dish) {
        setForm((f) => ({ ...f, dish: f.dish || dish }));
        setRecognitionStatus("success");
      } else {
        setRecognitionStatus("miss");
      }
      setStage(3);
    });
  }, []);

  const onDone = useCallback(() => {
    addMeal({
      time: form.time,
      who: form.who,
      dish: form.dish.trim() || "一顿饭",
      place: form.place,
      note: form.note.trim() || undefined,
      photoUrl: photoUrl ?? undefined,
      photoFile: photoFile ?? undefined,
    });
    // 把 blob 交给卡片去显示，自己清空引用以免卸载时 revoke
    setPhotoUrl(null);
    setPhotoFile(null);
  }, [addMeal, form, photoUrl, photoFile]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="记下一顿"
      onClick={closeRecord}
      className="absolute inset-0 z-40 flex items-end justify-center"
      style={{
        background: "rgba(46,36,25,0.45)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-[24px] bg-bg flex flex-col animate-[slideUp_0.28s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        style={{ maxHeight: "92%" }}
      >
        <SheetHeader onClose={closeRecord} stage={stage} />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {stage === 1 && <StageCapture onPicked={onPicked} />}
          {stage === 2 && photoUrl && <StageScanning photoUrl={photoUrl} />}
          {stage === 3 && photoUrl && (
            <StageConfirm
              photoUrl={photoUrl}
              form={form}
              setForm={setForm}
              onDone={onDone}
              recognitionStatus={recognitionStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
