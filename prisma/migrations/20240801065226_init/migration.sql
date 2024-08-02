/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerType` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('personal', 'business');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customerType" "CustomerType" NOT NULL,
ADD COLUMN     "middleName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GettingStartedUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "emailVerificationCode" TEXT,
    "emailVerificationExpiresAt" TIMESTAMP(3),
    "phoneVerificationCode" TEXT,
    "phoneVerificationExpiresAt" TIMESTAMP(3),

    CONSTRAINT "GettingStartedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GettingStartedUser_id_key" ON "GettingStartedUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GettingStartedUser_email_key" ON "GettingStartedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GettingStartedUser_phone_key" ON "GettingStartedUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
