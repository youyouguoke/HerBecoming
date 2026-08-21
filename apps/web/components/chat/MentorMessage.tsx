"use client";

import ReactMarkdown from "react-markdown";

interface MentorMessageProps {
  content: string;
}

export function MentorMessage({ content }: MentorMessageProps) {
  return (
    <div className="w-full flex flex-col gap-unit items-start">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-headline-md text-headline-md text-primary">HerBecoming</span>
        <span className="font-label-sm text-label-sm text-outline">Mentor</span>
      </div>
      <div className="pl-4 border-l-2 border-primary-container max-w-[95%] md:max-w-[80%]">
        <div className="font-body-lg text-body-lg text-on-surface prose prose-sm max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:mb-4 prose-ul:pl-5 prose-li:marker:text-on-surface-variant">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
