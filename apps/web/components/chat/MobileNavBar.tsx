"use client";

export function MobileNavBar() {
  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container rounded-t-xl shadow-sm pb-safe">
      <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl w-16">
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="font-label-sm text-[10px] text-center">Journal</span>
      </a>
      <a href="/chat" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full p-2 w-20 -top-3 shadow-sm">
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-label-sm text-[11px] text-center font-bold">Mentor</span>
      </a>
      <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl w-16">
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-label-sm text-[10px] text-center">Growth</span>
      </a>
    </div>
  );
}
