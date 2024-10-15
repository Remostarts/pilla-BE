-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "cvv" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
