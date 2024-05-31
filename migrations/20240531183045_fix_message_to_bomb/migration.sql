/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "Bomb" (
    "roomId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "originalUserId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "via" TEXT[],

    CONSTRAINT "Bomb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bomb" ADD CONSTRAINT "Bomb_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bomb" ADD CONSTRAINT "Bomb_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
