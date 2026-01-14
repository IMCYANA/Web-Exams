-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'BANK';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credit" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "TopupTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "proofUrl" TEXT,
    "refNo" TEXT,
    "fileHash" TEXT,
    "failReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopupTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopupTransaction_refNo_key" ON "TopupTransaction"("refNo");

-- CreateIndex
CREATE UNIQUE INDEX "TopupTransaction_fileHash_key" ON "TopupTransaction"("fileHash");

-- AddForeignKey
ALTER TABLE "TopupTransaction" ADD CONSTRAINT "TopupTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
