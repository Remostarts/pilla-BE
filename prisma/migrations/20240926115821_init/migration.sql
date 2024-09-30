-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TRANSACTION', 'CHAT', 'SYSTEM');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);
