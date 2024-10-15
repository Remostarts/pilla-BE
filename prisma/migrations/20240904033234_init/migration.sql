/*
  Warnings:

  - Changed the type of `dateOfBirth` on the `BankVerification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BankVerification" DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
