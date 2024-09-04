/*
  Warnings:

  - You are about to drop the column `bankName` on the `UserAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountName]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountName` to the `UserAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAccount_bankName_key";

-- AlterTable
ALTER TABLE "UserAccount" DROP COLUMN "bankName",
ADD COLUMN     "accountName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_accountName_key" ON "UserAccount"("accountName");
