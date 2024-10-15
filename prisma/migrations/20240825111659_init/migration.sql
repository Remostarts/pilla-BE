/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('personal', 'business', 'admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'personal';

-- DropEnum
DROP TYPE "Roles";
