import { prisma } from "@/lib/db/prisma";
import { EventType } from "@prisma/client";

export interface TrackEventInput {
  eventType: EventType;
  userId?: string | null;
  anonymousSessionId?: string | null;
  conversationId?: string | null;
  messageId?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Track an analytics event.
 * This is a fire-and-forget operation - errors are logged but not thrown.
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: input.eventType,
        userId: input.userId || null,
        anonymousSessionId: input.anonymousSessionId || null,
        conversationId: input.conversationId || null,
        messageId: input.messageId || null,
        metadata: input.metadata || {},
      },
    });
  } catch (error) {
    // Silently fail - analytics should not break the main flow
    console.error("[trackEvent] Failed to track event:", error);
  }
}

/**
 * Track conversation start event.
 */
export async function trackConversationStart(
  userId?: string | null,
  anonymousSessionId?: string | null,
  conversationId?: string
): Promise<void> {
  await trackEvent({
    eventType: "CONVERSATION_START",
    userId,
    anonymousSessionId,
    conversationId,
  });
}

/**
 * Track message sent event.
 */
export async function trackMessageSent(
  userId?: string | null,
  anonymousSessionId?: string | null,
  conversationId?: string,
  messageId?: string,
  role?: string
): Promise<void> {
  await trackEvent({
    eventType: "MESSAGE_SENT",
    userId,
    anonymousSessionId,
    conversationId,
    messageId,
    metadata: { role },
  });
}

/**
 * Track decision saved event.
 */
export async function trackDecisionSaved(
  userId: string,
  conversationId?: string,
  messageId?: string
): Promise<void> {
  await trackEvent({
    eventType: "DECISION_SAVED",
    userId,
    conversationId,
    messageId,
  });
}

/**
 * Track user login event.
 */
export async function trackUserLogin(
  userId: string,
  provider?: string
): Promise<void> {
  await trackEvent({
    eventType: "USER_LOGIN",
    userId,
    metadata: { provider },
  });
}

/**
 * Track feedback given event.
 */
export async function trackFeedbackGiven(
  userId: string,
  conversationId?: string,
  messageId?: string,
  helpful?: boolean
): Promise<void> {
  await trackEvent({
    eventType: "FEEDBACK_GIVEN",
    userId,
    conversationId,
    messageId,
    metadata: { helpful },
  });
}
