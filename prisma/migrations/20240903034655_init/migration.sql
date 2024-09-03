-- CreateTable
CREATE TABLE "BvnResponse" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT,
    "lastname" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "bvn" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "verificationCountry" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aliases" TEXT[],
    "phone" TEXT[],
    "email" TEXT[],
    "address" TEXT[],
    "nationality" TEXT NOT NULL,
    "lgaOfOrigin" TEXT NOT NULL,
    "lgaOfResidence" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "nextOfKins" TEXT[],
    "nin" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BvnCustomer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BvnPhotoId" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "imageType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BvnEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BvnResponse_id_key" ON "BvnResponse"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BvnCustomer_id_key" ON "BvnCustomer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BvnCustomer_userId_key" ON "BvnCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BvnPhotoId_id_key" ON "BvnPhotoId"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BvnPhotoId_userId_key" ON "BvnPhotoId"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BvnEnrollment_id_key" ON "BvnEnrollment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BvnEnrollment_userId_key" ON "BvnEnrollment"("userId");

-- AddForeignKey
ALTER TABLE "BvnCustomer" ADD CONSTRAINT "BvnCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BvnResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BvnPhotoId" ADD CONSTRAINT "BvnPhotoId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BvnResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BvnEnrollment" ADD CONSTRAINT "BvnEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BvnResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
