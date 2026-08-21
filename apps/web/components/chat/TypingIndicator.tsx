"use client";

export function TypingIndicator() {
  return (
    <div className="w-full flex flex-col gap-unit items-start">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-headline-md text-headline-md text-primary">HerBecoming</span>
      </div>
      <div className="pl-4 border-l-2 border-surface-variant flex gap-1 items-center h-8">
        <div className="w-1.5 h-1.5 bg-tertiary-container rounded-full animate-pulse" />
        <div className="w-1.5 h-1.5 bg-tertiary-container rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-1.5 h-1.5 bg-tertiary-container rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
