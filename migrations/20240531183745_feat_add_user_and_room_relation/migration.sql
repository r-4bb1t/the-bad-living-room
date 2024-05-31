/*
  Warnings:

  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "UsersOnRooms" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "UsersOnRooms_pkey" PRIMARY KEY ("roomId","userId")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRooms" ADD CONSTRAINT "UsersOnRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRooms" ADD CONSTRAINT "UsersOnRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
