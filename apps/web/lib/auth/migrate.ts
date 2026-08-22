import { prisma } from "@/lib/db/prisma";

/**
 * Migrate all anonymous session data to a logged-in user.
 *
 * This runs inside the signIn callback, so it must be robust and never throw.
 */
export async function migrateAnonymousSessionToUser(
  anonymousSessionId: string,
  userId: string
): Promise<void> {
  if (!anonymousSessionId || !userId) return;

  try {
    const anonymousSession = await prisma.anonymousSession.findUnique({
      where: { fingerprintId: anonymousSessionId },
    });

    if (!anonymousSession || anonymousSession.migratedToUserId) {
      // Already migrated or not found.
      return;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Migrate conversations
      await tx.conversation.updateMany({
        where: { anonymousSessionId: anonymousSession.id },
        data: { userId, anonymousSessionId: null },
      });

      // 2. Migrate usage records: merge into user's records by date
      const anonymousUsage = await tx.usageRecord.findMany({
        where: { anonymousSessionId: anonymousSession.id },
      });

      for (const usage of anonymousUsage) {
        const userUsage = await tx.usageRecord.findUnique({
          where: {
            userId_date: {
              userId,
              date: usage.date,
            },
          },
        });

        if (userUsage) {
          // Merge counts
          await tx.usageRecord.update({
            where: { id: userUsage.id },
            data: {
              usedCount: userUsage.usedCount + usage.usedCount,
              lastUsedAt: new Date(),
            },
          });
          await tx.usageRecord.delete({ where: { id: usage.id } });
        } else {
          await tx.usageRecord.update({
            where: { id: usage.id },
            data: { userId, anonymousSessionId: null },
          });
        }
      }

      // 3. Mark anonymous session as migrated
      await tx.anonymousSession.update({
        where: { id: anonymousSession.id },
        data: { migratedToUserId: userId },
      });
    });

    console.log(
      `[migrateAnonymousSessionToUser] Migrated anonymous session ${anonymousSession.id} to user ${userId}`
    );
  } catch (err) {
    console.error(
      `[migrateAnonymousSessionToUser] Migration failed for ${anonymousSessionId} -> ${userId}:`
    );
  }
}
