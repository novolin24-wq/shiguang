"use client";

import { Toast } from "./Toast";
import { useTimeline } from "./TimelineProvider";

export function ToastMount() {
  const { toast } = useTimeline();
  return <Toast message={toast} />;
}
