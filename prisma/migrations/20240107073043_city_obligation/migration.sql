/*
  Warnings:

  - Made the column `city` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "city" SET NOT NULL;
