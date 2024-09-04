/*
  Warnings:

  - Added the required column `city` to the `NextOfKin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localGovernment` to the `NextOfKin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `NextOfKin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NextOfKin" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "localGovernment" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
