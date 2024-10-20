/*
  Warnings:

  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Notification_userId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "read",
ADD COLUMN     "actionUrl" TEXT,
ADD COLUMN     "isread" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
