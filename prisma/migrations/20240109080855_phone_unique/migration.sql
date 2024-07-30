/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profiles_phoneNumber_key" ON "profiles"("phoneNumber");
