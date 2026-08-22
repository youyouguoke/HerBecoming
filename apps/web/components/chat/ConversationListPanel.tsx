"use client";

import { useI18n } from "@/components/providers/I18nProvider";

interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
}

interface ConversationListPanelProps {
  open: boolean;
  onClose: () => void;
  conversations: ConversationSummary[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function ConversationListPanel({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNewConversation,
}: ConversationListPanelProps) {
  const { t } = useI18n();

  return (
    <>
      {/* Backdrop for mobile slide-over */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel: mobile slide-over, desktop left dock inside main */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-surface-container border-r border-outline-variant
          transform transition-transform duration-200 ease-out
          md:static md:transform-none md:z-auto md:w-64 md:border-r md:bg-transparent md:block
          ${open ? "translate-x-0" : "-translate-x-full md:hidden"}
        `}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="flex items-center justify-between px-4 mb-4 md:hidden">
            <span className="font-headline-sm text-headline-sm text-on-surface">{t("history.title")}</span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 mb-3">
            <button
              onClick={() => {
                onNewConversation();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md transition-opacity hover:opacity-90"
            >
              <span>+</span>
              <span>{t("history.new_conversation")}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {conversations.length === 0 ? (
              <p className="px-3 py-6 text-center font-body-md text-on-surface-variant">
                {t("history.empty")}
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => onSelect(c.id)}
                      className={`w-full text-left px-3 py-3 rounded-2xl transition-colors font-body-md text-on-surface truncate ${
                        c.id === activeId
                          ? "bg-primary-container text-on-primary-container"
                          : "hover:bg-surface-variant"
                      }`}
                      title={c.title || t("history.untitled")}
                    >
                      <span className="block truncate">
                        {c.title || t("history.untitled")}
                      </span>
                      <span className="block font-label-sm text-on-surface-variant mt-0.5">
                        {formatDate(c.updatedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile slide-over only; desktop list is shown via md:block */}
    </>
  );
}
