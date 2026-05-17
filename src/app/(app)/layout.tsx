import { PageHeader } from "@/components/timeline/PageHeader";
import { BottomNav } from "@/components/timeline/BottomNav";
import { RecordModal } from "@/components/timeline/RecordModal";
import { ToastMount } from "@/components/timeline/ToastMount";
import { TimelineProvider } from "@/components/timeline/TimelineProvider";

// 桌面端外侧深色舞台 + 居中的 max-w-[400px] 卡片（不画真实手机壳 svg）
// 移动端 (<=500px) 自动铺满
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimelineProvider>
      <div className="min-h-screen w-full bg-stage flex items-center justify-center md:py-8">
        <div
          className="relative w-full max-w-[400px] bg-bg flex flex-col overflow-hidden
                     h-screen md:h-[min(820px,95vh)] md:rounded-[32px] md:shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {/* 暖纸纹理 · 极轻 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(circle at 18% 22%, rgba(184,105,74,0.04) 0%, transparent 55%), radial-gradient(circle at 82% 78%, rgba(139,115,85,0.05) 0%, transparent 55%)",
            }}
          />

          <PageHeader />

          <main
            id="app-scroll"
            className="relative z-10 flex-1 overflow-y-auto px-5 pb-[120px] no-scrollbar"
          >
            {children}
          </main>

          <BottomNav />
          <RecordModal />
          <ToastMount />
        </div>
      </div>
    </TimelineProvider>
  );
}
