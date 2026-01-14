-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Starter',
ADD COLUMN     "detailImageUrl" TEXT,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GameAccount" ADD COLUMN     "gameOptionId" TEXT;

-- CreateTable
CREATE TABLE "GameOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameOption" ADD CONSTRAINT "GameOption_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAccount" ADD CONSTRAINT "GameAccount_gameOptionId_fkey" FOREIGN KEY ("gameOptionId") REFERENCES "GameOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
