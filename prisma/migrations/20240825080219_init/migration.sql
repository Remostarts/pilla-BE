/*
  Warnings:

  - You are about to drop the column `customerType` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('personal', 'business');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "customerType",
DROP COLUMN "role",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'personal';

-- DropEnum
DROP TYPE "CustomerType";
