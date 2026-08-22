-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "helpful" BOOLEAN;

-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_messageId_key" ON "feedbacks"("messageId");

-- CreateIndex
CREATE INDEX "feedbacks_userId_idx" ON "feedbacks"("userId");

-- AlterTable
ALTER TABLE "feedbacks" ALTER COLUMN "updatedAt" DROP DEFAULT;
