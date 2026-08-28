"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  summary: {
    totalConversations: number;
    totalMessages: number;
    totalDecisions: number;
    totalUsers: number;
    totalAnonymousSessions: number;
  };
  events: Record<string, number>;
  metrics: {
    firstQuestionRate: string;
    meaningfulConversationRate: string;
    guestToLoginRate: string;
    decisionSaveRate: string;
  };
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, period]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?period=${period}`);
      if (!res.ok) throw new Error("Failed to load analytics");
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="text-center py-2xl">
          <span className="font-body-md text-on-surface-variant">Loading...</span>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="text-center py-2xl bg-surface-container rounded-3xl border border-outline-variant/50">
          <p className="font-body-lg text-on-surface-variant">Please sign in to view analytics</p>
          <Link
            href="/chat"
            className="inline-block mt-md px-6 py-3 bg-primary text-on-primary rounded-full font-label-md hover:bg-secondary transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="text-center py-2xl bg-surface-container rounded-3xl border border-outline-variant/50">
          <p className="font-body-lg text-on-surface-variant">No data available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex items-center justify-between mb-lg">
          <h1 className="font-display text-display-sm text-on-surface">Analytics</h1>
          <div className="flex gap-sm">
            <button
              onClick={() => setPeriod("7d")}
              className={`px-4 py-2 rounded-full font-label-sm ${
                period === "7d"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`px-4 py-2 rounded-full font-label-sm ${
                period === "30d"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setPeriod("90d")}
              className={`px-4 py-2 rounded-full font-label-sm ${
                period === "90d"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-md mb-xl">
          <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Conversations</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{data.summary.totalConversations}</p>
          </div>
          <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Messages</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{data.summary.totalMessages}</p>
          </div>
          <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Decisions</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{data.summary.totalDecisions}</p>
          </div>
          <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Users</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{data.summary.totalUsers}</p>
          </div>
          <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Guest Sessions</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{data.summary.totalAnonymousSessions}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-xl">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
              <p className="font-label-sm text-label-sm text-on-surface-variant">First Question Rate</p>
              <p className="font-headline-lg text-headline-lg text-primary">{data.metrics.firstQuestionRate}</p>
            </div>
            <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Meaningful Conversation Rate</p>
              <p className="font-headline-lg text-headline-lg text-primary">{data.metrics.meaningfulConversationRate}</p>
            </div>
            <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Guest → Login Rate</p>
              <p className="font-headline-lg text-headline-lg text-primary">{data.metrics.guestToLoginRate}</p>
            </div>
            <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Decision Save Rate</p>
              <p className="font-headline-lg text-headline-lg text-primary">{data.metrics.decisionSaveRate}</p>
            </div>
          </div>
        </div>

        {/* Events */}
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Events</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {Object.entries(data.events).map(([eventType, count]) => (
              <div key={eventType} className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant">{eventType.replace(/_/g, " ")}</p>
                <p className="font-headline-md text-headline-md text-on-surface">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
  );
}
