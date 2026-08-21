"use client";

import { UsageState } from "@/lib/chat/types";

interface UsageIndicatorProps {
  usage: UsageState;
}

export function UsageIndicator({ usage }: UsageIndicatorProps) {
  if (usage.used === 0) return null;
  return (
    <div className="text-center">
      <span className="font-label-sm text-label-sm text-tertiary">
        {usage.remaining} free question{usage.remaining === 1 ? "" : "s"} remaining today
      </span>
    </div>
  );
}
