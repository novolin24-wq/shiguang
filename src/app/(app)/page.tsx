import { TimelineStream } from "@/components/timeline/TimelineStream";
import { MEMORY } from "@/lib/mock-data";

export const metadata = {
  title: "食光 · 时间线",
};

export default function TimelinePage() {
  return <TimelineStream memory={MEMORY} />;
}
