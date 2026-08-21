"use client";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="w-full flex justify-end">
      <div className="max-w-[85%] md:max-w-[70%] bg-surface-container-highest rounded-2xl rounded-tr-sm px-6 py-5 shadow-sm border border-outline-variant/50">
        <p className="font-body-lg text-body-lg text-on-surface whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
