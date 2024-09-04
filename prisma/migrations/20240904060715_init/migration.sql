/*
  Warnings:

  - A unique constraint covering the columns `[nin]` on the table `IdentityVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IdentityVerification" ADD COLUMN     "nin" TEXT,
ALTER COLUMN "documentType" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "idNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IdentityVerification_nin_key" ON "IdentityVerification"("nin");
