/*
  Warnings:

  - You are about to drop the column `userId` on the `BankVerification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `IdentityVerification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `NextOfKin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProofOfAddress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userVerificationId]` on the table `BankVerification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAccountId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userVerificationId]` on the table `IdentityVerification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userVerificationId]` on the table `NextOfKin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userVerificationId]` on the table `ProofOfAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAccountId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userVerificationId` to the `BankVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAccountId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userVerificationId` to the `IdentityVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userVerificationId` to the `NextOfKin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userVerificationId` to the `ProofOfAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankVerification" DROP CONSTRAINT "BankVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- DropForeignKey
ALTER TABLE "IdentityVerification" DROP CONSTRAINT "IdentityVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "NextOfKin" DROP CONSTRAINT "NextOfKin_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProofOfAddress" DROP CONSTRAINT "ProofOfAddress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "BankVerification_userId_key";

-- DropIndex
DROP INDEX "IdentityVerification_userId_key";

-- DropIndex
DROP INDEX "NextOfKin_userId_key";

-- DropIndex
DROP INDEX "ProofOfAddress_userId_key";

-- AlterTable
ALTER TABLE "BankVerification" DROP COLUMN "userId",
ADD COLUMN     "userVerificationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "userId",
ADD COLUMN     "userAccountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IdentityVerification" DROP COLUMN "userId",
ADD COLUMN     "userVerificationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NextOfKin" DROP COLUMN "userId",
ADD COLUMN     "userVerificationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProofOfAddress" DROP COLUMN "userId",
ADD COLUMN     "userVerificationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId",
ADD COLUMN     "userAccountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "amount";

-- CreateTable
CREATE TABLE "UserVerification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userId_key" ON "UserVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_bankName_key" ON "UserAccount"("bankName");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_accountNumber_key" ON "UserAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_userId_key" ON "UserAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankVerification_userVerificationId_key" ON "BankVerification"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_userAccountId_key" ON "Card"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityVerification_userVerificationId_key" ON "IdentityVerification"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_userVerificationId_key" ON "NextOfKin"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProofOfAddress_userVerificationId_key" ON "ProofOfAddress"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userAccountId_key" ON "Transaction"("userAccountId");

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankVerification" ADD CONSTRAINT "BankVerification_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityVerification" ADD CONSTRAINT "IdentityVerification_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfAddress" ADD CONSTRAINT "ProofOfAddress_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextOfKin" ADD CONSTRAINT "NextOfKin_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
