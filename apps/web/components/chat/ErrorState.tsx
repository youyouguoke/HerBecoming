"use client";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full flex flex-col items-center gap-md py-6">
      <div className="bg-error-container text-on-error-container px-6 py-4 rounded-2xl max-w-[80%] text-center">
        <p className="font-body-md text-body-md">Something went wrong.</p>
        <p className="font-body-md text-body-md opacity-80 mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-secondary transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
