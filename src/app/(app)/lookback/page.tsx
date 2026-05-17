import { SoonPlaceholder } from "@/components/timeline/SoonPlaceholder";

export const metadata = { title: "食光 · 回望" };

export default function LookbackPage() {
  return (
    <SoonPlaceholder
      eyebrow="回望"
      title="慢慢翻"
      body="月历、过往的今天、那年这个时候。回望 tab 在 Step 3 之后开启。"
    />
  );
}
