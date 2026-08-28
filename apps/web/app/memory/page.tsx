"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

interface Memory {
  id: string;
  type: string;
  content: string;
  contentEn: string | null;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MemoryPage() {
  const { t } = useI18n();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memory");
      if (!res.ok) throw new Error("Failed to load memories");
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/memory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (!res.ok) throw new Error("Failed to update memory");

      setMemories(memories.map((m) => (m.id === id ? { ...m, content: editContent } : m)));
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) return;

    try {
      const res = await fetch(`/api/memory/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete memory");

      setMemories(memories.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      const res = await fetch(`/api/memory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: archive }),
      });

      if (!res.ok) throw new Error("Failed to update memory");

      setMemories(memories.map((m) => (m.id === id ? { ...m, isArchived: archive } : m)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
          <div className="text-center py-2xl">
            <span className="font-body-md text-on-surface-variant">Loading...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex items-center justify-between mb-lg">
          <h1 className="font-display text-display-sm text-on-surface">Memory</h1>
          <p className="font-body-sm text-on-surface-variant">
            Information your mentor remembers about you
          </p>
        </div>

        {memories.length === 0 && (
          <div className="text-center py-2xl bg-surface-container rounded-3xl border border-outline-variant/50">
            <p className="font-body-lg text-on-surface-variant">
              No memories yet. Start talking with your mentor to build your memory.
            </p>
            <Link
              href="/chat"
              className="inline-block mt-md px-6 py-3 bg-primary text-on-primary rounded-full font-label-md hover:bg-secondary transition-colors"
            >
              Start talking
            </Link>
          </div>
        )}

        <div className="grid gap-md">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className={`p-md md:p-lg bg-surface-container rounded-2xl border border-outline-variant/50 ${
                memory.isArchived ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-md mb-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant capitalize">
                    {memory.type.toLowerCase()}
                  </span>
                  {memory.isArchived && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-label-sm text-label-sm text-tertiary">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(memory)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleArchive(memory.id, !memory.isArchived)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="text-on-surface-variant hover:text-tertiary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {editingId === memory.id ? (
                <div className="space-y-sm">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-sm bg-surface-container-high rounded-xl border border-outline-variant/50 font-body-md text-on-surface resize-none focus:outline-none focus:border-primary"
                    rows={3}
                  />
                  <div className="flex gap-sm">
                    <button
                      onClick={() => handleSave(memory.id)}
                      className="px-4 py-2 bg-primary text-on-primary rounded-full font-label-sm hover:bg-on-primary-fixed-variant transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-label-sm hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body-md text-on-surface-variant whitespace-pre-wrap">{memory.content}</p>
              )}

              <p className="font-body-sm text-on-surface-variant/60 mt-sm">
                Created {new Date(memory.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
