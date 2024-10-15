/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_phoneNumber_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "phoneNumber";
