/*
  Warnings:

  - The primary key for the `Bomb` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Bomb` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Bomb" DROP CONSTRAINT "Bomb_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_ulid(),
ADD CONSTRAINT "Bomb_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_ulid(),
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
